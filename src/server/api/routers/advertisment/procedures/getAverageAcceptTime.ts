import { protectedProcedure } from '@/server/api/trpc';

export const getAverageAcceptanceTimeProcedure = protectedProcedure
    .query(async ({ ctx }) => {
        const lastThreeAcceptedRequests = await ctx.db.advertismentRequest.findMany({
            where: {
                status: "Accepted",
                Blogger: { userId: ctx.session.user.id }
            },
            orderBy: { updatedAt: 'desc' },
            take: 3,
            select: { createdAt: true, updatedAt: true }
        });

        if (lastThreeAcceptedRequests.length < 3) {
            return null; // Not enough data
        }

        const totalTime = lastThreeAcceptedRequests.reduce((sum, request) => {
            return sum + (request.updatedAt.getTime() - request.createdAt.getTime());
        }, 0);

        const averageTime = totalTime / lastThreeAcceptedRequests.length;
        return averageTime;
    });