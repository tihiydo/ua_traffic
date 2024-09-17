import { redirect } from '@/i18n/navigation'
import { api } from '@/trpc/server'
import React from 'react'

type Props = 
{
    params: 
    {
        userId: string;
    };
};
const BloggerPage = async (props: Props) => 
{
    redirect(`/admin/users/${props.params.userId}/blogger/my-requests`)
}

export default BloggerPage