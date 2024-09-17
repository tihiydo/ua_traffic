import { redirect } from '@/i18n/navigation'
import React from 'react'

type Props = {}

const AdminHomePage = async (props: Props) => 
{
    redirect('/moder/moderation/bloggers')
}

export default AdminHomePage