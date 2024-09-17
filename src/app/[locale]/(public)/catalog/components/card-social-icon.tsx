"use client"
import SocialIcon from '@/components/ui/social-icon';
import { type SocialType } from '@prisma/client'
import { useSearchParams } from 'next/navigation'
import React from 'react'

type Props = {
    social: SocialType;
}

const CardSocialIcon = ({ social }: Props) => {
    const searchParams = useSearchParams();
    const isSavedTab = searchParams.get('tab') === 'Saved';

    if (!isSavedTab) return;

    return (
        <SocialIcon social={social} className='size-12 absolute top-4 right-4' />
    )
}

export default CardSocialIcon