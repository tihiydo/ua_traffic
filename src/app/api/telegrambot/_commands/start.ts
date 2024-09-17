import { db } from "@/server/db"

type Props =
    {
        bot: any,
        userId: string,
        hash?: string
    }

export const start = async (props: Props) => {
    if (props.hash) {
        const checkIfExistsInDb = await db.telegramVerificationRequests.findUnique({ where: { cryptedStartKey: props.hash } });
        if (checkIfExistsInDb) {
            await db.telegramVerificationRequests.update({ where: { cryptedStartKey: props.hash }, data: { userTelegramId: String(props.userId) } })
            await props.bot.telegram.sendMessage(props.userId, "Тепер додайте вашого телеграм бота до каналу");
        } else {
            await props.bot.telegram.sendMessage(props.userId, `Ваш ключ ${props.hash} не існує`)
        }
    } else {
        await props.bot.telegram.sendMessage(props.userId, "Вітаємо у боті верифікації Telegram каналів");
    }
}