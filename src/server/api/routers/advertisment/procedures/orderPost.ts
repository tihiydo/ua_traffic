import { ERROR_CODES } from "@/constants/error-codes";
import { protectedProcedure } from "@/server/api/trpc";
import { AdPostType, InstagramAdPostType, TelegramAdPostType } from "@/database/ad-post/post/post-types";
import { type BloggerPrices } from "@/socials/shared/types";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { type SocialType } from "@prisma/client";
import { getDiscountedPrice } from '@/utils/discount';

const orderPostSchema = z.object({
    postId: z.string(),
    bloggerId: z.string(),
    date: z.object({
        from: z.date(),
        to: z.date()
    }),
    postType: z.nativeEnum(AdPostType).optional()
});

export const orderPostProcedure = protectedProcedure
    .input(orderPostSchema)
    .mutation(async ({ ctx, input }) => {
        const post = await ctx.db.advertismentPost.findUnique({
            where: {
                id: input.postId
            },
            include: {
                AdvertismentRequest: true
            }
        })

        const existingBloggerRequest = post?.AdvertismentRequest
            // Filter out only adv requests sent to this blogger
            .filter(req => {
                return req.bloggerId === input.bloggerId
            })
            // Sort advertisment requests in desc order by createAt date
            .sort((req1, req2) => {
                return req2.createdAt.getTime() - req1.createdAt.getTime();
            })
            // Get the newest request
            .at(0)

        // Cant order post if previous post was not finished
        if (existingBloggerRequest && existingBloggerRequest.status !== 'Declined' && existingBloggerRequest.status !== 'Done') {
            throw new TRPCError({ code: 'BAD_REQUEST', message: ERROR_CODES.PAST_ADV_REQ_NOT_FINISHED })
        }

        if (!post) {
            throw new TRPCError({ code: 'NOT_FOUND', message: ERROR_CODES.ADV_POST_NOT_FOUND })
        }

        const postType = post.initialType ?? input.postType;

        if (!postType) {
            throw new TRPCError({ code: "BAD_REQUEST", message: ERROR_CODES.REQUIRED_POST_TYPE })
        }


        const blogger = await ctx.db.blogger.findUnique({
            where: {
                id: input.bloggerId
            }
        })

        if (!blogger) {
            throw new TRPCError({ code: 'NOT_FOUND', message: ERROR_CODES.BLOGGER_NOT_FOUND })
        }

        if (blogger.status !== 'Active') {
            throw new TRPCError({ code: 'BAD_REQUEST', message: ERROR_CODES.BLOGGER_INACTIVE })
        }

        if (blogger.type !== post.social) {
            throw new TRPCError({ code: 'BAD_REQUEST', message: ERROR_CODES.INVALID_BLOGGER_POST })
        }

        const advertismentPrice = (blogger.prices as BloggerPrices)[post.initialType ?? input.postType!];
        if (!advertismentPrice || typeof advertismentPrice.amount !== 'number') {
            throw new TRPCError({ code: 'BAD_REQUEST', message: ERROR_CODES.INVALID_BLOGGER_POST })
        }

        const discountedPrice = getDiscountedPrice(advertismentPrice);

        const advertiserUser = await ctx.db.user.findUnique({
            where: {
                id: ctx.session.user.id
            }
        });

        if (!advertiserUser) {
            throw new TRPCError({ code: 'NOT_FOUND', message: ERROR_CODES.ADVERTISER_NOT_FOUND })
        }

        if (advertiserUser.advertiserBalance < discountedPrice) {
            throw new TRPCError({ code: 'FORBIDDEN', message: ERROR_CODES.NOT_ENOUGHT_MONEY })
        }

        if (!isValidPostTypeSocial(post.social, postType)) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: ERROR_CODES.POST_SOCIAL_NOT_MATCH
            })
        }



        return await ctx.db.$transaction([
            // Create request with requestTransaction
            ctx.db.advertismentRequest.create({
                data: {
                    dateFrom: input.date.from,
                    dateTo: input.date.to,
                    price: discountedPrice,
                    bloggerId: blogger.id,
                    advertismentPostId: post.id,
                    type: postType,
                    AdRequestTransaction: {
                        create: {
                            amount: discountedPrice,
                        }
                    }
                },
                include: {
                    AdvertismentPost: true
                }
            }),
            // Decrement advertiser balance & Increment advertiser hold balance
            ctx.db.user.update({
                where: {
                    id: advertiserUser.id
                },
                data: {
                    advertiserBalance: {
                        decrement: discountedPrice
                    },
                    advertiserHoldBalance: {
                        increment: discountedPrice
                    }
                }
            }),
            // Increment blogger hold balance
            ctx.db.user.update({
                where: {
                    id: blogger.userId
                },
                data: {
                    bloggerHoldBalance: {
                        increment: discountedPrice
                    }
                }
            }),

        ])
    })

function isValidPostTypeSocial(social: SocialType, postType: string) {
    if (social === 'Instagram') {
        return Object.values(InstagramAdPostType).includes(postType);
    }

    if (social === 'Telegram') {
        return Object.values(TelegramAdPostType).includes(postType);
    }

    return false;
}