import { ERROR_CODES } from "@/constants/error-codes";
import { protectedProcedure } from "@/server/api/trpc";
import { isWithinHoursMinutesInterval } from "@/utils/dates";
import { TRPCError } from "@trpc/server";
import { isWithinInterval } from "date-fns";
import { z } from "zod";

const acceptAdvetismentSchema = z.object({
    advertismentRequestId: z.string(),
    exactDate: z.date(),
    acceptedAt: z.date().optional()
})

export const acceptAdvetismentProcedure = protectedProcedure
    .input(acceptAdvetismentSchema)
    .mutation(async ({ ctx, input }) => {
        const advertismentRequest = await ctx.db.advertismentRequest.findUnique({
            where: {
                id: input.advertismentRequestId
            }
        })

        if (!advertismentRequest) {
            throw new TRPCError({ code: 'NOT_FOUND', message: ERROR_CODES.ADV_REQ_NOT_FOUND })
        }

        if (advertismentRequest.status !== 'New') {
            throw new TRPCError({ code: 'BAD_REQUEST', message: ERROR_CODES.INVALID_ACCEPT_REQ_STATUS })
        }

        if (
            !isWithinHoursMinutesInterval(input.exactDate, { end: advertismentRequest.dateTo, start: advertismentRequest.dateFrom }) ||
            !isWithinInterval(input.exactDate, { end: advertismentRequest.dateTo, start: advertismentRequest.dateFrom })
        ) {
            throw new TRPCError({ code: 'BAD_REQUEST', message: ERROR_CODES.UNSATISFACTORY_ADVERTISER_TIME })
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
                status: "Accepted",
                exactDate: input.exactDate,
                acceptedAt: new Date(),
            },
            include: {
                AdvertismentPost: true,
                Blogger: true,
                Chat: true
            }
        })
    })  