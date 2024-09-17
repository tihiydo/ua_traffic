
import { redirect } from '@/i18n/navigation'
import { api } from '@/trpc/server'

type Props =
{
    params: 
    {
        userId: string
    }
}

async function UserPreviewMain(props: Props) 
{
    const user = await api.user.getMyUser.query({userId: props.params.userId})
    if(user !== undefined)
    {
        redirect(`/admin/users/${props.params.userId}/blogger/my-requests`)
    }
    else
    {
        redirect(`/admin/users`)
    }
}

export default UserPreviewMain