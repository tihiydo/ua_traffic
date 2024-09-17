import Translate from '@/components/Translate';
import { type MediaType } from '@/constants/mime-types';
import { truncate } from '@/utils';
import { extractExt, getExtMediaType, getFileId } from '@/utils/file';
import {  FileAudio, FileIcon, FileImageIcon, FileTextIcon, FileUpIcon, FileVideo } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

type Props = {
    className?: string;
    files: File[];
}

const UploadingFiles = ({ files, className }: Props) => {
    const fileIconMap: Record<MediaType, React.ReactNode> = {
        document: <FileTextIcon size={18} className='opacity-75' />,
        photo: <FileImageIcon size={18} className='opacity-75' />,
        video: <FileVideo size={18} className='opacity-75' />,
        audio: <FileAudio size={18} className='opacity-75' />,
        unknown: <FileIcon size={18} className='opacity-75' />
    }

    return (
        <div className={twMerge('rounded-md border border-gray-secondary animate-pulse', className)}>
            <div>
                <div className={`flex items-center gap-2 px-4 py-2 `}>
                    <FileUpIcon className='opacity-50' />
                    <h5 className='text-sm'><Translate namespace='Advertiser' itemKey='attachments-loading' /></h5>
                </div>
            </div>

            {files.length ? (
                <ul className='p-2 border-t border-gray-secondary flex flex-col gap-1'>
                    {files.map(file => {
                        const fileExt = extractExt(file.name);
                        const mediaType = fileExt ? getExtMediaType(fileExt) : null;

                        return (
                            <li key={getFileId(file)} className='text-xs flex gap-1.5 items-center'>
                                <div>
                                    {fileIconMap[mediaType ?? 'unknown']}
                                </div>
                                <p>
                                    {truncate(file.name, 20)}
                                </p>
                            </li>
                        )

                    })}
                </ul>
            ) : null}

        </div>
    )
}

export default UploadingFiles