'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import Translate from '@/components/Translate';
import { api } from '@/trpc/react';
import BillingsTab from './_components/billings-tab';
import HistoryTab from './_components/history-tab/history-tab';
import { DepositModal } from '@/components/forms/deposit-form';
import Select from '@/components/select';
import { Button } from '@/components/ui/button';
import TransferMoneyModal from './_components/transferModal';

type AdvBillingTab = 'billings' | 'history'

const BillingPage = () => {
    const { data: user, isLoading } = api.user.getMyUser.useQuery();
    const [tab, setTab] = useState<AdvBillingTab>('billings');

    return (
        <div className='relative'>
            <h1 className="text-[30px] leading-[35px] font-bold mb-4">
                <Translate namespace="Advertiser" itemKey="billing" />
            </h1>
            <div className="flex sm:flex-row flex-col justify-between">
                <div className="w-full flex items-center justify-between sm:justify-start mr-0 sm:mr-14 text-lg">
                    <h2 className="font-title uppercase my-[10px] sm:my-[20px]"><Translate namespace='Advertiser' itemKey='advbalance' /> :</h2>
                    <p className='ml-4 text-left'>{user?.advertiserBalance ?? 0} ₴</p>
                </div>
                <div className='self-auto flex  sm:self-center'>
                    <DepositModal>
                        <Button className="sm:w-fit w-[100%] my-[10px] sm:my-[0px]"><Translate namespace='Advertiser' itemKey='addmoney' /></Button>
                    </DepositModal>
                    <TransferMoneyModal>
                        <Button variant={'outline'} className="sm:w-fit w-[100%] my-[10px] sm:my-[0px] ml-2">
                            <Translate namespace='Advertiser' itemKey='transfer' />
                        </Button>
                    </TransferMoneyModal>
                </div>

            </div>

            <div className='block mb-4 sm:mb-8 sm:hidden'>
                <Select<AdvBillingTab>
                    classNames={{
                        content: 'w-[95vw]  sm:hidden'
                    }}
                    onChange={(newTab) => {
                        if (!newTab) return
                        setTab(newTab);
                    }}
                    value={tab}
                    items={[
                        {
                            displayValue: <Translate namespace="Advertiser" itemKey="accounts" />,
                            value: 'billings' as const
                        },
                        {
                            displayValue: <Translate namespace="Advertiser" itemKey="history" />,
                            value: 'history' as const
                        },
                    ]}
                />
            </div>

            <Tabs value={tab} onValueChange={(tab) => {
                setTab(tab as AdvBillingTab);
            }}>
                <TabsList className={"mb-3 gap-3 sm:inline-flex hidden"}>
                    <TabsTrigger
                        className={`relative flex items-center gap-2 px-0.5 py-0.5 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-yellow after:content-[''] data-[state=active]:after:w-full`}
                        value="billings"
                    >
                        <p className="font-title uppercase"><Translate namespace="Advertiser" itemKey="accounts" /></p>
                    </TabsTrigger>

                    <TabsTrigger
                        className={`relative flex items-center gap-2 px-0.5 py-0.5 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-yellow after:content-[''] data-[state=active]:after:w-full`}
                        value="history"
                    >
                        <p className="font-title uppercase"><Translate namespace="Advertiser" itemKey="history" /></p>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={"billings"}>
                    <BillingsTab user={user ?? undefined} isLoading={isLoading} />
                </TabsContent>

                <TabsContent value={"history"}>
                    <HistoryTab />
                </TabsContent>
            </Tabs>
        </div>
    )

}
export default BillingPage