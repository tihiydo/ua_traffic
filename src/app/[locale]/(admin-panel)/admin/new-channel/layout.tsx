import PageTitle from '@/components/page-title'
import GoBackLink from '@/components/go-back-link'
import React from 'react'

type Props = {
    children: React.ReactNode
}

const ChannelLayout = ({ children }: Props) => {
    return (
        <div className="my-8 container">
            <div>
                <div className="mb-5">
                    <PageTitle>Створення каналу</PageTitle>
                    <GoBackLink fallbackLink='/admin/moderation/bloggers/' className='mt-[2rem]'/>
                </div>

            </div>

            <div>{children}</div>
        </div>
    )
}

export default ChannelLayout