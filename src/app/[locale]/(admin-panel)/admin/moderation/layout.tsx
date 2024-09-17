import PageTitle from '@/components/page-title'
import React from 'react'
import ModerationNavBar from './_components/moderation-nav-bar'

type Props = {
    children: React.ReactNode
}

const ModerationLayout = ({ children }: Props) => {
    return (
        <div className="mb-8 mt-5 container">
            <div >
                <div className="mb-12">
                    <PageTitle>Модерація</PageTitle>
                </div>

                <ModerationNavBar className="mt-5" />
            </div>

            <div className='mt-5'>{children}</div>
        </div>
    )
}

export default ModerationLayout
