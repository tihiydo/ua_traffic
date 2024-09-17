import { moderProcedure, adminProcedure } from "@/server/api/trpc";

export const getChatsListProcedure = moderProcedure
    .query(async ({ ctx }) => {
        const chats = await ctx.db.chat.findMany({
            orderBy: {
                createdAt: 'desc'
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
                            include: {
                                User: {
                                    select: {
                                        id: true,
                                        email: true,
                                        tel: true,
                                    }
                                },
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

        return chats;
    })