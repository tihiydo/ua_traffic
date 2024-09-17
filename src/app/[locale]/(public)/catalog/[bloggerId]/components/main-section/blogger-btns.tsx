'use client'

import Translate from '@/components/Translate'
import { OrderPostModal } from '@/components/order-post'
import RegisterDialog from '@/components/register-dialog'
import { Button } from '@/components/ui/button'
import { SaveBloggerButton } from '@/components/ui/custom/blogger-card'
import { useRouter } from '@/i18n/navigation'
import { api } from '@/trpc/react'
import type { CatalogBlogger } from '@/types/enities/blogger'
import { useSession } from 'next-auth/react'
import React from 'react'
import { twMerge } from 'tailwind-merge'

type Props = {
    className?: string
    blogger: CatalogBlogger;
}

const BloggerButtons = ({ className, blogger }: Props) => {
    const router = useRouter();
    const toggleSaveBlogger = api.user.toggleSaveBlogger.useMutation({
        onSuccess: () => {
            router.refresh()
        }
    });

    const { status } = useSession();
    const isSessionLoading = status === 'loading';
    const isAuthentificated = status === 'authenticated';

    return (
        <div className={twMerge('flex gap-3 w-full items-center', className)}>
            {isAuthentificated ? (
                <>
                    <div className='flex-1'>
                        <OrderPostModal blogger={blogger} trigger={
                            <Button disabled={isSessionLoading} size={'lg'} className='w-full'>
                                <Translate namespace="Advertiser" itemKey="orderpostnow" />
                            </Button>
                        } />
                    </div>

                    <SaveBloggerButton
                        disabled={isSessionLoading}
                        isLoading={toggleSaveBlogger.isLoading}
                        isSaved={blogger.isSaved}
                        onClick={(e) => {
                            e.stopPropagation()

                            if (toggleSaveBlogger.isLoading) return;
                            toggleSaveBlogger.mutate({
                                bloggerId: blogger.id
                            })
                        }}
                    />
                </>
            ) : (
                <>
                    <div className='flex-1'>
                        <RegisterDialog>
                            <Button
                                disabled={isSessionLoading}
                                size={'lg'}
                                className='w-full'
                            >
                                <Translate namespace="Advertiser" itemKey="orderpostnow" />
                            </Button>
                        </RegisterDialog>
                    </div>

                    <RegisterDialog>
                        <SaveBloggerButton
                            disabled={isSessionLoading}
                            isLoading={false}
                            isSaved={false}
                        />
                    </RegisterDialog>
                </>
            )}

        </div>
    )
}

export default BloggerButtons