'use client'

import React from 'react'
import Translate from '../Translate';
import AdvetismentPostStatusBadge from '../ui/custom/badges/statuses/advertisment-post';
import { Button } from '../ui/button';
import { Link } from '@/i18n/navigation';
import { StoryEditor, TextAlign, TextBgColor, imageNode, linkNode, textNode, useStoryNodesState } from '@/modules/instagram-story-editor';
import { StoryFont } from '@/modules/instagram-story-editor/fonts';
import { twMerge } from 'tailwind-merge';
import { useScreenSize } from '@/hooks/use-screen-size';
import { Drawer, DrawerContent, DrawerTrigger, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { type InstagramAdPost } from '@/database/ad-post/post';
import { CopyIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';

type Props = {
    advertismentPost: InstagramAdPost;
    className?: string;
}

const InstagramPostView = ({ advertismentPost, className }: Props) => {
    const { preview } = advertismentPost
    const t = useTranslations();

    const { nodesState } = useStoryNodesState([
        preview.text ?
            textNode({
                id: 'text-1',
                position: preview.text.position,
                data: {
                    text: preview.text.content ?? 'Рдлоол',
                    align: Object.values(TextAlign).includes(preview.text.align as TextAlign)
                        ? preview.text.align as TextAlign
                        : undefined,
                    bgColor: Object.values(TextBgColor).includes(preview.text.bgColor as TextBgColor)
                        ? preview.text.bgColor as TextBgColor
                        : undefined,
                    font: StoryFont[preview.text?.font as keyof typeof StoryFont ?? 'Montserrat'],
                    fontSize: preview.text.fontSize,
                    textColor: preview.text.textColor,
                },
                draggable: false
            }) : null,
        preview.link ?
            linkNode({
                id: 'link-1',
                position: preview.link.position,
                data: {
                    link: preview.link.href ?? '',
                    text: preview.link.text,
                    scale: preview.link.scale,
                },
                draggable: false
            }) : null,
        preview.image ?
            imageNode({
                id: 'image-1',
                position: preview.image.position,
                data: {
                    href: preview.image.href ?? '',
                    scale: preview.image.scale,
                },
                draggable: false
            }) : null
    ])

    const { width: screenWidth } = useScreenSize();

    return (
        <div className={twMerge('')}>
            <h2 className='font-title text-xl'>
                {advertismentPost.title}
            </h2>
                {advertismentPost.status}
        </div>
    )
}

export default InstagramPostView