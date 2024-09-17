'use client'

import React from 'react'
import { api } from "@/trpc/react";
import { toast } from "react-toastify";
import { useRouter } from '@/i18n/navigation'
import InstagramBloggerForm from '../../_socials/instagram/components/instagram-blogger-form';
import { useTranslations } from 'next-intl';


const InstagramTab = () => {
    const { push } = useRouter();
    const bloggerT = useTranslations('Blogger')
   
    const { mutate: createBlogger, isLoading: isCreatingBlogger } = api.blogger.createBlogger.useMutation({
        onSuccess: () => {
            toast.success(bloggerT('channel-created'))
            push('/admin/moderation/bloggers')

        },
        onError: (error) => {
            toast.error(error.message);
        },
        // onSettled: () => {

        // }
    });

    return (
        <div className="max-w-[40rem] w-full">
            <InstagramBloggerForm
                isLoading={isCreatingBlogger}
                onSubmit={(formData) => {
                    createBlogger({
                        type: 'Instagram',
                        fake: true,
                        profileLink: `https://www.instagram.com/${formData.username}`,
                        ...formData
                    });
                }}
            />
        </div >
    )
}

export default InstagramTab