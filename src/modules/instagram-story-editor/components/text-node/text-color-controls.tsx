import React, { useEffect, useState } from 'react'
import { useReactFlow } from 'reactflow'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { HexColorPicker } from "react-colorful";
import { type TextNode } from './text-node'
import { config } from '../../config';


type Props = {
    textNode: Maybe<TextNode>
}

const TextColorControls = ({ textNode }: Props) => {
    const { setNodes } = useReactFlow();
    const [color, setColor] = useState<string>(textNode?.data.textColor ?? config.textNode.defaultTextColor)

    useEffect(() => {
        if (!textNode?.data.textColor) return;
        setColor(textNode?.data.textColor)
    }, [!!textNode])

    useEffect(() => {
        if (!textNode) return;

        setNodes(nodes => (
            nodes.map(node => {
                if (node.id === textNode.id) {
                    node.data = {
                        ...node.data,
                        textColor: color,
                    }
                }

                return node;
            })
        ))
    }, [color, setNodes])

    if (!textNode) return;

    return (
        <Popover>
            <PopoverTrigger>
                <div className='rounded-full w-8 h-8' style={{ backgroundColor: color ?? '#000' }}></div>
            </PopoverTrigger>

            <PopoverContent className='p-0 w-fit'>
                <HexColorPicker
                    color={textNode.data.textColor}
                    onChange={
                        (newColor) => {
                            setColor(newColor)
                        }}
                />
            </PopoverContent>
        </Popover>
    )
}

export default TextColorControls