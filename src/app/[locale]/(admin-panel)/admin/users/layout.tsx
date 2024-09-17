import PageTitle from '@/components/page-title'
import React from 'react'

type Props = {
    children: React.ReactNode
}

const UsersLayout = ({ children }: Props) => {
    return (
        <>
            {children}
        </>
    )
}

export default UsersLayout