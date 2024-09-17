import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { type Prisma, SocialType, AdvertismentPostStatus } from "@prisma/client";

const filterSchema = z
    .object({
        status: z.nativeEnum(AdvertismentPostStatus),
        social: z.nativeEnum(SocialType),
        types: z.array(z.string()),
        showRequests: z.boolean().default(false)
    })
    .partial()

const getManyAdvertismentsSchema = z.object({
    filters: filterSchema.optional()
})

export const getManyAdvertismentsProcedure = protectedProcedure
    .input(getManyAdvertismentsSchema)
    .query(async ({ ctx, input }) => {
        const { filters } = input;

        let prismaFindOptions: Prisma.AdvertismentPostFindManyArgs = {
            where: {
                creatorId: ctx.session.user.id,
            }
        }

        if (!filters?.showRequests) {
            prismaFindOptions = {
                ...prismaFindOptions,
                where: {
                    ...prismaFindOptions.where,
                    AdvertismentRequest: {
                        none: {}    
                    }
                }
            }
        }

        if (filters?.types) {
            prismaFindOptions = {
                ...prismaFindOptions,
                where: {
                    ...prismaFindOptions.where,
                    // Pick only posts of certain type
                    OR: filters.types.map((postType) => ({
                        initialType: postType
                    }))
                }
            }
        }

        if (filters?.social) {
            prismaFindOptions = {
                ...prismaFindOptions,
                where: {
                    ...prismaFindOptions.where,
                    social: filters.social
                }
            }
        }

        if (filters?.status) {
            prismaFindOptions = {
                ...prismaFindOptions,
                where: {
                    ...prismaFindOptions.where,
                    status: filters.status
                }
            }
        }

        const advertisments = await ctx.db.advertismentPost.findMany(prismaFindOptions)

        return advertisments;
    })