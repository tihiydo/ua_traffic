import { DataTable } from '@/components/ui/custom/data-table';
import { api } from '@/trpc/server'
import React from 'react'
import CreateCookieModal from './components/create-cookie-modal';
import { columns } from './components/columns';
import PageTitle from '@/components/page-title';


const IGCookiesPage = async () => {
    const cookies = await api.admin.igCookie.getCookies.query();

    return (
        <div className='container my-8'>
            <PageTitle>Instagram Cookie</PageTitle>

            <div className='my-5'>
                <CreateCookieModal />
            </div>

            <DataTable columns={columns} data={cookies} />
        </div>
    )
}

export default IGCookiesPage