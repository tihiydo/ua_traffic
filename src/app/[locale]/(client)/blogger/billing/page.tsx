'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Billings from './_components/billings-tab';
import WithdrawalProps from './_components/requisites/requisites-tab';
import Translate from '@/components/Translate';
import WithdrawDialog from './_components/withdraw/withdraw-dialog';
import HistoryTab from './_components/withdraws-tab/history-tab';
import Select from '@/components/select';
import { api } from '@/trpc/react';
import { useTabs } from '@/hooks/use-tabs';
import { BloggerBillingTab, BloggerBillingTabSchema } from './schemas';
import TransferMoneyModal from './_components/transferModal';
import { Button } from '@/components/ui/button';

const BillingPage = () => {
    const { data: user, isLoading } = api.user.getMyUser.useQuery();
    const [page, setPage] = useTabs(BloggerBillingTabSchema, {
        defaultValue: 'billings',
        key: 'tab'
    });

    return (
        <div className='relative'>
            <h1 className="text-[30px] leading-[35px] font-bold mb-4">
                <Translate namespace="Advertiser" itemKey="billing" />
            </h1>
            <div className="flex sm:flex-row flex-col justify-between">
                <div className="w-full flex items-center justify-between sm:justify-start mr-0 sm:mr-14 text-lg">
                    <h2 className="font-title uppercase my-[10px] sm:my-[20px]"><Translate namespace='Blogger' itemKey='balance-blogger' /> :</h2>
                    <p className='ml-4 text-left'>{user?.bloggerBalance ?? 0} ₴</p>
                </div>
                <div className='self-auto flex sm:self-center'>
                    <WithdrawDialog className="sm:w-fit w-[100%] my-[10px] sm:my-[0px]" />
                    <TransferMoneyModal>
                        <Button variant={'outline'} className="sm:w-fit w-[100%] my-[10px] sm:my-[0px] ml-2">
                            <Translate namespace='Advertiser' itemKey='transfer' />
                        </Button>
                    </TransferMoneyModal>
                </div>

            </div>

            <div className='block mb-4 sm:mb-8 sm:hidden'>
                <Select<BloggerBillingTab>
                    value={page}
                    onChange={(value) => {
                        if (!value) return;
                        setPage(value)
                    }}
                    items={[
                        {
                            value: 'billings',
                            displayValue: <Translate namespace="Blogger" itemKey="accounts" />,
                        },
                        {
                            value: 'history',
                            displayValue: <Translate namespace="Blogger" itemKey="history" />,
                        },
                        {
                            value: 'requisites',
                            displayValue: <Translate namespace="Blogger" itemKey="details" />,
                        }
                    ]}
                />
            </div>

            <Tabs
                value={page}
                onValueChange={(value) => {
                    const parsedValue = BloggerBillingTabSchema.safeParse(value);

                    if (parsedValue.success) {
                        setPage(parsedValue.data)
                    }
                }}
            >
                <TabsList className={"mb-3 gap-3 sm:inline-flex hidden"}>
                    <TabsTrigger
                        value="billings"
                        className={`relative flex items-center gap-2 px-0.5 py-0.5 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-yellow after:content-[''] data-[state=active]:after:w-full`}
                    >
                        <p className="font-title uppercase"><Translate namespace="Blogger" itemKey="accounts" /></p>
                    </TabsTrigger>

                    <TabsTrigger
                        value="history"
                        className={`relative flex items-center gap-2 px-0.5 py-0.5 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-yellow after:content-[''] data-[state=active]:after:w-full`}
                    >
                        <p className="font-title uppercase"><Translate namespace="Blogger" itemKey="history" /></p>
                    </TabsTrigger>

                    <TabsTrigger
                        value="requisites"
                        className={`relative flex items-center gap-2 px-0.5 py-0.5 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-yellow after:content-[''] data-[state=active]:after:w-full`}
                    >
                        <p className="font-title uppercase"><Translate namespace="Blogger" itemKey="details" /></p>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={"billings"}>
                    <Billings />
                </TabsContent>

                <TabsContent value={"history"}>
                    <HistoryTab />
                </TabsContent>

                <TabsContent value={"requisites"}>
                    <WithdrawalProps />
                </TabsContent>
            </Tabs>
        </div>
    )

}
export default BillingPage