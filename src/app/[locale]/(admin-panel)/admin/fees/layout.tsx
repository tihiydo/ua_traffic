import { DataTable } from '@/components/ui/custom/data-table';
import { api } from '@/trpc/server'
import React from 'react'
import PageTitle from '@/components/page-title';
import ModerationNavBar from './_сomponents/fees-nav-bar';

type Props = {
    children: React.ReactNode;
};

const Fees = async ({ children }: Props) =>
{
    return (
        <div className="mb-8 mt-5 container">
            <div >
                <div className="mb-12">
                    <PageTitle>Комісії</PageTitle>
                </div>

                <ModerationNavBar className="mt-5" />
            </div>

            <div className='mt-5'>{children}</div>
        </div>
    )
}

export default Fees