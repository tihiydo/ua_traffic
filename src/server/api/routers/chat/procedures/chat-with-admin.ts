import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { sendMessage } from '@/modules/chat/api/send-message';
import { type ChatMemberRole } from '@/modules/chat/types';
import { getTranslations } from 'next-intl/server';

const createChatWithAdminInput = z.object({
    commissionType: z.enum(["deposit", "withdrawal", "transfer"]),
});

export const createChatWithAdminProcedure = protectedProcedure
    .input(createChatWithAdminInput)
    .mutation(async ({ ctx, input }) => {
        
        const userId = ctx.session.user.id;
        
        const user = await ctx.db.user.findUnique({
            where: { id: userId },
        });
        
        if (!user) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "User not found",
            });
        }
        const translate = await getTranslations({ locale: user.preferedLocale })
		const chatTitle = `${translate('Default.ChatTitle')}`;
        const chat = await ctx.db.chat.create({
            data: {
                title: chatTitle,
                isAdminChat: true,
                participants: {
                    connect: [{ id: userId }, { id: "ADMIN" }],
                },
            },
            include: {
                participants: true,
            },
        });
        console.log(chat)
        const messageContent = translate('Default.commissionChangeMessage', {
            name: user.name,
            commissionType: translate(`Default.${input.commissionType}`)
        });
        
        // await sendMessage({
        //     chatId: chat.id,
        //     content: messageContent,
        //     sender: {
        //         id: userId,
        //         name: user.name ?? "User",
        //         role: 'blogger',
        //     },
        // });


        await sendMessage({
            chatId: chat.id,
            content: messageContent,
            sender: {
                id: "ADMIN",
                name: "Адмін",
                role: "admin",
            },
        });

        return chat;
    });