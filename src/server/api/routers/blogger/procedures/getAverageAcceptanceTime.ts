import { publicProcedure } from '@/server/api/trpc';
import { z } from 'zod';

export const getAverageAcceptanceTime = publicProcedure
    .input(z.object({ bloggerId: z.string() }))
    .query(async ({ ctx, input }) => {
        const lastThreeAcceptedRequests = await ctx.db.advertismentRequest.findMany({
            where: {
                status: {
                    in: ['Accepted', 'Done', 'Moderating']
                },
                bloggerId: input.bloggerId
            },
            orderBy: { updatedAt: 'desc' },
            take: 10,
            select: { createdAt: true, updatedAt: true }
        });

        if (lastThreeAcceptedRequests.length < 10) {
            return null;
        }

        const totalTime = lastThreeAcceptedRequests.reduce((sum, request) => {
            return sum + (request.updatedAt.getTime() - request.createdAt.getTime());
        }, 0);

        const averageTime = totalTime / lastThreeAcceptedRequests.length;
        return averageTime;
    });

