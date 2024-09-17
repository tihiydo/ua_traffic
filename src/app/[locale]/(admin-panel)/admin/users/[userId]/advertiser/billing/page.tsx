'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import Translate from '@/components/Translate';
import { api } from '@/trpc/react';
import BillingsTab from './_components/billings-tab';
import HistoryTab from './_components/history-tab/history-tab';
import Select, { type FormSelectItem } from '@/components/select';

type Tab = 'billings' | 'history'

type Props =
{
    params: 
    {
        userId: string
    }
}

const BillingPage = (props: Props) => {
    const { data: user, isLoading } = api.user.getMyUser.useQuery({userId: props.params.userId});
    const [tab, setTab] = useState<Tab>('billings');

    return (
        <div className='relative'>
            <div className="flex items-center mb-5">
                <div className="w-full flex items-center justify-between sm:justify-start  mr-0 sm:mr-14 text-lg">
                    <h2 className="font-title mr-4"><Translate namespace='Advertiser' itemKey='advbalance' /></h2>

                    <p className='text-right sm:text-left'>{user?.advertiserBalance ?? 0} ₴</p>
                </div>

            </div>

            <div className='block mb-4 sm:mb-8 sm:hidden'>
                <Select<Tab>
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
                            value: 'billings'
                        },
                        {
                            displayValue: <Translate namespace="Advertiser" itemKey="history" />,
                            value: 'history'
                        }
                    ]}
                />
            </div>
            <Tabs value={tab} onValueChange={(tab) => {
                setTab(tab as Tab);
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
                    <HistoryTab userId={props.params.userId}/>
                </TabsContent>
            </Tabs>
        </div>
    )

}
export default BillingPage