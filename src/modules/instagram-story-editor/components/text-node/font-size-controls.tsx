import Slider from 'react-slider'
import { useReactFlow } from 'reactflow';
import { twMerge } from 'tailwind-merge';
import { useEffect, useState } from 'react';
import { type TextNode } from './text-node';
import { config } from '../../config';

type Props = {
    textNode: Maybe<TextNode>;
}

const FontSizeControls = ({ textNode }: Props) => {
    const { setNodes } = useReactFlow();
    const [fontSize, setFontSize] = useState<number>(textNode?.data.fontSize ?? config.textNode.defaultFontSize);

    useEffect(() => {
        if (!textNode?.data.fontSize) return;
        setFontSize(textNode?.data.fontSize)
    }, [!textNode?.data.fontSize])

    useEffect(() => {
        if (!textNode) return;

        setNodes(nodes => (
            nodes.map(node => {
                if (node.id === textNode.id) {
                    node.data = {
                        ...node.data,
                        fontSize
                    }
                }

                return node;
            })
        ))
    }, [setNodes, fontSize])

    if (!textNode) return;

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
                value={fontSize}
                onChange={(newFontSize) => {
                    setFontSize(newFontSize)

                }}
                orientation='vertical'
                invert
                max={config.textNode.maxFontSize}
                min={config.textNode.minFontSize}
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

export default FontSizeControls