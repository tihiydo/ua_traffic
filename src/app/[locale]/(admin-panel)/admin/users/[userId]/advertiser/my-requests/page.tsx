import React from 'react'
import Table from './_components/table'

type Props =
{
    params: 
    {
        userId: string
    }
}


const MyRequestsPage = (props: Props) => {
    return (
        <Table userId={props.params.userId}/>
    )
}

export default MyRequestsPage