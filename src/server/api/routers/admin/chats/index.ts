import { createTRPCRouter } from "@/server/api/trpc";
import { getChatsListProcedure } from "./procedures/get-chats-list";
import { getWarningMessagesProcedure } from './procedures/get-warning-chats';
import { addWarningMessage } from './procedures/add-warning-message';
import { getChatsWithAdmin } from './procedures/get-chats-with-admin';

export const chatsRouter = createTRPCRouter({
    getChatsList: getChatsListProcedure,
    getWarningChats: getWarningMessagesProcedure,
    addWarningMessage: addWarningMessage,
    chatsWithAdmin: getChatsWithAdmin

})