import { ERROR_CODES } from "@/constants/error-codes";
import { mediaTypes } from "@/constants/mime-types";
import { env } from "@/env.mjs";
import { createUnionSchema } from "@/lib/zod/create-many-union";
import { protectedProcedure } from "@/server/api/trpc";
import { chunkArray } from "@/utils";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
const { Telegraf } = require('telegraf')

const sendTgPostPreviewInput = z.object({
    media: z.array(z.object({
        url: z.string(),
        type: createUnionSchema(mediaTypes),
        contentType: z.string()
    })),
    content: z.string().default(''),
    buttons: z.array(z.object({
        text: z.string(),
        link: z.string()
    })).default([])
})

export const sendTgPostPreviewProcedure = protectedProcedure
    .input(sendTgPostPreviewInput)
    .mutation(async ({ ctx, input }) => {
        const telegramUsername = await ctx.db.user.findUnique({
            where: {
                id: ctx.session.user.id
            },
            select: {
                telegram: true
            }
        })

        if (!telegramUsername?.telegram) {
            throw new TRPCError({ code: 'BAD_REQUEST', message: ERROR_CODES.TELEGRAM_NOT_LINKED })
        }

        try {
            const bot = new Telegraf(env.TELEGRAM_BOT_API_KEY)
            // try {
            if (!input.media || !input.media.length) {
                return await bot.telegram.sendMessage(
                    telegramUsername.telegram,
                    input.content,
                    {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: chunkArray(input.buttons.map(button => ({
                                text: button.text,
                                url: button.link
                            })), 3)
                        },
                    }
                )
            }

            const firstMedia = input.media[0];

            if (input.media.length === 1 && firstMedia?.type === 'photo') {
                return await bot.telegram.sendPhoto(
                    telegramUsername.telegram,
                    firstMedia.url,
                    {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: chunkArray(input.buttons.map(button => ({
                                text: button.text,
                                url: button.link
                            })), 3)
                        },
                        caption: input.content
                    });
            } else if (input.media.length === 1 && firstMedia?.type === 'video') {
                return await bot.telegram.sendVideo(
                    telegramUsername.telegram,
                    firstMedia.url,
                    {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: chunkArray(input.buttons.map(button => ({
                                text: button.text,
                                url: button.link
                            })), 3)
                        },
                        caption: input.content
                    });
            } else if (input.media.length === 1 && firstMedia?.type === 'document') {
                return await bot.telegram.sendDocument(
                    telegramUsername.telegram,
                    firstMedia.url,
                    {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: chunkArray(input.buttons.map(button => ({
                                text: button.text,
                                url: button.link
                            })), 3)
                        },
                        caption: input.content
                    });
            } else if (input.media.length >= 2 && input.media.some(media => media.type === 'document')) {
                return await bot.telegram.sendMediaGroup(
                    telegramUsername.telegram,
                    input.media
                        .filter(media => media.type !== 'unknown')
                        .map((item, index, array) => {
                            if (index === array.length - 1) {
                                return {
                                    type: 'document',
                                    media: item.url,
                                    parse_mode: 'HTML',
                                    caption: input.content,

                                }
                            }


                            return {
                                type: 'document',
                                media: item.url,
                                parse_mode: 'HTML',
                            }
                        }),
                )
            } else if (input.media.length >= 2) {
                return await bot.telegram.sendMediaGroup(
                    telegramUsername.telegram,
                    input.media
                        .filter(media => media.type !== 'unknown')
                        .map((item, index, array) => {
                            if (index === array.length - 1) {
                                return {
                                    type: item.type,
                                    media: item.url,
                                    parse_mode: 'HTML',
                                    caption: input.content,
                                }
                            }


                            return {
                                type: item.type,
                                media: item.url,
                                parse_mode: 'HTML',
                            }
                        }),

                )
            } else {
                throw new Error()
            }
        } catch (error) {
            if (env.NODE_ENV === 'development') {
                throw error
            }

            throw new TRPCError({ code: 'BAD_REQUEST', message: ERROR_CODES.CANT_SEND_TG_MESSAGE })
        }
    })