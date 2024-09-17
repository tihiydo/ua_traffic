'use client'
import Translate from '@/components/Translate';
import { OrderPostModal } from '@/components/order-post'
import RegisterDialog from '@/components/register-dialog';
import { Button } from '@/components/ui/button';
import { SaveBloggerButton } from '@/components/ui/custom/blogger-card';
import { useRouter } from '@/i18n/navigation';
import { GuideHint, GuideHintWrapper } from '@/modules/guide';
import { TASK_ID } from '@/modules/guide/tasks';
import { api } from '@/trpc/react';
import { type CatalogBlogger } from '@/types/enities/blogger';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import React from 'react'
import { toast } from 'react-toastify';

type Props = {
    blogger: CatalogBlogger;
    isFirst: boolean;
    selectedPrice: string | null;
}

const BloggerCardButtons = ({ blogger, isFirst, selectedPrice }: Props) => {
     const t = useTranslations()
    const router = useRouter();
    const toggleSaveBlogger = api.user.toggleSaveBlogger.useMutation({
        onSuccess: (res) => {
            if(res.isSaved) {
            toast.success(t('Blogger.saved'))
        }
                    router.refresh()

        }
    });

    const { status } = useSession();
    const isSessionLoading = status === 'loading';
    const isAuthentificated = status === 'authenticated';
    const hasDiscount = blogger.prices && Object.values(blogger.prices).some(price => price && price.discount)

    return (

        <div className="flex w-full justify-between gap-3">
            {isAuthentificated ? (
                <>
                    <div className="flex-1" >
                        <GuideHintWrapper shouldRenderHint={isFirst} taskId={TASK_ID.CATALOG.FIRST_ORDER}  className='w-full rounded-md'>
                            <OrderPostModal
                                blogger={blogger}
                                selectedPrice={selectedPrice}
                                trigger={
                                    
                                    <Button
                                        disabled={isSessionLoading}
                                        className={'w-full'}
                                    >
                                        <Translate namespace="Advertiser" itemKey="orderpostnow" />
                                    </Button>
                                }
                            />

                            <GuideHint className='w-[200px]' />
                        </GuideHintWrapper>
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
                    <div className="flex-1" onClick={e => e.stopPropagation()} >
                        <RegisterDialog>
                            <GuideHintWrapper shouldRenderHint={isFirst} taskId={TASK_ID.CATALOG.FIRST_ORDER} className='w-full rounded-md'>
                                <Button
                                    disabled={isSessionLoading}
                                    className={'w-full'}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                    }}
                                >
                                    <Translate namespace="Advertiser" itemKey="orderpostnow" />
                                </Button>

                                <GuideHint className='w-[300px]' />
                            </GuideHintWrapper>
                        </RegisterDialog>
                    </div>

                    <div onClick={e => e.stopPropagation()} >
                        <RegisterDialog>
                            <SaveBloggerButton
                                disabled={isSessionLoading}
                                isLoading={false}
                                isSaved={false}
                                onClick={(e) => {
                                    e.stopPropagation()
                                }}
                            />
                        </RegisterDialog>
                    </div>
                </>
            )
            }

        </div >
    )
}


export default BloggerCardButtons