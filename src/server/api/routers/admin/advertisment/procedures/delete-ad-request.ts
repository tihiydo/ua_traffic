import { ERROR_CODES } from "@/constants/error-codes";
import { adminProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const deleteReqInput = z.object({
    reqId: z.string()
})

export const deleteAdRequestProcedure = adminProcedure
    .input(deleteReqInput)
    .mutation(async ({ ctx, input }) => {
        const request = await ctx.db.advertismentRequest.findUnique({
            where: {
                id: input.reqId
            },
            include: {
                Blogger: {
                    include: {
                        User: true
                    }
                },
                AdvertismentPost: {
                    include: {
                        Creator: {
                            select: {
                                id: true
                            }
                        }
                    }
                }
            }
        })

        if (!request?.id) {
            throw new TRPCError({ code: 'NOT_FOUND', message: ERROR_CODES.ADV_REQ_NOT_FOUND })
        }


        await ctx.db.$transaction([
            // Decrement blogger hold balance
            ctx.db.user.update({
                where: {
                    id: request.Blogger.User.id
                },
                data: {
                    bloggerHoldBalance: {
                        decrement: request.price
                    }
                }
            }),
            // Decrement advertiser hold balance & Increment advertiser balance
            ctx.db.user.update({
                where: {
                    id: request.AdvertismentPost.Creator.id
                },
                data: {
                    advertiserHoldBalance: {
                        decrement: request.price
                    },
                    advertiserBalance: {
                        increment: request.price
                    }
                }
            }),
            // Delete Adv request
            ctx.db.advertismentRequest.delete({
                where: {
                    id: request.id
                },
            })
        ])

    })