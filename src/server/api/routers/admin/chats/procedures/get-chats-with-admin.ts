import { moderProcedure } from '@/server/api/trpc';

export const getChatsWithAdmin = moderProcedure
	.query(async ({ ctx }) => {
		const chatsWithAdmin = await ctx.db.chat.findMany({
			where: {
				isAdminChat: true,
			},
			orderBy: {
				updatedAt: 'desc',
			},
			include: {
				participants: {
					select: {
						id: true,
						email: true,
						tel: true,
						name: true,
					},
				},
				messages: {
					orderBy: {
						createdAt: 'desc',
					},
					take: 1,
					include: {
						sender: {
							select: {
								id: true,
								name: true,
							},
						},
					},
				},
				AdvertismentRequest: {
					include: {
						AdvertismentPost: {
							include: {
								Creator: true,
							},
						},
						Blogger: {
							include: {
								User: true,
							},
						},
					},
				},
				warningMessages: {
					orderBy: {
						createdAt: 'desc',
					},
					take: 1,
				},
			},
		});

		return chatsWithAdmin;
	});