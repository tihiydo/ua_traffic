import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const getBloggerChatsProcedure = protectedProcedure
    .input(z.object({ userId: z.string() }).optional())
    .query(async ({ input, ctx }) => {
        const userId = input?.userId ?? ctx.session.user.id;

        const chats = await ctx.db.chat.findMany({
            where: {
                OR: [
                    {
                        AdvertismentRequest: {
                            Blogger: {
                                userId: userId
                            }
                        },
                    },
                    {
                        isAdminChat: true,
                        participants: {
                            some: {
                                id: userId,
                                selectedCabinet: 'Blogger'
                            }
                        }
                    }
                ]
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
                            },
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