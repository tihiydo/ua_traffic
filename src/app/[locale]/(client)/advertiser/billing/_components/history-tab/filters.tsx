'use client'

import Translate from '@/components/Translate';
import { Button } from '@/components/ui/button';
import Select from '@/components/select';
import { useTranslations } from 'next-intl';
import { AdvertiserTransactionType } from '@/types/history/advertiser';
import { AdRequestTransactionStatus, DepositTransactionStatus } from '@prisma/client';


export type FiltersData = {
    type?: AdvertiserTransactionType | "All";
    status?: DepositTransactionStatus | AdRequestTransactionStatus | 'All'
};

type Props = {
    onChange: (filters: FiltersData) => void;
    filters?: FiltersData
}

const Filters = ({ onChange, filters }: Props) => {
    const defaultT = useTranslations("Default");

    return (
        <div>
            <div className='flex gap-3 items-center justify-between mb-6 mt-5'>
                <h4 className='font-title text-lg'><Translate namespace="Default" itemKey="filters" /></h4>

                <Button
                    type='button'
                    variant={'link'}
                    className='text-sm'
                    onClick={() => {
                        onChange({ type: 'All' })
                    }}
                >
                    <Translate namespace='Default' itemKey='clean' />
                </Button>
            </div>


            <div className='mt-6'>
                <h5 className='font-bold block mb-1.5'>
                    <Translate namespace='Transaction' itemKey='transaction-type' />
                </h5>

                <Select
                    value={filters?.type}
                    defaultValue='All'
                    onChange={(selectedValue) => {
                        onChange({ ...filters, type: selectedValue, status: 'All' })
                    }}
                    items={[
                        {
                            value: 'All',
                            displayValue: <Translate namespace='Default' itemKey={`all`} />
                        },
                        ...Object.values(AdvertiserTransactionType).map(type => ({
                            displayValue: <Translate namespace='Transaction.Advertiser' itemKey={`${type}.name`} />,
                            value: type
                        })),
                    ]
                    }
                    placeholder={defaultT('all')}
                />
            </div>

            {filters?.type === 'Request' || filters?.type === 'Deposit' ? (
                <div className='mt-6'>
                    <h5 className='font-bold block mb-1.5'>
                        <Translate namespace='Transaction' itemKey='transaction-status' />
                    </h5>

                    <Select<NonNullable<FiltersData['status']>>
                        unselectable
                        value={filters?.status ?? 'All'}
                        defaultValue='All'
                        onChange={(selectedValue) => {
                            onChange({ ...filters, status: selectedValue })
                        }}
                        items={filters.type === 'Request'
                            ? [
                                {
                                    value: 'All',
                                    displayValue: <Translate namespace='Default' itemKey={`all`} />
                                },
                                ...Object.values(AdRequestTransactionStatus).map(status => ({
                                    displayValue: <Translate namespace='Transaction.Advertiser' itemKey={`${filters.type}.Status.${status}`} />,
                                    value: status
                                }))
                            ]
                            : [
                                {
                                    value: 'All',
                                    displayValue: <Translate namespace='Default' itemKey={`all`} />
                                },
                                ...Object.values(DepositTransactionStatus).map(status => ({
                                    displayValue: <Translate namespace='Transaction.Advertiser' itemKey={`${filters.type}.Status.${status}`} />,
                                    value: status
                                }))
                            ]
                        }
                        placeholder={defaultT('all')}
                    />
                </div>
            ) : null}
        </div>
    )
}

export default Filters