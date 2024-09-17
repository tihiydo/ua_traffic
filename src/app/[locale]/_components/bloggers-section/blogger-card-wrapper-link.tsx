'use client'

import { type Blogger } from "@/database/blogger";
import { useRouter } from "@/i18n/navigation";

type Props = {
    children: React.ReactNode;
    blogger: Blogger;
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