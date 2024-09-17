import { db } from '@/server/db'
import { log } from '../../telegramnotifybot/_utils/log'
import { coverage } from '../_coverage/coverage'

export const verificate = async (bot: any, data : any) => 
{
    const admins = await bot.telegram.getChatAdministrators(data.my_chat_member.chat.id)
    const whoAdded = data?.my_chat_member?.from?.id
    const filteredOwner = admins.find((item : any) => item.status == "creator")

    if(filteredOwner?.user?.id && data?.my_chat_member?.chat?.id && whoAdded)
    {
        if(admins.find((item : any) => item.user.id == whoAdded).user.id == filteredOwner.user.id)
        {
            const verificationRequest = await db.telegramVerificationRequests.findFirst
            ({
                where:
                {
                    userTelegramId: String(filteredOwner.user.id),
                    verifiedChannelId: null
                }
            });
            
            const checkIfBloggerExists = await db.blogger.findFirst
            ({
                where: 
                {
                    id: String(data.my_chat_member.chat.id)
                }
            });

            const channelInfo = await bot.telegram.getChat(data.my_chat_member.chat.id)
            const channelTitle = channelInfo.title;

            if(checkIfBloggerExists)
            {
                await db.telegramVerificationRequests.delete(
                    {
                        where:
                        {
                            userTelegramId: String(filteredOwner.user.id),
                            verifiedChannelId: null
                        }
                    }
                )
                await bot.telegram.sendMessage(filteredOwner.user.id, `Канал ${channelTitle} вже існує на біржі`)
            }

            else if (verificationRequest) 
            {
                const channelMembers = Number(await bot.telegram.getChatMembersCount(data.my_chat_member.chat.id))
                const photoId = channelInfo?.photo?.big_file_id || null
                const isPublic = (channelInfo?.username ? "public" : "private")
                const username = channelInfo?.username || null
                const coverageCount = (isPublic == "public" ? await coverage({channelUsername: username}) : null)

                const verified = await db.telegramVerificationRequests.update
                ({
                    where:
                    {
                        userTelegramId: String(filteredOwner.user.id)
                    },
                    data:
                    {
                        verifiedChannelId: String(data.my_chat_member.chat.id),
                        title: channelTitle,
                        profilePhotoTelegramId: photoId,
                        channelMembers: channelMembers,
                        channelType: isPublic,
                        username,
                        coverageCount
                    }
                })
                if(verified) 
                {
                    await bot.telegram.sendMessage(filteredOwner.user.id, `Вітаємо, ви підтвердили право власності на канал ${channelTitle}\nПоверніться на сайт та оновіть сторінку додавання телеграм каналу`)
                }
                else
                {
                    await bot.telegram.sendMessage(filteredOwner.user.id, "Спочтку створіть заявку на верифікацію на сайті")
                }
            }
            else
            {
                await bot.telegram.sendMessage(filteredOwner.user.id, `Або ви не створили заявку на верифікацію, або ви пробуєте верифікувати два канала одночасно, що не можна`)
            }
        }
        else
        {
            await bot.telegram.sendMessage(whoAdded, "Ви не є створювачем каналу, тому ви не можете верифікувати цей канал")
        }
    }
}