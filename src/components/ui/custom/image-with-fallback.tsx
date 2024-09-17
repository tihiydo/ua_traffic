'use client'

import { AlertCircleIcon } from 'lucide-react';
import Image, { type ImageProps, type StaticImageData } from 'next/image'
import React, { useState } from 'react'

type Props = {
    fallback?: string | StaticImageData | React.ReactNode;
} & ImageProps

const ImageWithFallback = ({
    fallback, src, alt, ...props
}: Props) => {
    const [error, setError] = useState<any>(null);
    const [fallbackError, setFallbackError] = useState<any>(null);

    if (fallbackError) {
        return <div className='w-full h-full bg-gray flex items-center justify-center'>
            <AlertCircleIcon className='text-destructive' />
        </div>
    }

    // Display fallback
    if (error) {
        if (typeof fallback === 'string') {
            return <Image
                alt={alt}
                onError={setFallbackError}
                src={fallback}
                {...props}

            />
        }

        if (React.isValidElement(fallback)) {
            return fallback;
        }

        // Dont want to write schema to validate StaticImageData
        if (fallback) {
            return <Image
                alt={alt}
                onError={setFallbackError}
                src={fallback as StaticImageData}
                {...props}

            />
        }
    }

    return <Image
        alt={alt}
        onError={setError}
        src={src}
        {...props}
    />
};
export default ImageWithFallback
