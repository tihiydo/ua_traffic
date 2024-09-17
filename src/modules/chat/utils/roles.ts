import { getSession } from "next-auth/react";
import type { Chat, ChatMember } from "../types";


export async function getMyRole(chat: Chat): Promise<ChatMember> {
    const session = await getSession();

    if (!session?.user.id) {
        return {
            id: '',
            role: 'unauthorized',
            name: '',
        }
    }

    if (session.user.id === 'ADMIN') {
        return {
            id: session.user.id,
            role: 'admin',
            name: 'admin'
        }
    }

    if (session.user.id === chat.AdvertismentRequest?.AdvertismentPost.creatorId) {
        return {
            id: session.user.id,
            role: 'advertiser',
            name:  chat.AdvertismentRequest?.AdvertismentPost.Creator.email ?? '',
        }
    }

    if (session.user.id === chat.AdvertismentRequest?.Blogger.User.id) {
        return {
            id: session.user.id,
            role: 'blogger',
            name: `@${chat.AdvertismentRequest?.Blogger.username}`
        }
    }

    return {
        id: '',
        role: 'unauthorized',
        name: 'admin'
    }
}
