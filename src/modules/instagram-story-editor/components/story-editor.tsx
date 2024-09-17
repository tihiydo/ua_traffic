'use client'

import ReactFlow from 'reactflow'
import TextNode from './text-node/text-node'
import 'reactflow/dist/style.css';
import TextNodeControls from './text-node/text-node-controls';
import LinkNode from './link-node/link-node';
import { NodeType } from '../enums';
import LinkNodeControls from './link-node/link-node-controls';
import { twMerge } from 'tailwind-merge';
import { type useStoryNodesState } from '../hooks/use-story-nodes-state';
import { StoryContextProvider } from './story-editor-context';
import DownloadMockButton from './download-mock';
import Image from 'next/image'
import phone from '@/assets/images/phone-mock.png'
import ImageNode from './image-node';
import ImageControls from './image-node/image-controls';
const nodeTypes = {
    [NodeType.Text]: TextNode,
    [NodeType.Link]: LinkNode,
    [NodeType.Image]: ImageNode,
}

type Props = {
    className?: string;
    nodesState: ReturnType<typeof useStoryNodesState>['nodesState']
    mode?: 'edit' | 'view';
}

const StoryEditor = ({ className, mode = 'view', nodesState }: Props) => {
    const [nodes, , onNodesChange] = nodesState;


    return (
        <StoryContextProvider value={{ mode }}>
            <div className='!w-[263px] flex flex-col'>
                <div className='relative'>
                    <div className="w-[263px] absolute z-50 pointer-events-none">
                        <Image src={phone} alt="phone-mockup"/>
                    </div>

                    <div className='!h-[533px] p-[10px] '>
                        <ReactFlow
                            className={twMerge('border-2 !w-[full]  border-gray-secondary bg-gray rounded-[1.5rem] overflow-hidden', className)}
                            panOnScroll={false}
                            panOnDrag={false}
                            zoomOnScroll={false}
                            zoomOnPinch={false}
                            zoomOnDoubleClick={false}
                            autoPanOnNodeDrag={false}
                            autoPanOnConnect={false}
                            nodes={nodes}
                            
                            onNodesChange={onNodesChange}
                            nodeTypes={nodeTypes}
                        >
                            {mode === 'edit' ? (
                                <>
                                    <TextNodeControls />
                                    <LinkNodeControls />
                                    <ImageControls />
                                </>
                            ) : null}
                        </ReactFlow>
                    </div>
                </div>

                <DownloadMockButton className='mt-3 w-full' />
            </div>

        </StoryContextProvider>

    )
}

export default StoryEditor