import React from 'react'
import Table from './_components/table/table'
import PageTitle from '@/components/page-title'


const UsersPage = () => {

    return (
        <div className="my-8 container">
            <div>
                <div className="mb-5">
                    <PageTitle>Користувачі</PageTitle>
                </div>

            </div>

            <div><Table /></div>
        </div>
    )
}

export default UsersPage