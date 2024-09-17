import { z } from "zod";

export const crutchResponse = z.object({
    graphql: z.object({
        user: z.object({
            profile_pic_url: z.string(),
        })
    })
});