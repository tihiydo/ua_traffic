import { DataTable } from '@/components/ui/custom/data-table';
import { api } from '@/trpc/server'
import React from 'react'
import { columns } from './_components/columns';
import PageTitle from '@/components/page-title';

type Props = {}

const AdminBillingPage = async (props: Props) => {
    const withdrawTransactions = await api.admin.withdrawTransaction.getTransactions.query();

    return (
        <div className='container'>
            <div className='mb-12 mt-5'>
                <PageTitle>Біллінг</PageTitle>
            </div>


            <DataTable columns={columns} data={withdrawTransactions} />
        </div>
    )
}

export default AdminBillingPage