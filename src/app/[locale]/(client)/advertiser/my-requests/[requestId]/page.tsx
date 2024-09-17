import Translate from '@/components/Translate'
import CopyButton from '@/components/copy-button'
import DownloadButton from '@/components/download-button'
import GoBackLink from '@/components/go-back-link'
import MediaTypeIcon from '@/components/media-type-icon'
import AdvertismentRequestStatusBadge from '@/components/ui/custom/badges/statuses/advertisment-request'
import { Separator } from '@/components/ui/separator'
import SocialIcon from '@/components/ui/social-icon'
import { type AdRequest as AdRequestType } from '@/database/ad-request'
import { Link, redirect } from '@/i18n/navigation'
import { api } from '@/trpc/server'
import { truncate } from '@/utils'
import { BookTextIcon, LinkIcon, MegaphoneIcon, PaperclipIcon, ReceiptIcon, TimerIcon } from 'lucide-react'
import React from 'react'
import BloggerAvatar from '@/components/ui/custom/blogger-avatar'
import { format } from 'date-fns'
import PostPreview from '@/components/post-preview'

type Props = {
    params: {
        requestId: string
    }
}

const AdvertismentRequestPage = async ({ params }: Props) => {
    try
    {
        const advertismentReqest = await api.advertisment.requests.getRequest.query({ id: params.requestId }) as AdRequestType
        const advertismentPost = advertismentReqest.AdvertismentPost
        return (
                <div className='mb-5'>
                    <GoBackLink fallbackLink='/advertiser/my-posts' />
        
                    <div className='mt-5 grid grid-cols-2 md:grid-cols-4 gap-5'>
                        <div className='col-span-2'>
                            <div className='mx-auto border border-gray-secondary rounded-md p-4 max-w-[24rem]'>
                                <div className='flex gap-3 justify-between'>
                                    <div className='flex items-center gap-3'>
                                        <SocialIcon className='size-6' social={advertismentPost.social} />
        
                                        <h2 className={'font-title text-lg'}>{advertismentPost.title}</h2>
                                    </div>
        
                                    <div>
                                        <AdvertismentRequestStatusBadge className='px-5 font-medium' status={advertismentReqest.status} />
                                    </div>
                                </div>
        
                                <Separator className='my-3' />
        
                                <div className='flex justify-between gap-2'>
                                    <div className='font-bold flex gap-2 items-center'>
                                        <ReceiptIcon size={25} className='text-yellow' />
        
                                        <Translate namespace='Default' itemKey='price' />
                                    </div>
        
                                    <p className='font-bold mr-2'>
                                        {advertismentReqest.price} ₴
                                    </p>
                                </div>
        
        
                                <div className='flex justify-between gap-2 mt-3'>
                                    <div className='font-bold flex gap-2 items-center'>
                                        <MegaphoneIcon size={25} className='text-yellow' />
        
                                        <Translate namespace='Default' itemKey='post-type' />
                                    </div>
        
                                    <p className='font-bold mr-2'>
                                        <Translate namespace='Post-Types' itemKey={advertismentReqest.type} />
                                    </p>
                                </div>
        
                                <div className='flex flex-col gap-2 mt-3'>
                                    <div className='font-bold flex gap-2 items-center'>
                                        <TimerIcon size={25} className='text-yellow' />
        
                                        <Translate namespace='Default' itemKey='publish-time' />
                                    </div>
        
                                    <div className='px-2 font-medium'>
                                        {advertismentReqest.status === 'New' ? (
                                            <div className='text-center'>
                                                <p>
                                                    <Translate namespace='Dates' itemKey='date-range' values={{
                                                        from: format(advertismentReqest.dateFrom, 'dd.MM.yyyy'),
                                                        to: format(advertismentReqest.dateTo, 'dd.MM.yyyy')
                                                    }} />
                                                </p>
                                                <p>
                                                    <Translate namespace='Dates' itemKey='date-range' values={{
                                                        from: format(advertismentReqest.dateFrom, 'HH:mm'),
                                                        to: format(advertismentReqest.dateTo, 'HH:mm')
                                                    }} />
                                                </p>
        
                                            </div>
                                        ) : (
                                            advertismentReqest.exactDate ? (
                                                <div className='text-center'>
                                                    <Translate namespace='Dates' itemKey='exact-date' values={{
                                                        date: format(advertismentReqest.exactDate, 'dd.MM.yyyy'),
                                                        time: format(advertismentReqest.exactDate, 'HH:mm')
                                                    }} />
                                                </div>
                                            ) : null
                                        )}
                                    </div>
                                </div>
        
                                <Separator className='my-3' />
        
                                <div className='flex gap-5'>
                                    <BloggerAvatar className={'size-20'} src={advertismentReqest.Blogger?.profilePicture} />
        
                                    <div className='mt-1'>
                                        <div className='font-bold'>
                                            {advertismentReqest.Blogger?.profileLink ? (
                                                <h4>
                                                    <Link href={advertismentReqest.Blogger.profileLink} target='_blank' className='hover:underline'>
                                                        {advertismentReqest.Blogger?.username}
                                                    </Link>
                                                </h4>
                                            ) : <h4>{advertismentReqest.Blogger?.username}</h4>}
                                        </div>
        
                                        <div className='mt-2'>
                                            <Translate namespace='Default' itemKey='followers-count' values={{ count: advertismentReqest.Blogger?.followersCount }} />
                                        </div>
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
    catch
    {
        redirect("/advertiser/my-requests?error=request-not-find")
    }
}

export default AdvertismentRequestPage