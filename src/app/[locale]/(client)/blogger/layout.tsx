import React from "react";
import BloggerNavBar from "./_components/blogger-nav-bar";
import BloggerSidebar from "./_components/blogger-sidebar";
import { getTranslations } from "next-intl/server";
import { type Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const bloggerT = await getTranslations('Blogger');

    return {
        title: "UATRAFFIC | " + bloggerT('meta/title'),
        description: bloggerT('meta/description'),
        openGraph: {
            title: "UATRAFFIC | " + bloggerT('meta/title'),
            description: bloggerT('meta/description'),
        },
    };
}

type Props = {
    children: React.ReactNode;
};

const BloggerLayout = ({ children }: Props) => {
    return (
        <div className="flex h-screen">
            <div className="hidden lg:block">
                <BloggerSidebar />
            </div>
            <div className="flex-1 overflow-x-hidden flex flex-col">
                <div className="flex-1 p-4 lg:mb-[54px] lg:ml-[25px] lg:mr-[25px] max-w-full">
                    <div className="mb-4">
                    </div>
                    <div className="lg:hidden mb-4">
                        <BloggerNavBar />
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default BloggerLayout;