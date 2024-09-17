import Translate from '@/components/Translate'
import GoBackLink from '@/components/go-back-link'
import AdvertismentPostStatusBadge from '@/components/ui/custom/badges/statuses/advertisment-post'
import { Separator } from '@/components/ui/separator'
import SocialIcon from '@/components/ui/social-icon'
import { api } from '@/trpc/server'
import React from 'react'
import { BookTextIcon, LinkIcon, PaperclipIcon } from 'lucide-react'
import DownloadButton from '@/components/download-button'
import CopyButton from '@/components/copy-button'
import MediaTypeIcon from '@/components/media-type-icon'
import { Link } from '@/i18n/navigation'
import { truncate } from '@/utils'
import PostPreview from '@/components/post-preview'

type Props = {
    params: { postId: string }
}



const AdminModerationAdPostPage = async ({ params }: Props) => {
    const advertismentPost = await api.admin.advertisment.getPost.query({ postId: params.postId })
    return (
        <div>
            <GoBackLink  />

            <div className='mt-5 grid grid-cols-2 md:grid-cols-4 gap-5'>
                <div className='col-span-2'>
                    <div className='mx-auto border border-gray-secondary rounded-md p-4 max-w-[24rem]'>
                        <div className='flex gap-3 justify-between'>
                            <div className='flex items-center gap-3'>
                                <SocialIcon className='size-6' social={advertismentPost.social} />

                                <h2 className={'font-title text-lg'}>{advertismentPost.title}</h2>
                            </div>

                            <div>
                                <AdvertismentPostStatusBadge className='px-5 font-medium' status={advertismentPost.status} />
                            </div>
                        </div>

                        {advertismentPost.attachments.length ? (
                            <>
                                <Separator className='my-3' />
                                <div className='flex flex-col gap-3'>
                                    <h5 className='font-bold flex gap-2 items-center'>
                                        <PaperclipIcon size={25} className='text-yellow' />
                                        <Translate namespace='Advertiser' itemKey='attachments' />
                                    </h5>

                                    <ul className='flex-1 flex flex-col w-full gap-2 px-2'>
                                        {advertismentPost.attachments.map(attachment => (
                                            <li key={attachment.url} className='flex gap-2 justify-between items-center w-full'>
                                                <div className='flex gap-1.5 items-center'>
                                                    <MediaTypeIcon className={'size-7'} type={attachment.mediaType} />

                                                    <Link href={attachment.url} target={'_blank'} className={'text-sm sm:text-base hover:underline font-medium'}>
                                                        {truncate(attachment.filename, 24)}
                                                    </Link>
                                                </div>

                                                <div className='flex gap-2 items-center'>
                                                    <CopyButton className='size-8 p-1.5 sm:size-10 sm:p-2' text={attachment.url} />
                                                    <DownloadButton className='size-8 p-1.5 sm:size-10 sm:p-2' filename={attachment.filename} url={attachment.url} />
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        ) : null}

                        {advertismentPost.content.length ? (
                            <>
                                <Separator className='my-3' />
                                <div className='flex flex-col gap-3 '>
                                    <div>
                                        <h5 className='font-bold flex gap-2 items-center'>
                                            <BookTextIcon size={25} className='text-yellow' />
                                            <Translate namespace='Advertiser' itemKey='content' />
                                        </h5>
                                    </div>

                                    <div className='w-full max-w-none break-words px-2' dangerouslySetInnerHTML={{ __html: advertismentPost.content }}>
                                    </div>
                                </div>
                            </>
                        ) : null}

                        {advertismentPost.preview.social === 'Instagram' && advertismentPost.preview.link?.href ? (
                            <>
                                <Separator className='my-3' />
                                <div className='flex flex-col gap-3 '>
                                    <div>
                                        <h5 className='font-bold flex gap-2 items-center'>
                                            <LinkIcon size={25} className='text-yellow' />
                                            <Translate namespace='Default' itemKey='link' />
                                        </h5>
                                    </div>

                                    <div className='px-2 flex justify-between items-center gap-3 '>
                                        <Link href={advertismentPost.preview.link.href} target='_blank' className="break-all text-sm sm:text-base hover:underline font-medium">
                                            {truncate(advertismentPost.preview.link.href, 30)}
                                        </Link>

                                        <CopyButton className={'p-1.5 sm:p-2 size-8 sm:size-10'} text={advertismentPost.preview.link.href} />
                                    </div>
                                </div>
                            </>
                        ) : (
                            null
                        )}
                    </div>

                </div>
                <div className='col-span-2 '>
                    <div className={'mx-auto w-fit'}>
                        <PostPreview adPost={advertismentPost} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminModerationAdPostPage