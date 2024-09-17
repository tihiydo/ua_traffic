import { useEffect, useState } from "react";
import { type MediaItemType } from "..";
import { getExtMediaType } from "@/utils/file";
import isURL from "validator/lib/isURL";
import mime from 'mime';
import { type AnyMediaItem } from "../types";
import equal from "fast-deep-equal";
import { usePrevious } from "@/hooks/use-previous";

export function useMediaTransform(mediaItems: AnyMediaItem[]) {
    const pevMediaItems = usePrevious(mediaItems);
    const [media, setMedia] = useState<MediaItemType[]>([]);

    useEffect(() => {
        (async () => {
            let value = await Promise.all(
                mediaItems.map(async (mediaItem) => {
                    if (typeof mediaItem === 'string') {
                        return await parseUrlToMediaItem(mediaItem)
                    }

                    return mediaItem;
                })
            );

            value = value.filter(item => item)

            setMedia(value as MediaItemType[])
        })()
    }, [equal(mediaItems, pevMediaItems)])

    return media;
}

async function parseUrlToMediaItem(url: string): Promise<Maybe<MediaItemType>> {
    if (!isURL(url)) throw new Error('Passed media is not an URL')

    try {
        const response = await fetch(url);
        const contentType = response.headers.get('content-type');

        if (!contentType) return;

        const ext = mime.getExtension(contentType);
        if (!ext) return;

        const mediaType = getExtMediaType(ext);

        if (mediaType === 'photo') {
            const blob = await response.blob();
            const dimensions = await getImageDimensions(blob)
            if (!dimensions) return;

            return {
                url,
                type: 'photo',
                height: dimensions.height,
                width: dimensions.width,
                contentType
            }
        }

        if (mediaType === 'video') {
            const blob = await response.blob();
            const dimensions = await getVideoDimensions(blob)
            if (!dimensions) return;

            return {
                type: 'video',
                url,
                height: dimensions.height,
                width: dimensions.width,
                contentType
            }
        }

        if (mediaType === 'audio') {
            return {
                type: 'audio',
                contentType,
                url
            }
        }
        if (mediaType === 'document') {
            return {
                type: 'document',
                contentType,
                url
            }
        }
    } catch (error) {
        console.error('Error telegram emulator URL media parsing:', error);
        return null;
    }

    return;
}


async function getImageDimensions(blob: Blob): Promise<Maybe<{ width: number, height: number }>> {
    try {
        const img = new Image();

        return new Promise((resolve, reject) => {
            img.onload = () => {
                resolve({ width: img.width, height: img.height });
            };

            img.onerror = () => {
                reject(new Error('Failed to load image'));
            };

            const urlCreator = window?.URL || window?.webkitURL;
            img.src = urlCreator.createObjectURL(blob);
        });
    } catch (error) {
        console.error('Error getting image dimensions from Blob: use-media.ts:', error);
        return null
    }
}

async function getVideoDimensions(blob: Blob): Promise<{ width: number, height: number }> {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.preload = 'metadata';

        video.onloadedmetadata = () => {
            window?.URL.revokeObjectURL(video.src);
            resolve({
                width: video.videoWidth,
                height: video.videoHeight
            });
        };

        video.onerror = reject;

        video.src = window?.URL.createObjectURL(blob);
    });
}