import { api } from "@/trpc/server";
import BloggerDescription from "./_components/blogger-description";
import BloggerInfo from "./_components/blogger-info";
import GoBackLink from "@/components/go-back-link";

type Props = {
    params: {
        bloggerId: string;
    };
};

const PublicBloggerPage = async ({ params }: Props) => {
    const blogger = await api.blogger.getBlogger.query({
        bloggerId: params.bloggerId,
    });

    return (
        <div>
             <GoBackLink fallbackLink='/admin/moderation/bloggers/' />

            <div className="my-5">

                <BloggerInfo blogger={blogger} />
            </div>

            <BloggerDescription about={blogger.about} />
        </div>
    )
}

export default PublicBloggerPage