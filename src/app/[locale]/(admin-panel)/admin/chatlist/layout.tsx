import PageTitle from '@/components/page-title'
import React from 'react'

type Props = {
    children: React.ReactNode
}

const ChatsLayout = ({ children }: Props) => {
    return (
        <div className="my-8 container">
            <div>

            </div>

            <div>{children}</div>
        </div>
    )
}

export default ChatsLayout