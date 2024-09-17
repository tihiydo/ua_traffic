import { db } from "@/server/db"

type Props =
    {
        bot: any,
        userId: string,
        hash?: string
    }

export const start = async (props: Props) => {
    if (props.hash) {
        const checkIfExistsInDb = await db.telegramVerificationNotifyRequest.findUnique({ where: { startKey: props.hash } });
        if (checkIfExistsInDb) {
            await db.user.update({ where: { id: checkIfExistsInDb.userId }, data: { telegram: String(props.userId) } })
            await props.bot.telegram.sendMessage(props.userId, "Ваш аккаунт верифікованний, перезавантажте сторінку профілю");
        } else {
            await props.bot.telegram.sendMessage(props.userId, `Ваш ключ ${props.hash} не існує`)
        }
    } else {
        await props.bot.telegram.sendMessage(props.userId, "Вітаємо у боті верифікації Telegram аккаунтів");
    }
}