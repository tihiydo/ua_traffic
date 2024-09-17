import { ERROR_CODES } from "@/constants/error-codes";
import { protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const markDoneAdvertismentSchema = z.object({
    advertismentRequestId: z.string()
})

export const markDoneAdvertismentProcedure = protectedProcedure
    .input(markDoneAdvertismentSchema)
    .mutation(async ({ ctx, input }) => {
        const advertismentRequest = await ctx.db.advertismentRequest.findUnique({
            where: {
                id: input.advertismentRequestId
            },
            include: {
                AdvertismentPost: true
            }
        })

        if (!advertismentRequest) {
            throw new TRPCError({ code: 'NOT_FOUND', message: ERROR_CODES.ADV_REQ_NOT_FOUND })
        }

        if (advertismentRequest.status !== 'Accepted') {
            throw new TRPCError({ code: 'BAD_REQUEST', message: ERROR_CODES.INVALID_DONE_REQ_STATUS })
        }


        const requestBlogger = await ctx.db.blogger.findUnique({
            where: {
                id: advertismentRequest.bloggerId
            }
        });

        if (!requestBlogger) {
            throw new TRPCError({ code: 'NOT_FOUND', message: ERROR_CODES.BLOGGER_NOT_FOUND })
        }

        if (requestBlogger.userId !== ctx.session.user.id) {
            throw new TRPCError({ code: 'FORBIDDEN', message: ERROR_CODES.BLOGGER_NOT_ASIGNEE })
        }

        return await ctx.db.advertismentRequest.update({
            where: {
                id: advertismentRequest.id
            },
            data: {
                status: "Moderating",
            },
            include: {
                Blogger: true,
                AdvertismentPost: true,
                Chat: true
            }
        })
    })  