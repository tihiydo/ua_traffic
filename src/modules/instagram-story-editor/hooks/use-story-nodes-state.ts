'use client'

import { type Node, useNodesState } from "reactflow";
import { type StoryNodeData } from "../types";
import { useCallback } from "react";

export function useStoryNodesState(initialData: Maybe<Node<StoryNodeData>>[]) {
    const nodesState = useNodesState<StoryNodeData>(initialData.filter(node => node) as Node<StoryNodeData>[]);
    const [, setNodes] = nodesState;

    const updateNode = useCallback((id: string, newData: Partial<StoryNodeData>) => {
        setNodes(nodes => (
            nodes.map(node => {
                if (node.id === id) {
                    node.data = {
                        ...node.data,
                        ...newData
                    }
                }

                return node;
            })
        ))
    }, [setNodes])


    return {
        nodesState,
        updateNode
    }
}