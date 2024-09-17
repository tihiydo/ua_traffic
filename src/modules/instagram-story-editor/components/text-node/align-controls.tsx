import React, { useEffect, useState } from 'react'
import { useReactFlow } from 'reactflow'
import { type TextAlign } from '../../enums'
import { Button } from '@/components/ui/button'
import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react'
import { type TextNode } from './text-node'
import { config } from '../../config'

type Props = {
    textNode: Maybe<TextNode>
}

const AlignControls = ({ textNode }: Props) => {
    const { setNodes } = useReactFlow();
    const [textAlign, setTextAlign] = useState<TextAlign>(textNode?.data.align ?? config.textNode.defaultAlign);

    useEffect(() => {
        if (!textNode?.data.align) return;
        setTextAlign(textNode.data.align)
    }, [!!textNode])

    useEffect(() => {
        if (!textNode) return;

        setNodes(nodes => (
            nodes.map(node => {
                if (node.id === textNode.id) {
                    node.data = {
                        ...node.data,
                        align: textAlign,
                    }
                }

                return node;
            })
        ))
    }, [textAlign, setNodes])

    const alignIconsMap: Record<TextAlign, React.ReactNode> = {
        left: <AlignLeft />,
        right: <AlignRight />,
        center: <AlignCenter />,
    }

    if (!textNode) return;
    return (
        <Button variant={'ghost'} size={'icon'} onClick={() => {
            switch (textAlign) {
            case 'left': return setTextAlign('right')
            case 'right': return setTextAlign('center')
            case 'center': return setTextAlign('left')
            }
        }}>
            {alignIconsMap[textAlign]}
        </Button>
    )
}

export default AlignControls