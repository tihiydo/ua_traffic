'use client'

import Translate from '@/components/Translate'
import { Button } from '@/components/ui/button'
import AdvertismentRequestStatusBadge from '@/components/ui/custom/badges/statuses/advertisment-request'
import { type InstagramAdRequest as TInstagramAdRequest } from '@/database/ad-request'
import { useScreenSize } from '@/hooks/use-screen-size'
import { Link } from '@/i18n/navigation'
import { StoryEditor, TextAlign, TextBgColor, imageNode, linkNode, textNode, useStoryNodesState } from '@/modules/instagram-story-editor'
import { Drawer, DrawerContent, DrawerTrigger, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { StoryFont } from '@/modules/instagram-story-editor/fonts'
import React from 'react'
import { twMerge } from 'tailwind-merge'
import DateRange from '@/components/date-range'
import { toast } from 'react-toastify'
import { CopyIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

type Props = {
    className?: string;
    request: TInstagramAdRequest
}

const InstagramAdRequest = ({ request, className }: Props) => {
    const { preview } = request.AdvertismentPost;
    const t = useTranslations();

    const { nodesState } = useStoryNodesState([
        preview.text ?
            textNode({
                id: 'text-1',
                position: preview.text.position,
                data: {
                    text: preview.text.content ?? '',
                    align: Object.values(TextAlign).includes(preview.text.align as TextAlign)
                        ? preview.text.align as TextAlign
                        : undefined,
                    bgColor: Object.values(TextBgColor).includes(preview.text.bgColor as TextBgColor)
                        ? preview.text.bgColor as TextBgColor
                        : undefined,
                    font: StoryFont[preview.text?.font as keyof typeof StoryFont ?? 'Montserrat'],
                    fontSize: preview.text.fontSize,
                    textColor: preview.text.textColor,
                },
                draggable: false
            }) : null,
        preview.link ?
            linkNode({
                id: 'link-1',
                position: preview.link.position,
                data: {
                    link: preview.link.href ?? '',
                    text: preview.link.text,
                    scale: preview.link.scale,
                },
                draggable: false
            }) : null,
        preview.image ?
            imageNode({
                id: 'image-1',
                position: preview.image.position,
                data: {
                    href: preview.image.href ?? '',
                    scale: preview.image.scale,
                },
                draggable: false
            }) : null
    ])

    const { width: screenWidth } = useScreenSize();

    return (
        <div className={twMerge('flex items-start gap-5', className)}>
            <div className='flex-1 md:min-w-[400px] min-w-[none]'>
                <div className='flex items-center'>
                    <h3 className='font-title text-2xl mr-5'>
                        {request.AdvertismentPost.title}
                    </h3>

                    <AdvertismentRequestStatusBadge status={request.status} />
                </div>

                {!!request.AdvertismentPost.attachments.length && (
                    <div className='mt-5 '>
                        <h4 className='font-bold  text-lg'>
                            <Translate namespace='Advertiser' itemKey='attachment' />
                        </h4>

                        <ul>
                            {request.AdvertismentPost.attachments.map((attachment, index) => (
                                <li className='flex items-center gap-2' key={attachment.url}>
                                    <div>
                                        {index + 1}.
                                    </div>
                                    <div className='flex gap-2'>
                                        <Translate namespace='Files' itemKey={attachment.mediaType} />:
                                        <Button asChild variant={'link'} className='text-base'>
                                            <Link href={attachment.url} target='_blank' download={attachment.filename}>
                                                <div>{attachment.filename}</div>
                                            </Link>
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                    </div>
                )}

                {preview.link?.href ? (
                    <div className='mt-5 '>
                        <h4 className='font-bold text-lg'>
                            <Translate namespace="Default" itemKey="link" />
                        </h4>

                        <div className='flex items-center gap-3'>
                            <Link href={preview.link.href} target='_blank' className='hover:underline font-medium'>
                                {preview.link.href}
                            </Link>

                            <Button variant={'ghost'} size={'icon'} onClick={() => {
                                toast.success(t('Default.copied'), { autoClose: 3000 })
                            }}>
                                <CopyIcon className='size-5 ' />
                            </Button>
                        </div>
                    </div>
                ) : null}


                <div className='flex sm:flex-row gap-y-[1.5rem] mt-[1.5rem] flex-col sm:gap-10 sm:mt-8'>
                    <div className='sm:text-center text-left'>
                        <h4 className='font-bold'><Translate namespace="Blogger" itemKey="typepost" /></h4>

                        <p>
                            {request.AdvertismentPost.social}
                            {" - "}
                            <Translate namespace='Post-Types' itemKey={request.type} />
                        </p>
                    </div>

                    <div className='sm:text-center text-left'>
                        <h4 className='font-bold'><Translate namespace="Blogger" itemKey="price" /></h4>

                        <p>{request.price} ₴</p>
                    </div>

                    <div className='sm:text-center text-left'>
                        <h4 className='font-bold'><Translate namespace="Blogger" itemKey="publishdate" /></h4>

                        <DateRange className='sm:text-center text-left' dateFrom={request.dateFrom} dateTo={request.dateTo} />
                    </div>
                </div>

                {!!request.AdvertismentPost.content.length && (
                    <div className='p-5 pb-7 mt-3 shadow-md rounded-lg w-full md:w-[70%]'>
                        <h4 className='uppercase text-xl font-title first-letter:bg-yellow mb-2'>
                            <Translate namespace="Blogger" itemKey="descr" />
                        </h4>

                        <div className='max-w-[500px] break-all' dangerouslySetInnerHTML={{ __html: request.AdvertismentPost.content }} />
                    </div>
                )}


                <div className='flex justify-center w-full md:hidden mt-3'>
                    <Drawer>
                        <DrawerTrigger asChild>
                            <Button className='max-w-[20rem] w-full h-[3rem] mt-5' variant="outline">
                                <Translate namespace='Default' itemKey='view' />
                            </Button>
                        </DrawerTrigger>

                        <DrawerContent className='pb-5'>
                            <DrawerHeader>
                                <DrawerTitle><Translate namespace='Constructor' itemKey='view-post' /></DrawerTitle>
                            </DrawerHeader>

                            <div className='flex justify-center mt-5'>
                                <StoryEditor
                                    mode='view'
                                    nodesState={nodesState}
                                />
                            </div>
                        </DrawerContent>
                    </Drawer>
                </div>
            </div>



            {screenWidth >= 768 && (
                <div className='flex-1 hidden md:flex justify-center  select-none'>
                    <StoryEditor nodesState={nodesState} mode='view' />
                </div>
            )}

        </div>
    )
}

export default InstagramAdRequest