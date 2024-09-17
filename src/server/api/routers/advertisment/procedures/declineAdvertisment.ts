import { ERROR_CODES } from "@/constants/error-codes";
import { protectedProcedure } from "@/server/api/trpc";
import { AdRequestTransactionStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const declineAdvertismentSchema = z.object({
    advertismentRequestId: z.string()
})

export const declineAdvertismentProcedure = protectedProcedure
    .input(declineAdvertismentSchema)
    .mutation(async ({ ctx, input }) => {
        const advertismentRequest = await ctx.db.advertismentRequest.findUnique({
            where: {
                id: input.advertismentRequestId
            },
            include: {
                AdvertismentPost: true,
                Blogger: true,
            }
        })

        if (!advertismentRequest) {
            throw new TRPCError({ code: 'NOT_FOUND', message: ERROR_CODES.ADV_REQ_NOT_FOUND })
        }

        if (advertismentRequest.status !== 'New') {
            throw new TRPCError({ code: 'BAD_REQUEST', message: ERROR_CODES.INVALID_DECLINE_REQ_STATUS })
        }


        const requestBlogger = await ctx.db.blogger.findUnique({
            where: {
                id: advertismentRequest.bloggerId
            }
        });

        if (!requestBlogger) {
            throw new TRPCError({ code: 'NOT_FOUND', message: ERROR_CODES.BLOGGER_NOT_FOUND })
        }

        if (requestBlogger.userId !== ctx.session.user.id) {
            throw new TRPCError({ code: 'FORBIDDEN', message: ERROR_CODES.BLOGGER_NOT_ASIGNEE })
        }

        const transactionResult = await ctx.db.$transaction([
            ctx.db.advertismentRequest.update({
                where: {
                    id: advertismentRequest.id
                },
                data: {
                    status: "Declined",
                    AdRequestTransaction: {
                        update: {
                            status: AdRequestTransactionStatus.Cancelled
                        }
                    }
                },
                include: {
                    Blogger: true,
                    AdvertismentPost: true,
                    Chat: true
                }
            }),
            // Decrement blogger hold balance
            ctx.db.user.update({
                where: {
                    id: requestBlogger.userId
                },
                data: {
                    bloggerHoldBalance: {
                        decrement: advertismentRequest.price
                    }
                }
            }),
            // Move avertiser money from hold to balance creator hold balance
            ctx.db.user.update({
                where: {
                    id: advertismentRequest.AdvertismentPost.creatorId
                },
                data: {
                    advertiserHoldBalance: {
                        decrement: advertismentRequest.price
                    },
                    advertiserBalance: {
                        increment: advertismentRequest.price
                    }
                }
            }),
        ])

        return transactionResult[0];
    })  