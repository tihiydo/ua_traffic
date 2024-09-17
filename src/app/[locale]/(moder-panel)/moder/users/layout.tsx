import PageTitle from '@/components/page-title'
import React from 'react'

type Props = {
    children: React.ReactNode
}

const UsersLayout = ({ children }: Props) => {
    return (
        <div className="my-8 container">
            <div>
                <div className="mb-5">
                    <PageTitle>Користувачі</PageTitle>
                </div>

            </div>

            <div>{children}</div>
        </div>
    )
}

export default UsersLayout