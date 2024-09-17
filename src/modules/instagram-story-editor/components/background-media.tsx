'use client'
import { type AdAttachmentsItem } from '@/database/ad-post/attachments'
import { extractExt, getExtMediaType } from '@/utils/file'
import React, { useEffect, useState } from 'react'

type Props = {
    media: Maybe<File | AdAttachmentsItem>
}

const BackgroundMedia = ({ media }: Props) => {
    const [imageUrl, setImageUrl] = useState<Maybe<string>>(null);


    const bgType = media instanceof File
        ? getExtMediaType(extractExt(media.name) ?? '')
        : media?.mediaType


    useEffect(() => {
        if (media instanceof File) {
            const url = URL.createObjectURL(media);

            setImageUrl(url);
        } else {
            setImageUrl(media?.url)
        }
    }, [media])

    return (
        <div className='absolute top-0 left-0 w-full h-full bg-slate-500 flex items-center justify-center'>
            {imageUrl ? (
                bgType === 'video' ? (
                    <video autoPlay loop src={imageUrl} >
                        <source type={'video/mp4' || ''} />
                        Your browser does not support the video tag.
                    </video>
                ) : bgType === 'photo' ? (
                    <img src={imageUrl} className='w-full h-full object-contain' alt='background' />
                ) : null
            ) : null}
        </div>

    )
}

export default BackgroundMedia