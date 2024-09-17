import Table from "./_components/table"

type Props =
{
    params: 
    {
        userId: string
    }
}


const MyPostsPage = async (props: Props) => {
    return (
        <Table userId={props.params.userId}/>
    )
}

export default MyPostsPage