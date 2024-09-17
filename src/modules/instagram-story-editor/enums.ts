'use client'
export const TextAlign = {
    Center: 'center',
    Left: 'left',
    right: 'right'
} as const;
export type TextAlign = ObjectValues<typeof TextAlign>;


export const NodeType = {
    Text: 'text-node',
    Link: 'link-node',
    Image: 'image-node'
} as const
export type NodeType = ObjectValues<typeof NodeType>


export const TextBgColor = {
    White: 'white',
    Black: 'black',
    Transparent: 'transparent'
} as const
export type TextBgColor = ObjectValues<typeof TextBgColor>