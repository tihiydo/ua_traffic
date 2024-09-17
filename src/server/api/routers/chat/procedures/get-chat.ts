import { ERROR_CODES } from "@/constants/error-codes";
import { protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const getChatInput = z.object({
    id: z.string()
})

export const getChatProcedure = protectedProcedure
    .input(getChatInput)
    .query(async ({ ctx, input }) => {
        const chat = await ctx.db.chat.findUnique({
            where: {
                id: input.id
            },
            include: {
                AdvertismentRequest: {
                    include: {
                        AdvertismentPost: {
                            include: {
                                Creator: {
                                    select: {
                                        email: true,
                                        id: true
                                    }
                                }
                            }
                        },
                        Blogger: {
                            select: {
                                username: true,
                                id: true
                            }
                        }
                    }
                },
                participants: {
                    select: {
                        id: true,
                        name: true,
                        selectedCabinet: true
                    }
                }
            }
        })

        if (!chat) {
            throw new TRPCError({ code: 'NOT_FOUND', message: ERROR_CODES.CHAT_NOT_FOUND })
        }

        return chat;
    })