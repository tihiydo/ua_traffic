import React, { useEffect, useState } from 'react'
import { useReactFlow } from 'reactflow'
import { Button } from '@/components/ui/button'
import { StoryFont } from '../../fonts'
import { type NextFontWithVariable } from 'next/dist/compiled/@next/font'
import { twMerge } from 'tailwind-merge'
import { type TextNode } from './text-node'

type Props = {
    textNode: Maybe<TextNode>
}

const FontSelector = ({ textNode }: Props) => {
    const [selectedFont, setSelectedFont] = useState<NextFontWithVariable>(StoryFont.Montserrat);
    const { setNodes } = useReactFlow();

    useEffect(() => {
        if (!textNode?.data.font) return;
        setSelectedFont(textNode.data.font)
    }, [!!textNode])

    useEffect(() => {
        if (!textNode) return;

        setNodes(nodes => (
            nodes.map(node => {
                if (node.id === textNode.id) {
                    node.data = {
                        ...node.data,
                        font: selectedFont,
                    }
                }

                return node;
            })
        ))
    }, [selectedFont, setNodes])

    if (!textNode) return;

    return (
        <>
            {Object.values(StoryFont)
                .map((font, index) => (
                    <Button
                        key={index}
                        variant={'outline'}
                        size={'icon'}
                        className={twMerge(font.className, font.className === selectedFont.className ? 'bg-gray' : '')}
                        onClick={() => {
                            setSelectedFont(font)
                        }}
                    >
                        Aa
                    </Button>
                ))
            }
        </>
    )
}

export default FontSelector