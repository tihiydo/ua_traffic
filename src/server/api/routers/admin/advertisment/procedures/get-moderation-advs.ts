import { adminProcedure, moderProcedure } from "@/server/api/trpc";
import { parseAdPost } from "@/database/ad-post/post";
import { z } from "zod";

const getModerationAdvertismentsSchema = z.undefined();

export const getModerationAdvertismentsProcedure = moderProcedure
    .input(getModerationAdvertismentsSchema)
    .query(async ({ ctx }) => {
        const advertismemts = await ctx.db.advertismentPost.findMany({
            orderBy: {
                createdAt: 'desc'
            },
        });

        return advertismemts.map(parseAdPost);
    })