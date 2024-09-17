import { api } from '@/trpc/server'
import UserForm from './_components/user-form'
import { getTranslations } from "next-intl/server";
import { type Metadata } from "next";
import Translate from '@/components/Translate';

export async function generateMetadata(): Promise<Metadata> {
    const porfileT = await getTranslations('Profile');

    return {
        title: "UATRAFFIC | " + porfileT('meta/title'),
        description: porfileT('meta/description'),
        openGraph: {
            title: "UATRAFFIC | " + porfileT('meta/title'),
            description: porfileT('meta/description'),
        },
    }
}

const ProfilePage = async () => {
    const user = await api.user.getMyUser.query();

    return (
        <div className='mt-6 h-full'>
            <h1 className="text-2xl font-bold mb-4">
                <Translate namespace="Profile" itemKey="namespace" />
            </h1>
            <div className='max-w-[450px] w-full'>
                <UserForm defaultValues={{
                    name: user?.name ?? '',
                    tel: user?.tel ?? '',
                    telegram: user?.telegram ?? '',
                    email: user?.email ?? ''
                }} />
            </div>
        </div>
    )
}

export default ProfilePage

