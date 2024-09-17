'use client'

import React from 'react'
import { useCreatePost } from '../_hooks/useCreateBlogger'
import { extractExt, getExtMediaType } from '@/utils/file'
import TelegramPostForm from './telegram-post-form'

const TelegramTab = () => {
    const { mutate: createPost, isLoading } = useCreatePost();

    return (
        <div className='mt-6'>
            <TelegramPostForm
                onSubmit={async (data) => {
                    createPost(
                        {
                            content: data.content,
                            title: data.title,
                            social: 'Telegram',
                            attachemnts: data.blobs.map(blob => {
                                const fileExt = extractExt(blob.file.name)!;
                                const fileMediaType = getExtMediaType(fileExt);

                                return {
                                    pathname: blob.pathname,
                                    contentType: blob.contentType,
                                    url: blob.url,
                                    filename: blob.file.name,
                                    mediaType: fileMediaType
                                }
                            }),
                            preview: {
                                social: 'Telegram',
                                buttons: data.links.map(link => ({
                                    display: link.display,
                                    url: link.href
                                }))
                            }
                        });

                }}
                isLoading={isLoading}
            />
        </div>
    )
}

export default TelegramTab