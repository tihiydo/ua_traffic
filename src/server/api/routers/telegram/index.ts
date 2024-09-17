import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { getMyTelegramProfileProcedure } from "./procedures/get-telegram-profile";
import { deleteMyVerifRequest } from "./procedures/delete-my-verif-request";
import { unlinkNotificationProcedures } from "./procedures/unlink-notifications";


export const telegramRouter = createTRPCRouter({
    сreateRow: protectedProcedure
        .mutation(async ({  ctx }) => {
            const randomKey = (lenght = 18) => {
                return Math.random().toString(36).slice(2, lenght + 2);
            }

            const existingTelegramVerificationRequest = await ctx.db.telegramVerificationRequests.findUnique({
                where: {
                    userId: ctx.session.user.id
                }
            })

            if (!existingTelegramVerificationRequest) {
                const verificationRequest = await ctx.db.telegramVerificationRequests.create
                (
                    {
                        data:
                            {
                                cryptedStartKey: randomKey(),
                                createdAt: new Date(Date.now()),
                                userId: ctx.session.user.id
                            }
                    }
                )
                return verificationRequest.cryptedStartKey
            } else {
                //EXPIRED
                if (existingTelegramVerificationRequest.createdAt.getTime() + 5 * 60 * 1000 < Date.now()) {
                    await ctx.db.telegramVerificationRequests.delete({
                        where:
                        {
                            userId: ctx.session.user.id
                        }
                    })

                    const verificationRequest = await ctx.db.telegramVerificationRequests.create
                    (
                        {
                            data:
                                {
                                    cryptedStartKey: randomKey(),
                                    createdAt: new Date(Date.now()),
                                    userId: ctx.session.user.id
                                }
                        }
                    )
                    return verificationRequest.cryptedStartKey
                }
                // NOT EXPIRED, UPDATE
                else {
                    const updateVerificationRequest = await ctx.db.telegramVerificationRequests.update
                    (
                        {
                            where:
                                {
                                    userId: ctx.session.user.id
                                },
                            data:
                                {
                                    cryptedStartKey: randomKey(),
                                    createdAt: new Date(Date.now()),
                                    userId: ctx.session.user.id
                                }
                        }
                    )
                    return updateVerificationRequest.cryptedStartKey
                }

            }
        }),
    getMyTelegramProfile: getMyTelegramProfileProcedure,
    deleteMyVerifRequest: deleteMyVerifRequest,
    unlinkNotification: unlinkNotificationProcedures
})