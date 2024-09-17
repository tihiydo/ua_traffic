import React, { useEffect, useState } from 'react'
import type { LinkNode } from './link-node'
import Slider from 'react-slider'
import { useReactFlow } from 'reactflow'
import { twMerge } from 'tailwind-merge'
import { config } from '../../config'

type Props = {
    node: Maybe<LinkNode>
}

const ScaleControls = ({ node }: Props) => {
    const { setNodes } = useReactFlow();
    const [scale, setScale] = useState<number>(node?.data.scale ?? config.linkNode.defaultScale);

    useEffect(() => {
        if (!node?.data.scale) return;
        setScale(node.data.scale)
    }, [!node?.data.scale])

    useEffect(() => {
        if (!node) return;

        setNodes(nodes => (
            nodes.map(nd => {
                if (nd.id === node.id) {
                    nd.data = {
                        ...nd.data,
                        scale
                    }
                }

                return nd;
            })
        ))
    }, [setNodes, scale])

    if (!node) return;

    return (
        <div className='absolute top-1/2 -translate-y-1/2 left-2  w-5 h-[300px] !z-[999]'>

            <Slider
                className='h-full '
                renderTrack={({ key, ...props }) => (
                    <div
                        key={key}
                        {...props}
                        className={' bg-gray-secondary w-2 left-1/2 -translate-x-1/2'}
                    />
                )}
                value={scale}
                onChange={(newScale) => {
                    setScale(newScale)
                }}
                orientation='vertical'
                invert
                max={config.linkNode.maxScale}
                min={config.linkNode.minScale}
                renderThumb={({ key, ...props }) => (
                    <div
                        key={key}
                        {...props}
                        className={twMerge('h-5 w-5 bg-white rounded-full border-2 border-gray-secondary left-1/2 -translate-x-1/2')}
                    />
                )}

            />
        </div>

    )
}

export default ScaleControls