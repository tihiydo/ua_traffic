import { createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { instagramRouter } from "./routers/instagram";
import { telegramRouter } from "./routers/telegram";
import { bloggerRouter } from "./routers/blogger";
import { adminRouter } from "./routers/admin";
import { advertismentRouter } from "./routers/advertisment";
import { depositTransactionRouter } from "./routers/depositTransaction";
import { requisitesRouter } from "./routers/requisites";
import { withdrawTransactionsRouter } from "./routers/withdraw-transactions";
import { chatRouter } from "./routers/chat";
import { notificationsRouter } from "./routers/notifications";
import { feesRouter } from "./routers/fees";
import { opengraphRouter } from "./routers/opengraph";
import { statRouter } from "./routers/stat";
import { guideRouter } from "./routers/guide";
import { advertiserRouter } from "./routers/advertiser";
import { blogRouter } from './routers/blog';


export const appRouter = createTRPCRouter({
    user: userRouter,
    blogger: bloggerRouter,
    advertisment: advertismentRouter,
    instagram: instagramRouter,
    telegram: telegramRouter,
    admin: adminRouter,
    depositTransaction: depositTransactionRouter,
    withdrawTransaction: withdrawTransactionsRouter,
    requisites: requisitesRouter,
    chat: chatRouter,
    notification: notificationsRouter,
    fee: feesRouter,
    opengraph: opengraphRouter,
    statRouter: statRouter,
    guide: guideRouter,
    advertiser: advertiserRouter,
    blog: blogRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
