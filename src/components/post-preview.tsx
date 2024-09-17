'use client'

import { type AdPost } from '@/database/ad-post/post'
import { StoryEditor, TextAlign, TextBgColor, imageNode, linkNode, textNode, useStoryNodesState } from '@/modules/instagram-story-editor'
import { StoryFont } from '@/modules/instagram-story-editor/fonts'
import { TelegramPostEmulator } from '@/modules/telegram-post-emulator'
import React from 'react'

type Props = {
    adPost: AdPost
}

const PostPreview = ({ adPost }: Props) => {
    const { nodesState } = useStoryNodesState(adPost.preview.social === 'Instagram' ? [
        adPost.preview.text ?
            textNode({
                id: 'text-1',
                position: adPost.preview.text.position,
                data: {
                    text: adPost.preview.text.content ?? 'Рдлоол',
                    align: Object.values(TextAlign).includes(adPost.preview.text.align as TextAlign)
                        ? adPost.preview.text.align as TextAlign
                        : undefined,
                    bgColor: Object.values(TextBgColor).includes(adPost.preview.text.bgColor as TextBgColor)
                        ? adPost.preview.text.bgColor as TextBgColor
                        : undefined,
                    font: StoryFont[adPost.preview.text?.font as keyof typeof StoryFont ?? 'Montserrat'],
                    fontSize: adPost.preview.text.fontSize,
                    textColor: adPost.preview.text.textColor,
                },
                draggable: false
            }) : null,
        adPost.preview.link ?
            linkNode({
                id: 'link-1',
                position: adPost.preview.link.position,
                data: {
                    link: adPost.preview.link.href ?? '',
                    text: adPost.preview.link.text,
                    scale: adPost.preview.link.scale,
                },
                draggable: false
            }) : null,
        adPost.preview.image ?
            imageNode({
                id: 'image-1',
                position: adPost.preview.image.position,
                data: {
                    href: adPost.preview.image.href ?? '',
                    scale: adPost.preview.image.scale,
                },
                draggable: false
            }) : null
    ] : [])

    if (adPost.social === 'Instagram') {
        return <StoryEditor nodesState={nodesState} />
    }

    if (adPost.preview.social === 'Telegram') {
        return <TelegramPostEmulator
            media={adPost.attachments.map(attachment => attachment.url)}
            content={adPost.content}
            inlineKeyboard={adPost.preview.buttons.map(btn => ({
                display: btn.display,
                href: btn.url,
            }))}
        />
    }
}

export default PostPreview