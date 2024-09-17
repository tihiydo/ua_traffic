import { type ChatMemberRole } from ".";

export type MessageType = {
    id: string;
    chatId: string;
    content: string;
    sender: {
        id: string;
        name?: string;
        role: ChatMemberRole;
        avatar?: string;
    };
    viewedBy: string[];
    createdAt: number;
    updatedAt: number;
};

export type SendMessageData = Omit<MessageType, 'id' | 'viewedBy' | 'createdAt' | 'updatedAt'>;
