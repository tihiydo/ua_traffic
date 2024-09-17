import { z } from "zod";
import { moderProcedure, createTRPCRouter, adminProcedure } from "@/server/api/trpc";


export const usersRouter = createTRPCRouter({
    getUsers: moderProcedure
        .query(async ({ ctx }) => {
            const users = await ctx.db.user.findMany({})

            return users;
        }),
    deleteUser: adminProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const data = await ctx.db.user.delete({
                where: {
                    id: input.id
                },
                select: {
                    email: true
                }
            })

            return data.email
        }),
    blockUser: moderProcedure
        .input(
            z.object({ block: z.boolean(), id: z.string() })
        )
        .mutation(async ({ input, ctx }) => {
            const users = await ctx.db.user.update({
                where: {
                    id: input.id
                },
                data: {
                    banned: input.block
                }
            })

            return users;
        })
})