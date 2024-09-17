import React from 'react'
import Table from './_components/table'
import InfoMessage from '@/components/ui/custom/info-message'
import { api } from '@/trpc/server';

type Props =
{
    params: 
    {
        userId: string
    }
}

const MyRequestsPage = async (props: Props) => 
{
    return (
        <>
            <Table userId={props.params.userId}/>
        </>

    )
}

export default MyRequestsPage