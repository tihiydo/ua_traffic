'use client'

import { useRouter } from "@/i18n/navigation";
import type { CatalogBlogger } from "@/types/enities/blogger";

type Props = {
    children: React.ReactNode;
    blogger: CatalogBlogger;
}

const BloggerCardWrapperLink = ({ children, blogger }: Props) => {
    const router = useRouter();
    return (
        <div onClick={() => {
            router.push(`/catalog/${blogger.id}`)
        }}>
            {children}
        </div>
    )
}

export default BloggerCardWrapperLink