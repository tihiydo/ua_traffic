import { type RealtimeChat } from "../types";

export const getChatMembers = (chat: RealtimeChat['chat']) => ({
    blogger: chat.AdvertismentRequest?.Blogger,
    advertiser: chat.AdvertismentRequest?.AdvertismentPost.Creator,
})

export const getChatUsernames = (chat: RealtimeChat['chat']) => ({
    blogger: `@${chat.AdvertismentRequest?.Blogger.username}`,
    advertiser: chat.AdvertismentRequest?.AdvertismentPost.Creator.email,
})

export const isChatOver = (chat: RealtimeChat['chat']) => {
    const advRequestStatus = chat.AdvertismentRequest?.status;
    
    return advRequestStatus !== 'Accepted' && advRequestStatus !== 'Moderating'
}