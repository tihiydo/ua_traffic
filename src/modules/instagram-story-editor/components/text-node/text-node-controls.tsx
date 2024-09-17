import { useState } from 'react'
import FontSizeControls from './font-size-controls'
import { useOnSelectionChange } from 'reactflow';
import TextColorControls from './text-color-controls';
import AlignControls from './align-controls';
import * as React from "react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import FontSelector from './font-selector';
import { type TextNode } from './text-node';
import { NodeType } from '../../enums';
import BackgroundColorControls from './background-color-controls';


const TextNodeControls = () => {
    const [selectedTextNode, setSelectedTextNode] = useState<Maybe<TextNode>>(null);


    useOnSelectionChange({
        onChange: ({ nodes }) => {
            const selectedNode = nodes[0];
            if (selectedNode?.type !== NodeType.Text) {
                return setSelectedTextNode(undefined)
            };

            setSelectedTextNode(selectedNode);
        },
    });

    return (
        <>
            <FontSizeControls textNode={selectedTextNode} />

            <div className='absolute left-1/2 -translate-x-1/2 top-10 z-[999]'>
                <div className='flex gap-4 items-center'>
                    <AlignControls textNode={selectedTextNode} />
                    <TextColorControls textNode={selectedTextNode} />
                    <BackgroundColorControls textNode={selectedTextNode} />
                </div>
            </div>

            <div className='absolute bottom-5 left-1/2 -translate-x-1/2 z-[999] '>

                <ScrollArea className="w-[220px] whitespace-nowrap ">
                    <div className="flex w-max space-x-4">
                        <FontSelector textNode={selectedTextNode} />
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>

        </>
    )
}

export default TextNodeControls