import { useState } from "react";
import ScaleControls from "./scale-controls";
import { useOnSelectionChange } from "reactflow";
import { NodeType } from "../../enums";
import { type ImageNode } from ".";

const ImageControls = () => {
    const [selectedImageNode, setSelectedImageNode] = useState<Maybe<ImageNode>>(null);


    useOnSelectionChange({
        onChange: ({ nodes }) => {
            const selectedNode = nodes[0];
            if (selectedNode?.type !== NodeType.Image) {
                return setSelectedImageNode(undefined)
            };

            setSelectedImageNode(selectedNode);
        },
    });

    return (
        <>
            <ScaleControls node={selectedImageNode} />
        </>
    )
}

export default ImageControls