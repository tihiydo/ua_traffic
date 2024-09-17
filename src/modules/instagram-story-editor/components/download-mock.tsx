import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { toPng } from 'html-to-image';
import { twMerge } from 'tailwind-merge';
import { DownloadIcon } from 'lucide-react';
import SpinnerLoading from '@/components/ui/custom/spinner-loading';
import Translate from '@/components/Translate';

function downloadImage(dataUrl: string) {
    const a = document.createElement('a');

    a.setAttribute('download', 'uatraffic-story-preview.png');
    a.setAttribute('href', dataUrl);
    a.click();
}

const part = 240 / 9;

const imageWidth = part * 9;
const imageHeight = part * 18;

type Props = {
    className?: string;
}
const DownloadMockButton = ({ className }: Props) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const onClick = () => {
        const viewport = document.querySelector('.react-flow__viewport')! as HTMLDivElement

        setIsDownloading(true)
        toPng(viewport, {
            width: imageWidth,
            height: imageHeight,
            style: {
                width: `${imageWidth}px`,
                height: `${imageHeight}px`,
                backgroundColor: '#000'
            },
        })
            .then(downloadImage)
            .finally(() => {
                setIsDownloading(false)
            })
    }

    return (
        <Button disabled={isDownloading} onClick={onClick} variant={'outline'} className={twMerge('gap-2', className)}>
            {isDownloading ? (
                <SpinnerLoading />
            ) : (
                <>
                    <DownloadIcon />
                    <Translate namespace='Default' itemKey={'download'} />
                </>
            )}
        </Button>
    )
}

export default DownloadMockButton