import { type Blogger } from "@/database/blogger"

export type CatalogBlogger = Blogger & { 
    isSaved: boolean
}