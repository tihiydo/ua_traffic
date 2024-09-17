'use client'
import Translate from '@/components/Translate';
import { OrderPostModal } from '@/components/order-post'
import RegisterDialog from '@/components/register-dialog';
import { Button } from '@/components/ui/button';
import { SaveBloggerButton } from '@/components/ui/custom/blogger-card';
import { useRouter } from '@/i18n/navigation';
import { api } from '@/trpc/react';
import { type CatalogBlogger } from '@/types/enities/blogger';
import { useSession } from 'next-auth/react';
import React from 'react'

type Props = {
    blogger: CatalogBlogger;
    selectedPrice: string | null;
}

const MainCardButtons = ({ blogger, selectedPrice }: Props) => {
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
        <div className="flex w-full justify-between gap-3">
            {isAuthentificated ? (
                <>
                    <div className="flex-1" >
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
                    </div>

                    <SaveBloggerButton
                        disabled={isSessionLoading}
                        isLoading={toggleSaveBlogger.isLoading}
                        isSaved={blogger.isSaved}
                        onClick={() => {
                            if (toggleSaveBlogger.isLoading) return;
                            toggleSaveBlogger.mutate({
                                bloggerId: blogger.id
                            })
                        }}
                    />
                </>
            ) : (
                <>
                    <div className="flex-1">
                        <RegisterDialog>
                            <Button
                                disabled={isSessionLoading}
                                className={'w-full'}
                                onClick={(e) => {
                                    e.stopPropagation()
                                }}
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
                            onClick={(e) => {
                                e.stopPropagation()
                            }}
                        />
                    </RegisterDialog>
                </>
            )}
        </div >
    )
}

export default MainCardButtons