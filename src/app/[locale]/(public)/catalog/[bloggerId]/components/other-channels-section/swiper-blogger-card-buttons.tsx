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

const SwiperBloggerCardButtons = ({ blogger, selectedPrice }: Props) => {
    const router = useRouter();
    const { status } = useSession();
    const toggleSaveBlogger = api.user.toggleSaveBlogger.useMutation({
        onSuccess: () => {
            router.refresh()
        }
    });
    const isSessionLoading = status === 'loading';
    const isAuthentificated = status === 'authenticated';
    const isBloggerInactive = blogger.status === 'Inactive';

    return (
        <div className="flex w-full justify-between gap-3">
            {isAuthentificated ? (
                <>
                    <div className="flex-1">
                        <OrderPostModal
                            blogger={blogger}
                            selectedPrice={selectedPrice}
                            trigger={
                                <Button
                                    disabled={isSessionLoading || isBloggerInactive}
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
                        onClick={(e) => {
                            e.stopPropagation();

                            if (toggleSaveBlogger.isLoading) return;
                            toggleSaveBlogger.mutate({
                                bloggerId: blogger.id
                            });
                        }}
                    />
                </>
            ) : (
                <>
                    <div className="flex-1" onClick={e => e.stopPropagation()} >
                        <RegisterDialog>
                            <Button
                                disabled={isSessionLoading || isBloggerInactive}
                                className={'w-full'}
                                onClick={(e) => {
                                    e.stopPropagation()
                                }}
                            >
                                <Translate namespace="Advertiser" itemKey="orderpostnow" />
                            </Button>
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
            )}
        </div>
    )
}

export default SwiperBloggerCardButtons;
