import { DataTable } from '@/components/ui/custom/data-table';
import { api } from '@/trpc/server'
import React from 'react'
import PageTitle from '@/components/page-title';

type Props = {
    children: React.ReactNode;
};

const Fees = async ({ children }: Props) =>
{
    return (
        <div className="mb-8 mt-5 container">
            <div >
                <div className="mb-12">
                    <PageTitle>Статистика</PageTitle>
                </div>

            </div>

            <div className='mt-5'>{children}</div>
        </div>
    )
}

export default Fees