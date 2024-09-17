import { createTRPCRouter } from "../../trpc";
import { adminAdvertiserRouter } from "./advertiser";
import { advertismentRouter } from "./advertisment";
import { adminBloggerRouter } from "./blogger";
import { chatsRouter } from "./chats";
import { igCookieRouter } from "./ig-cookies";
import { reviewsRouter } from './reviews';
import { usersRouter } from "./users";
import { withdrawTransactionsRouter } from "./withdraw-transactions";

export const adminRouter = createTRPCRouter({
    advertiser: adminAdvertiserRouter,
    blogger: adminBloggerRouter,
    advertisment: advertismentRouter,
    withdrawTransaction: withdrawTransactionsRouter,
    chatRouter: chatsRouter,
    users: usersRouter,
    igCookie: igCookieRouter,
    reviews: reviewsRouter
})