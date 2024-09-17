import { moderProcedure } from "@/server/api/trpc";
import { AdRequestTransactionStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const moderateRequestSchema = z.object({
    requestId: z.string()
})

export const moderateRequestProcedure = moderProcedure
    .input(moderateRequestSchema)
    .mutation(async ({ ctx, input }) => {
        const advertismentRequest = await ctx.db.advertismentRequest.findUnique({
            where: {
                id: input.requestId
            },
            include: {
                AdvertismentPost: true
            }
        })

        if (!advertismentRequest) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Заявки не занайдено' })
        }

        if (advertismentRequest.status !== 'Moderating') {
            throw new TRPCError({ code: 'BAD_REQUEST', message: 'Заявка не в стані модерації' })
        }


        const requestBlogger = await ctx.db.blogger.findUnique({
            where: {
                id: advertismentRequest.bloggerId
            }
        });

        if (!requestBlogger) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Блогера не занайдено' })
        }

        const transactionResult = await ctx.db.$transaction([
            ctx.db.advertismentRequest.update({
                where: {
                    id: advertismentRequest.id
                },
                data: {
                    status: "Done",
                    AdRequestTransaction: {
                        update: {
                            status: AdRequestTransactionStatus.Done
                        }
                    }
                },
                include: {
                    Blogger: true,
                    AdvertismentPost: true,
                    Chat: true
                }
            }),
            // Decrement blogger hold balance and increment blogger balance
            ctx.db.user.update({
                where: {
                    id: requestBlogger.userId
                },
                data: {
                    bloggerHoldBalance: {
                        decrement: advertismentRequest.price
                    },
                    bloggerBalance: {
                        increment: advertismentRequest.price
                    }
                }
            }),
            // Decrement creator hold balance
            ctx.db.user.update({
                where: {
                    id: advertismentRequest.AdvertismentPost.creatorId
                },
                data: {
                    advertiserHoldBalance: {
                        decrement: advertismentRequest.price
                    }
                }
            }),
        ])

        return transactionResult[0];
    })