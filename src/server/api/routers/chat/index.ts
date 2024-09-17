import { createTRPCRouter } from "../../trpc";
import { createChatWithAdminProcedure } from './procedures/chat-with-admin';
import { createChatProcedure } from "./procedures/create-chat";
import { getAdvertiserChatsProcedure } from "./procedures/get-advertiser-chats";
import { getBloggerChatsProcedure } from "./procedures/get-blogger-chats";
import { getChatProcedure } from "./procedures/get-chat";


export const chatRouter = createTRPCRouter({
    createChat: createChatProcedure,
    getChat: getChatProcedure,
    getAdvertiserChats: getAdvertiserChatsProcedure,
    getBloggerChats: getBloggerChatsProcedure,
    chatWithAdmin: createChatWithAdminProcedure
})