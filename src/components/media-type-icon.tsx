'use client'

import React from 'react'
import { FileAudio, FileIcon, FileImageIcon, FileTextIcon, FileVideo, type LucideProps } from 'lucide-react';
import { type MediaType } from '@/constants/mime-types';

type Props = LucideProps & {
    type: MediaType;
}

const MediaTypeIcon = ({ size = 18, type, ...props }: Props) => {
    const fileIconMap: Record<MediaType, React.ReactNode> = {
        document: <FileTextIcon size={size} {...props} />,
        photo: <FileImageIcon size={size} {...props} />,
        video: <FileVideo size={size} {...props} />,
        audio: <FileAudio size={size} {...props} />,
        unknown: <FileIcon size={size} {...props} />
    }
    return fileIconMap[type];
}

export default MediaTypeIcon