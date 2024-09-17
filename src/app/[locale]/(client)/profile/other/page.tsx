import { api } from '@/trpc/server';
import TwoFASection from './components/2fa-section';
import TelegramSection from './components/telegram-section';
import { getTranslations } from "next-intl/server";
import { type Metadata } from "next";
import Translate from '@/components/Translate';

export async function generateMetadata(): Promise<Metadata> {
    const profileOtherT = await getTranslations('Profile.Other');

    return {
        title: "UATRAFFIC | " + profileOtherT('meta/title'),
        description: profileOtherT('meta/description'),
        openGraph: {
            title: "UATRAFFIC | " + profileOtherT('meta/title'),
            description: profileOtherT('meta/description'),
        },
    }
}

const ProfileOtherPage = async () => {
    const myUser = await api.user.getMyUser.query();

    if (!myUser) return;

    return (
        <div className='max-w-[500px]'>
            <h1 className="text-2xl font-bold mb-4">
                <Translate namespace="Other" itemKey="other" />
            </h1>
            <section>
                <TwoFASection user={myUser} />
            </section>

            <div className='my-6 bg-yellow w-full h-1'>

            </div>

            <section>
                <TelegramSection />
            </section>
        </div>
    );
};

export default ProfileOtherPage;
