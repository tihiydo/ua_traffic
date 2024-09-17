
import { api } from '@/trpc/server'
import Table from './_components/table'

type Props =
{
    params: 
    {
        userId: string
    }
}

async function MyChannelsPage(props: Props) 
{
    return (
        <>
            <Table userId={props.params.userId}/>
        </>

    )
}

export default MyChannelsPage