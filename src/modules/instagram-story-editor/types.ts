import { type ImageNodeData } from "./components/image-node";
import type { LinkNodeData } from "./components/link-node/link-node";
import type { TextNodeData } from "./components/text-node/text-node";

export type StoryNodeData = LinkNodeData | TextNodeData | ImageNodeData;
