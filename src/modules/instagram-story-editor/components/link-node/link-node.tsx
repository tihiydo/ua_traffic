import { type Node, type NodeProps, } from 'reactflow'
import { NodeType } from '../../enums';
import { twMerge } from 'tailwind-merge';
import { LinkIcon } from 'lucide-react';
import { config } from '../../config';
import { truncate } from '@/utils';


export type LinkNodeData = {
    link: string;
    text?: string;
    scale?: number;
}

export type LinkNode = Node<LinkNodeData>;

type Props = NodeProps<LinkNodeData>;
const LinkNode = ({ data }: Props) => {
    const domain = getDomainFromUrl(data.link);

    if (!domain) return
    return (
        <div className='w-full'>

            <div
                onDoubleClick={() => {
                    if (!isUrl(data.link ?? '')) return

                    window?.open(data.link, '_blank', 'noreferrer');
                }}
                className={twMerge('px-2 py-1 w-full aspect-[12/2]   border bg-white rounded-md flex gap-2 items-center text-[#289def]')}
                style={{
                    transform: `scale(${data.scale ?? config.linkNode.defaultScale}%)`
                }}
            >
                <LinkIcon size={18} className='min-w-6' />
                <div className='text-sm uppercase break-all'>
                    {truncate(data.text?.trim().length ? data.text : domain, 60)}
                </div>
            </div>
        </div>
    )
}

function getDomainFromUrl(url?: string): string {
    const isValidUrl = isUrl(url ?? '')
    if (!isValidUrl) return '';

    let domain = url?.replace(/(^\w+:|^)\/\//, '');
    domain = domain?.split('/')[0] ?? '';

    return domain;
}

function isUrl(url: string) {
    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlRegex.test(url ?? '');
}


type InputLinkNodeData = Prettify<OptionalKeys<LinkNodeData, 'scale'>>
export const linkNode = (options: Node<InputLinkNodeData>): LinkNode => ({
    type: NodeType.Link,
    ...options,
    data: {
        ...options.data,
        scale: options.data.scale ?? config.linkNode.defaultScale
    } satisfies LinkNodeData
})

export default LinkNode