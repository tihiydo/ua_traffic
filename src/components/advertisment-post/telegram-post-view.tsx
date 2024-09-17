'use client'

import React from 'react'
import Translate from '../Translate';
import AdvetismentPostStatusBadge from '../ui/custom/badges/statuses/advertisment-post';
import { Button } from '../ui/button';
import { Link } from '@/i18n/navigation';
import { type TelegramAdPost } from '@/database/ad-post/post';
import { twMerge } from 'tailwind-merge';
import { TelegramPostEmulator } from '@/modules/telegram-post-emulator';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';

type Props = {
    advertismentPost: TelegramAdPost;
    className?: string;
}

const TelegramPostView = ({ advertismentPost, className }: Props) => {

    return (
        <div className='flex items-start gap-5'>
            <div className={twMerge('md:min-w-[400px] min-w-[none] ', className)}>
                <div className='flex items-center'>
                    <h3 className='font-title text-2xl mr-5'>
                        {advertismentPost.title}
                    </h3>

                    <AdvetismentPostStatusBadge status={advertismentPost.status} />
                </div>

                {!!advertismentPost.attachments.length && (
                    <div className='mt-5 '>
                        <h4 className='font-bold  text-lg'>
                            <Translate namespace='Advertiser' itemKey='attachment' />
                        </h4>

                        <ul>
                            {advertismentPost.attachments.map((attachment, index) => (
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

                <div className='mt-3 '>
                    <h4 className='font-bold'><Translate namespace="Blogger" itemKey="typepost" /></h4>

                    <p>{advertismentPost.social}</p>
                </div>


                <div className='block md:hidden mt-3'>
                    <Drawer>
                        <DrawerTrigger asChild>
                            <Button className='max-w-[300px] w-full mt-5' variant="outline">
                                <Translate namespace='Default' itemKey='view' />
                            </Button>
                        </DrawerTrigger>

                        <DrawerContent className='pb-5'>
                            <DrawerHeader>
                                <DrawerTitle><Translate namespace='Constructor' itemKey='view-post' /></DrawerTitle>
                            </DrawerHeader>

                            <div className='flex justify-center mt-5'>
                                <TelegramPostEmulator
                                    className='flex-1 flex justify-center select-none max-w-[280px]'
                                    content={advertismentPost.content}
                                    inlineKeyboard={advertismentPost.preview.buttons.map(button => ({
                                        display: button.display,
                                        href: button.url
                                    }))}
                                    media={advertismentPost.attachments.map(attachment => attachment.url)}
                                />
                            </div>
                        </DrawerContent>
                    </Drawer>
                </div>

                {!!advertismentPost.content.length && (
                    <div className='p-5 pb-7 mt-3 shadow-md rounded-lg w-[70%]'>
                        <h4 className='uppercase text-xl font-title first-letter:bg-yellow mb-2'>
                            <Translate namespace="Blogger" itemKey="descr" />
                        </h4>

                        <div className='max-w-[500px] break-all' dangerouslySetInnerHTML={{ __html: advertismentPost.content }} />
                    </div>
                )}

            </div>

            {/* Desktop constructor */}
            <div className='flex-1 flex-shrink-0 min-w-[280px] hidden md:flex justify-center select-none md:max-w-[280px] lg:max-w-[320px] mx-auto'>
                <TelegramPostEmulator
                    className=''
                    content={advertismentPost.content}
                    inlineKeyboard={advertismentPost.preview.buttons.map(button => ({
                        display: button.display,
                        href: button.url
                    }))}
                    media={advertismentPost.attachments.map(attachment => attachment.url)}
                />
            </div>

        </div>

    )
}

export default TelegramPostView