'use client'

import Translate from '@/components/Translate';
import Select, { type FormSelectItem } from '@/components/select'
import { Button } from '@/components/ui/button';
import { useMutableSearchParams } from '@/hooks/use-mutable-search-params';
import { api } from '@/trpc/react';
import { PlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

type Props = {
    onChange: (value?: string) => void;
    value?: string;
    close?: () => void;
}

const RequisitesSelect = ({ onChange, value, close }: Props) => {
    const bloggerT = useTranslations('Blogger');
    const { set } = useMutableSearchParams();
    const { data: requisites = [], isLoading } = api.requisites.getMyRequisites.useQuery();

    const items: FormSelectItem[] = requisites.map((requisite) => ({
        value: requisite.cardNumber,
        displayValue:
            <div className="flex justify-between w-full">
                <div>{requisite.cardNumber}</div>
                <div className={twMerge("mr-2 flex items-center", requisite.cardBank == "Mastercard" ? "text-[#d62929]" : "text-[#3571d0]")}>{requisite.cardBank}</div>
            </div>
    }))

    return (
        <Select
            placeholder={bloggerT('ourdetails')}
            value={value}
            onChange={onChange}
            isLoading={isLoading}
            items={items}
            notFound={
                <div className='text-sm p-0.5 flex justify-between gap-2'>
                    <div className='flex-1 mr-2'>
                        <h6 className={'font-medium'}>
                            <Translate namespace='Blogger.Revenue-Page' itemKey='requisites-not-found' />
                        </h6>
                        <p className={'text-main/70'}>
                            <Translate namespace='Blogger.Revenue-Page' itemKey='create-requisites-q' />
                        </p>
                    </div>

                    <Button size={'icon'} className='min-w-10 min-h-10'>
                        <PlusIcon onClick={() => {
                            close?.()
                            set('tab', 'requisites')
                        }} />
                    </Button>
                </div>
            }
        />
    )
}

export default RequisitesSelect