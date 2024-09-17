import { protectedProcedure } from "@/server/api/trpc";
import { parseAdPost } from "@/database/ad-post/post";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const getPostInput = z.object({
    postId: z.string()
});

export const getPostProcedure = protectedProcedure
    .input(getPostInput)
    .query(async ({ input, ctx }) => {
        const adv = await ctx.db.advertismentPost.findUnique({
            where: {
                id: input.postId
            },
            include: {
                Creator: true
            }
        });

        if (!adv) {
            throw new TRPCError({ code: "NOT_FOUND", message: 'Пост не знайдено' })
        }

        return parseAdPost(adv);
    })