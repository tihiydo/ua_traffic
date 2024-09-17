const { Telegraf } = require('telegraf')

type Props = 
{
    userId: number,
    json: any
}

export const log = async (props : Props) => {
    const bot = new Telegraf("6613102087:AAFtnURzaNvfoniDm88xo5roGr-ZzdkiFtI")
    await bot.telegram.sendMessage(props.userId, `<code>${JSON.stringify(props.json, null, 4)}</code>`, { parse_mode: 'HTML' });
}