'use client'

import mime from 'mime';
import { extractExt, getFileMB } from '@/utils/file';
import { InfoIcon, UploadIcon } from 'lucide-react'
import React, { useState } from 'react'
import { twMerge } from 'tailwind-merge';
import Translate from '@/components/Translate';
import { useTranslations } from 'next-intl';
import { truncate } from '@/utils';
import TouchHoverPopover from '../touch-hover-popover';

type Props = {
    multiple?: boolean;
    disabled?: boolean;
    className?: string;
    maxFiles?: number;
    maxWeightExts?: Partial<Record<`.${string}` | '*', `${number}MB`>>
    classNames?: Partial<{
        wrapper: string;
        input: string;
    }>;
    acceptedTypes?: string[];
    onChange?: (files: File[]) => void;
    onError?: (error: string) => void;
}

const FileInput = ({ acceptedTypes, className, classNames, onChange, multiple = false, onError, disabled, maxFiles, maxWeightExts }: Props) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isDraggedOver, setIsDraggedOver] = useState<boolean>(false);
    const t = useTranslations('Files');
    const validationT = useTranslations('Validation');

    const isValidMime = (file: File) => {
        if (!acceptedTypes) return true;

        const fileExt = extractExt(file.name);
        if (!fileExt) {
            return false
        };

        const mimeType = mime.getType(fileExt);
        if (!mimeType || !acceptedTypes.includes(mimeType)) {
            return false
        };

        return true
    }

    return (
        <div className={twMerge('flex h-full items-center gap-3', className, classNames?.wrapper)}>
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggedOver(true)
                }}
                onDrop={() => {
                    setIsDraggedOver(false)
                }}
                onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDraggedOver(false)
                }}

                className={twMerge(
                    'relative  overflow-hidden bg-transparent !cursor-pointer rounded-lg duration-200 ring-2 ring-offset-2 ring-transparent focus-within:ring-yellow border-gray-secondary border w-[260px] transition-colors hover:bg-gray/80 h-[50px]',
                    isDraggedOver && ' ring-yellow',
                    disabled && 'opacity-50',
                    classNames?.input
                )}
            >
                <input
                    className={twMerge(
                        'absolute cursor-pointer top-0 left-0 w-full h-full opacity-0 ',
                        disabled && 'cursor-not-allowed pointer-events-none'
                    )}
                    type={'file'}
                    accept={acceptedTypes ? acceptedTypes.join(',') : undefined}
                    onChange={(e) => {
                        const filelist = e.target.files;
                        if (!filelist || filelist.length <= 0) {
                            setSelectedFiles([]);
                            onChange?.([]);
                            return
                        };


                        const files: File[] = [];
                        for (const file of filelist) {
                            if (file) {
                                files.push(file);
                            }
                        }

                        if (multiple) {
                            const filteredOutFiles: File[] = []
                            const filteredFiles = files.filter(file => {
                                const isValid = isValidMime(file);

                                if (!isValid) {
                                    filteredOutFiles.push(file);
                                }

                                return isValid
                            })

                            if (maxFiles && files.length > maxFiles) {
                                onError?.(validationT('max-files', { count: files.length }))
                                setSelectedFiles([]);
                                onChange?.([]);
                                return
                            }

                            if (maxWeightExts) {
                                const totalWeightLimit = maxWeightExts['*']
                                    ? parseMBString(maxWeightExts['*'])
                                    : null

                                const validWeights = files.every(file => {
                                    const fileExt = extractExt(file);

                                    const fileSizeMB = getFileMB(file);
                                    const limitMB = maxWeightExts[`.${fileExt}`]
                                    const localMBLimit = limitMB
                                        ? parseMBString(limitMB)
                                        : null

                                    const validLocalLimit = typeof localMBLimit === 'number'
                                        ? localMBLimit > fileSizeMB
                                        : true

                                    const validTotalLimit = typeof totalWeightLimit === 'number'
                                        ? totalWeightLimit > fileSizeMB
                                        : true

                                    return validLocalLimit && validTotalLimit;
                                })

                                if (!validWeights) {
                                    onError?.(validationT('large-unknown-file-size'))
                                    setSelectedFiles([]);
                                    onChange?.([]);
                                    return;
                                }
                            }

                            if (filteredOutFiles.length) {
                                onError?.(`
                                    ${t('unsupported-files')}(${filteredOutFiles.length}): 
                                    ${filteredOutFiles
                                        .map(file => `${truncate(file.name, 10)}`)
                                        .join(', ')
                                    }`
                                )
                            }

                            setSelectedFiles(filteredFiles);
                            onChange?.(filteredFiles);
                        } else {
                            const file = files[0];
                            if (!file) return;


                            if (!isValidMime(file)) {
                                setSelectedFiles([]);
                                onChange?.([]);
                                return onError?.(t('unsupported-file'))
                            }


                            setSelectedFiles([file]);
                            onChange?.([file]);
                        }


                    }}
                    multiple={multiple}
                />


                <button type='button' className={'flex items-center w-full h-full'}>
                    <div className='flex justify-center items-center border-r self-stretch  border-gray-secondary w-[20%] max-w-[100px] min-w-[60px]'>
                        <UploadIcon size={22} />
                    </div>

                    <div className='px-3 py-1 flex-1 '>
                        <p className='text-sm text-left'>{multiple
                            ? <Translate namespace='Files' itemKey='pick-files' />
                            : <Translate namespace='Files' itemKey='pick-file' />
                        }</p>
                        {!!selectedFiles.length && (
                            <div className='gap-1 text-xs text-left'>
                                {multiple ? (
                                    <>
                                        <Translate namespace='Files' itemKey='picked' /> {` ${selectedFiles.length}`}
                                    </>
                                ) : (
                                    <Translate namespace='Files' itemKey='picked' />
                                )}
                            </div>
                        )}
                    </div>
                </button>
            </div>


            {!!acceptedTypes && (
                <TouchHoverPopover
                    trigger={<InfoIcon size={20} />}
                >
                    <p className='max-w-[200px] text-xs'>
                        <Translate namespace='Files' itemKey='allowed-files' />: {" "}
                        {acceptedTypes.map(type => mime.getExtension(type)).join(', ')}
                    </p>
                </TouchHoverPopover>
            )}
        </div>
    )
}

function parseMBString(size: `${number}MB`) {
    return Number(size.split('MB')[0])
}


export default FileInput

