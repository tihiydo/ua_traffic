'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Billings from './_components/billings-tab';
import WithdrawalProps from './_components/requisites/requisites-tab';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import Translate from '@/components/Translate';
import HistoryTab from './_components/history-tab/history-tab';

type Props = 
{
    params:
    {
        userId: string
    }
}
const BillingPage = (props: Props) => 
{
    const [page, setPage] = useState('billings');

    return (
        <>
            <div className='relative'>
                <div className='block mb-8 sm:hidden'>
                    <Select defaultValue='billings' onValueChange={setPage}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="billings"><Translate namespace="Blogger" itemKey="accounts" /></SelectItem>
                            <SelectItem value="withdrawal-applications"><Translate namespace="Blogger" itemKey="history" /></SelectItem>
                            <SelectItem value="withdrawal-props"><Translate namespace="Blogger" itemKey="details" /></SelectItem>
                        </SelectContent>
                    </Select>
                </div>
    
                <Tabs value={page} onValueChange={setPage}>
                    <TabsList className={"mb-3 gap-3 sm:inline-flex hidden"}>
                        <TabsTrigger className={`relative flex items-center gap-2 px-0.5 py-0.5 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-yellow after:content-[''] data-[state=active]:after:w-full`} value="billings">
                            <p className="font-title uppercase"><Translate namespace="Blogger" itemKey="accounts" /></p>
                        </TabsTrigger>
    
                        <TabsTrigger className={`relative flex items-center gap-2 px-0.5 py-0.5 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-yellow after:content-[''] data-[state=active]:after:w-full`} value="withdrawal-applications">
                            <p className="font-title uppercase"><Translate namespace="Blogger" itemKey="history" /></p>
                        </TabsTrigger>
    
                        <TabsTrigger className={`relative flex items-center gap-2 px-0.5 py-0.5 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-yellow after:content-[''] data-[state=active]:after:w-full`} value="withdrawal-props">
                            <p className="font-title uppercase"><Translate namespace="Blogger" itemKey="details" /></p>
                        </TabsTrigger>
                    </TabsList>
    
                    <TabsContent value={"billings"}>
                        <Billings userId={props.params.userId}/>
                    </TabsContent>
    
                    <TabsContent value={"withdrawal-applications"}>
                        <HistoryTab userId={props.params.userId}/>
                    </TabsContent>
    
                    <TabsContent value={"withdrawal-props"}>
                        <WithdrawalProps userId={props.params.userId}/>
                    </TabsContent>
                </Tabs>
            </div>
        </>

    )
 
}
export default BillingPage