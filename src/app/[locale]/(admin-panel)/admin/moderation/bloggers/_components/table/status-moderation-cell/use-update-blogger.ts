import { api } from "@/trpc/react";
import { type Blogger } from "@/database/blogger";
import { useCallback } from "react";

export function useUpdateBlogger() {
    const utils = api.useUtils();

    return useCallback((updatedBlogger: Blogger) => {
        utils.admin.blogger.getModerationBloggers.setData(undefined, (prevData) => {
            return prevData?.map(blogger => {
                if (blogger.id === updatedBlogger.id) {
                    return {
                        ...blogger,
                        ...updatedBlogger,
                    }
                }

                return blogger
            })
        })
    }, []);
}