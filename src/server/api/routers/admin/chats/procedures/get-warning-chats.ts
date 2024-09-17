import { moderProcedure } from "@/server/api/trpc";

export const getWarningMessagesProcedure = moderProcedure
    .query(async ({ ctx }) => {
        const warningMessages = await ctx.db.warningMessages.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            distinct: ['chatId'],
            include: {
                User: {
                    select: {
                        id: true,
                        email: true,
                        tel: true,
                        name: true,
                    }
                },
                Chat: {
                    include: {
                        AdvertismentRequest: { 
                            include: {
                                AdvertismentPost: {
                                    include: {
                                        Creator: true
                                    }
                                },
                                Blogger: {
                                    include: {
                                        User: true
                                    }
                                }
                            }
                        },
                        
                    }
                }
            }
        });

        return warningMessages;
    });