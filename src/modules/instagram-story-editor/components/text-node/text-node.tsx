import React from 'react'
import { type Node, NodeResizer, type NodeProps } from 'reactflow'
import { NodeType, type TextBgColor, type TextAlign } from '../../enums';
import { twMerge } from 'tailwind-merge';
import { type NextFontWithVariable } from 'next/dist/compiled/@next/font';
import { config } from '../../config';
import { useStoryContext } from '../story-editor-context';

type Props = NodeProps<TextNodeData>;

export type TextNodeData = {
    text: string;
    fontSize?: number;
    textColor?: string;
    font?: NextFontWithVariable;
    align?: TextAlign
    bgColor?: TextBgColor;
}

export type TextNode = Node<TextNodeData>

const TextNode = ({ data, selected, }: Props) => {
    const storyContext = useStoryContext();

    return (
        <div>
            <NodeResizer isVisible={storyContext.mode === 'edit' ? selected : false} minWidth={100} minHeight={30} maxWidth={300} />
            <div className={twMerge('px-3 py-2 rounded-lg break-words  max-w-[300px]', data.font?.className ?? config.textNode.defaultFont.className)}
                style={{
                    backgroundColor: data.bgColor ?? config.textNode.defaultBgColor,
                    fontSize: data.fontSize ?? config.textNode.defaultFontSize,
                    color: data.textColor ?? config.textNode.defaultTextColor,
                    textAlign: data.align ?? config.textNode.defaultAlign,

                }}
            >{data.text}</div>
        </div>
    )
}
type InputTextNodeData = Prettify<OptionalKeys<TextNodeData, 'textColor' | 'align' | 'font' | 'fontSize' | 'bgColor'>>
export const textNode = (node: Node<InputTextNodeData>): TextNode => ({
    ...node,
    type: NodeType.Text,
    data: {
        align: node.data.align ?? config.textNode.defaultAlign,
        font: node.data.font ?? config.textNode.defaultFont,
        fontSize: node.data.fontSize ?? config.textNode.defaultFontSize,
        textColor: node.data.textColor ?? config.textNode.defaultTextColor,
        bgColor: node.data.bgColor ?? config.textNode.defaultBgColor,
        text: node.data.text
    } satisfies TextNodeData

})


export default TextNode