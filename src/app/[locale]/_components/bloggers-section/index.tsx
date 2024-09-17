import Translate from '@/components/Translate'
import React from 'react'
import BloggersList from './bloggers-list'
import SocialIcon from '@/components/ui/social-icon'
import { Link } from '@/i18n/navigation'
import { ChevronRightIcon } from 'lucide-react'
import { CustomTabs, CustomTabsContent, CustomTabsList, CustomTabsTrigger } from '@/components/ui/custom/custom-tabs'


const BloggersSection = () => {
    return (

        <div className="mb-32">
            <div className='flex flex-col gap-3 justify-start sm:flex-row sm:items-center sm:gap-10 mb-6'>
                <h2 className="uppercase text-2xl font-title first-letter:bg-yellow"><Translate namespace="Landing" itemKey="сhannelcatalogue" /></h2>
                <Link href={'/catalog'} className='group font-medium flex items-center transition-colors text-main/80 hover:text-main hover:underline'>
                    <Translate namespace="Landing" itemKey="go-to" />
                    <ChevronRightIcon size={22} className='duration-150 transition-all  ml-3 group-hover:ml-4' />
                </Link>
            </div>
            <div>
                <div className="mt-8">
                    <CustomTabs defaultValue="instagram">
                        <CustomTabsList className={"mb-3 gap-3"}>
                            <CustomTabsTrigger value="instagram">
                                <SocialIcon social='Instagram' className='w-6' />
                                <p className="font-title uppercase">Instagram</p>

                            </CustomTabsTrigger>
                            <CustomTabsTrigger value="telegram" >
                                <SocialIcon social='Telegram' className='w-6' />
                                <p className="font-title uppercase">Telegram</p>
                            </CustomTabsTrigger>
                        </CustomTabsList>

                        <CustomTabsContent value={"instagram"}>
                            <BloggersList tab="Instagram" />
                        </CustomTabsContent>

                        <CustomTabsContent value={"telegram"}>
                            <BloggersList tab="Telegram" />
                        </CustomTabsContent>
                    </CustomTabs>
                </div>
            </div>
        </div>
    )
}

export default BloggersSection