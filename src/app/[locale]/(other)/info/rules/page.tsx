import Translate from '@/components/Translate'
import { getTranslations } from "next-intl/server";
import { type Metadata } from "next";


export async function generateMetadata(): Promise<Metadata> {
    const infoRulesT = await getTranslations('Info.Rules');

    return {
        title: "UATRAFFIC | " + infoRulesT('meta/title'),
        description: infoRulesT('meta/description'),
        openGraph: {
            title: "UATRAFFIC | " + infoRulesT('meta/title'),
            description: infoRulesT('meta/description'),
        },
    }
}

const RulesInfoPage = () => {
    return (
        <div className='container pt-5 pb-10'>
            <div className='mb-5'>
                <h1 className='text-lg font-title'>
                    <Translate namespace='Info.Rules' itemKey='title' />
                </h1>
                <p className='text-sm text-main/50'>
                    <Translate namespace='Info.Rules' itemKey='description' />
                </p>
            </div>

            <div>
                <Translate namespace='Info.Rules' itemKey='content' />
            </div>
        </div>
    )
}

export default RulesInfoPage