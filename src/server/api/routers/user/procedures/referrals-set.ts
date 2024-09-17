import { locales } from "@/i18n/config";
import { createUnionSchema } from "@/lib/zod/create-many-union";
import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";


export const setInviter = protectedProcedure
    .input(z.object({inviterId: z.string(), datetime: z.string()}))
    .mutation(async ({ ctx, input }) =>
    {

        const findGuestAccount = await ctx.db.user.findUnique(
            {
                where:
                {
                    id: ctx.session.user.id
                },
                select:
                {
                    email: true,
                    userRowCreatedAt: true
                }
            }
        )

        if(!findGuestAccount) return false

        const findGuestInRef = await ctx.db.referrals.findUnique(
            {
                where:
                {
                    guestUserId: ctx.session.user.id
                }
            }
        )

        if(ctx.session.user.id == input.inviterId) return false
    
        const date = findGuestAccount.userRowCreatedAt.getTime() + (25 * 60 * 1000)
        const timeDifference = new Date().getTime() > date

        const findInviter = await ctx.db.user.findUnique(
            {
                where:
                {
                    id: input.inviterId
                }
            }
        )

        // console.warn("ЗАЛУПА")
        // console.warn(findGuestInRef, findInviter, timeDifference)

        if(findGuestInRef === null && findInviter !== null && !timeDifference)
        {
            const time = new Date(Date.parse(input.datetime))
            const createRow = await ctx.db.referrals.create({data: {
                inviterUserId: input.inviterId,
                guestUserId: ctx.session.user.id,
                guestInvitedDate: time,
                guestEmail: findGuestAccount?.email ? findGuestAccount.email : null
            }})
            return createRow
        }
        else
        {
            return false
        }
    })