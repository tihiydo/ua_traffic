import React from 'react'

type Props = {
    children: React.ReactNode;
}

const PageTitle = ({ children}: Props) => {
    return (
        <h1 className='uppercase text-3xl font-title first-letter:bg-yellow '>{children}</h1>
    )
}

export default PageTitle