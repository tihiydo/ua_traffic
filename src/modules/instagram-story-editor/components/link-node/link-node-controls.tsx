import { useState } from "react";
import ScaleControls from "./scale-controls";
import { type LinkNode } from "./link-node";
import { useOnSelectionChange } from "reactflow";
import { NodeType } from "../../enums";

const LinkNodeControls = () => {
    const [selectedLinkNode, setSelectedLinkNode] = useState<Maybe<LinkNode>>(null);


    useOnSelectionChange({
        onChange: ({ nodes }) => {
            const selectedNode = nodes[0];
            if (selectedNode?.type !== NodeType.Link) {
                return setSelectedLinkNode(undefined)
            };

            setSelectedLinkNode(selectedNode);
        },
    });

    return (
        <>
            <ScaleControls node={selectedLinkNode} />
        </>
    )
}

export default LinkNodeControls