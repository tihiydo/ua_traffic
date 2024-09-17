import Translate from '@/components/Translate'
import { api } from '@/trpc/server'
import React from 'react'
import ChangeEmail from './_components/change-email'
import PasswordReset from './_components/password-reset'
import { getTranslations } from "next-intl/server";
import { type Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const porfileSettingsT = await getTranslations('Profile.Settings');

    return {
        title: "UATRAFFIC | " + porfileSettingsT('meta/title'),
        description: porfileSettingsT('meta/description'),
        openGraph: {
            title: "UATRAFFIC | " + porfileSettingsT('meta/title'),
            description: porfileSettingsT('meta/description'),
        },
    }
}

const ProfileSettings = async () => {
    const user = await api.user.getMyUser.query();

    if (!user?.isNative) {
        return <div>
            <Translate namespace='Profile' itemKey='unabled-email-password-change' />
        </div>
    }



    return (
        <div className='mt-6 h-full'>
            <h1 className="text-2xl font-bold mb-4">
                <Translate namespace="Profile" itemKey="settings" />
            </h1>
            <div className='max-w-[500px] w-full'>
                <div>
                    <h3 className='font-bold text-lg'><Translate namespace="Profile" itemKey="changeemail" /></h3>

                    <ChangeEmail user={user} />
                    <hr className='text-yellow border-[2px] mt-[2rem]'></hr>
                </div>

                <div>
                    <h3 className='font-bold mt-6 text-lg'><Translate namespace="Profile" itemKey="changepassword" /></h3>

                    <PasswordReset user={user} />
                </div>
            </div>
        </div>
    )
}

export default ProfileSettings