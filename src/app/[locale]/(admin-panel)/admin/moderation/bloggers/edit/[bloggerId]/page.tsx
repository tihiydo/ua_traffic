import { api } from "@/trpc/server";
import GoBackLink from "@/components/go-back-link";
import AccountCard from "@/components/account-card";
import EditBloggerForm from "./components/blogger-edit/edit-blogger-form";
import ForceBloggerEditForm from "./components/force-blogger-edit";

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
            <GoBackLink fallbackLink='/admin/moderation/bloggers' />

            <div className="max-w-[600px]">
                <AccountCard blogger={blogger} className="my-5" />

                {blogger.fake ? (
                    <ForceBloggerEditForm blogger={blogger} />
                ) : (
                    <EditBloggerForm blogger={blogger} />
                )}
            </div>
        </div>
    )
}

export default PublicBloggerPage