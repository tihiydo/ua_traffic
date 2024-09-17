import React, { useEffect, useState } from 'react'
import { useReactFlow } from 'reactflow'
import { type TextNode } from './text-node'
import { config } from '../../config';
import { Button } from '@/components/ui/button';
import { type TextBgColor } from '../../enums';
import { BaselineIcon } from 'lucide-react';


type Props = {
    textNode: Maybe<TextNode>
}

const BackgroundColorControls = ({ textNode }: Props) => {
    const { setNodes } = useReactFlow();
    const [bgColor, setBgColor] = useState<TextBgColor>(textNode?.data.bgColor ?? config.textNode.defaultBgColor)

    useEffect(() => {
        if (!textNode?.data.bgColor) return;
        setBgColor(textNode.data.bgColor)
    }, [!!textNode])

    useEffect(() => {
        if (!textNode) return;

        setNodes(nodes => (
            nodes.map(node => {
                if (node.id === textNode.id) {
                    node.data = {
                        ...node.data,
                        bgColor: bgColor,
                    }
                }

                return node;
            })
        ))
    }, [bgColor, setNodes])

    if (!textNode) return;

    return (
        <Button
            className={`${bgColor === 'white' || bgColor === 'black' ? 'bg-white text-black' : ""} ${bgColor === 'transparent' ? 'text-white bg-transparent hover:text-black' : ''}`}
            variant={'ghost'}
            size={'icon'} onClick={() => {
                switch (bgColor) {
                case 'black': return setBgColor('white')
                case 'white': return setBgColor('transparent')
                case 'transparent': return setBgColor('black')
                }
            }}
        >
            <BaselineIcon />
        </Button>
    )
}

export default BackgroundColorControls