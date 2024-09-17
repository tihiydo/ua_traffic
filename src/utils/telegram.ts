import nodeFetch from 'node-fetch'
const cheerio = require('cheerio');

type Props =
    {
        channelUsername: string
    }

export const coverage = async (props: Props) => {
    const request = await nodeFetch(`https://t.me/s/${props.channelUsername}`);
    const response = await request.text()
    const $ = cheerio.load(response);

    const divCount = $('body > main > div > section > div').length;
    let totalViews = 0;
    let totalPosts = 0;

    $('body > main > div > section > div').each((i: number, el: any) => {
        if (i < divCount - (divCount >= 10 ? 4 : 0)) {
            const $el = $(el);
            const views = $el.find('> div.tgme_widget_message.text_not_supported_wrap.js-widget_message > div.tgme_widget_message_bubble > div.tgme_widget_message_footer.compact.js-message_footer > div > span.tgme_widget_message_views').text();
            if (views) {
                const viewsNum = parseFloat(views.replace(/[a-zA-Z]/g, ''));
                if (views.includes('K')) {
                    totalViews += viewsNum * 1000;
                } else if (views.includes('M')) {
                    totalViews += viewsNum * 1000000;
                } else {
                    totalViews += viewsNum;
                }
                totalPosts += 1
            }
        }
    });
    const coverage = Math.round(totalViews / totalPosts);
    return coverage;
}