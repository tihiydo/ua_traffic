
import React from 'react'
import Image from 'next/image';
import { FileIcon, PlayIcon } from 'lucide-react';
import { type MediaItemType } from '..';
import { extractExt } from '@/utils/file';

type Props = {
    media: MediaItemType
};


const MediaItem = ({ media }: Props) => {
    if (media.type === 'photo') {
        return <div className='relative w-full h-full bg-main'>
            <Image loader={({ src }) => { return `${src}` }} src={media.url} alt='Media' fill className='absolute w-full h-full object-cover' />
        </div>
    }

    if (media.type === 'video') {
        return <div className='relative w-full h-full bg-main'>
            <div className='w-full h-full overflow-hidden relative'>.
                <div className='z-[30] absolute rounded-full w-9 h-9 bg-black/60 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex items-center justify-center'>
                    <PlayIcon fill='white' className='text-white translate-x-[10%]' size={20} />
                </div>
                <video className=' absolute z-[20] w-full top-1/2 -translate-y-1/2' src={media.url} >
                    <source type={media.contentType} />
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    }

    if (media.type === 'document') {
        return <div className='flex gap-3 bg-gray p-2 rounded-md'>
            <div className='bg-gray-secondary/75 rounded-full p-2'>
                <FileIcon size={18} />
            </div>

            <div>
                <h6 className='text-xs text-right break-all'>
                    filename.{extractExt(media.url.split('/').at(-1) ?? '')}
                </h6>
            </div>
        </div>
    }
}



export default MediaItem