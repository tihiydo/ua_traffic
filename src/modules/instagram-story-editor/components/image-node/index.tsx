import React, { useEffect, useState } from 'react'
import { type Node, type NodeProps } from 'reactflow'
import { NodeType } from '../../enums';
import { config } from '../../config';
import { type MediaType } from '@/constants/mime-types';
import { getMIMEMediaType } from '@/utils/file';
// import { useStoryContext } from '../story-editor-context';

type Props = NodeProps<ImageNodeData>;

export type ImageNodeData = {
    href?: string;
    scale?: number;
}

export type ImageNode = Node<ImageNodeData>

const ImageNode = ({ data }: Props) => {
    const [fileType, setFileType] = useState<MediaType>();

    useEffect(() => {
        if (!data.href) {
            return setFileType(undefined)
        }

        fetch(data.href)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                
                return response.blob();
            })
            .then(blob => {
                const type = getMIMEMediaType(blob.type)
                console.log(type, blob.type)

                setFileType(type);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }, [data.href])


    if (!data.href || !fileType) return;

    return (
        <div
            className='w-fit max-w-[300px] max-h-[500px]'
            style={{
                transform: `scale(${data.scale ?? config.imageNode.defaultScale}%)`
            }}
        >
            {fileType === 'video' ? (
                <div className='max-w-[300px] max-h-[500px]'>
                    <video autoPlay loop src={data.href} >
                        <source type={'video/mp4' || ''} />
                        Your browser does not support the video tag.
                    </video>
                </div>
            ) : fileType === 'photo' ? (
                <img src={data.href} className='object-contain' width={200} height={300} alt='background' />
            ) : null}

        </div>
    )
}

export const imageNode = (node: Node<OptionalKeys<ImageNodeData, 'scale'>>): ImageNode => ({
    ...node,
    type: NodeType.Image,
    data: {
        href: node.data.href,
        scale: node.data.scale ?? config.imageNode.defaultScale
    } satisfies ImageNodeData

})


export default ImageNode