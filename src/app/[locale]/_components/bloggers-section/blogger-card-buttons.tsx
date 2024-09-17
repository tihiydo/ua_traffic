'use client'

import Translate from '@/components/Translate';
import { OrderPostModal } from '@/components/order-post'
import RegisterDialog from '@/components/register-dialog';
import { Button } from '@/components/ui/button';
import { type Blogger } from '@/database/blogger';
import { useSession } from 'next-auth/react';
import React from 'react'

type Props = {
    blogger: Blogger;
    selectedPrice: string | null;
}

const BloggerCardButtons = ({ blogger, selectedPrice }: Props) => {
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
                </>
            ) : (
                <>
                    <div className="flex-1" onClick={e => e.stopPropagation()} >
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
                </>
            )}

        </div >
    )
}


export default BloggerCardButtons