import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { TOTP } from 'otpauth';

const verify2faInput = z.object({
    pin: z.string()
        .refine(el => el.replace(" ", "").length == 6)
        .optional(),
    remove: z.boolean().optional(),
    email: z.string()
})

export const verify2fa = publicProcedure
    .input(verify2faInput)
    .mutation(async ({ ctx, input }) => {
        const user = await ctx.db.user.findUnique({
            where:
            {
                email: input.email
            },
            select:
            {
                twofaGoogle: true,
                email: true
            }
        })
        if (!user) return

        if (user.twofaGoogle != null) {
            let totpResult: boolean;
            if (input.pin !== undefined) {
                const totp = new TOTP({
                    label: `UATRAFFIC | ${user.email?.split("@")[0]?.toUpperCase()}`,
                    algorithm: "SHA1",
                    digits: 6,
                    secret: user.twofaGoogle
                });
                totpResult = totp.validate({ token: input.pin }) !== null;
            } else {
                totpResult = true
            }


            if (input.remove === true && totpResult) {
                const update = await ctx.db.user.update({
                    where:
                    {
                        email: input.email
                    },
                    data:
                    {
                        twofaGoogle: null
                    }
                })

                return { 
                    removed: true,
                    user: update,
                    totpResult
                }
            }

            return {
                removed: false,
                totpResult
            }
        }
    })