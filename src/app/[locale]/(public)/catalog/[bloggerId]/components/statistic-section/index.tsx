import React from 'react'
import InstagramStatistic from './instagram-statistic';
import TelegramStatistic from './telegram-statistic';
import { type CatalogBlogger } from '@/types/enities/blogger';
import Translate from '@/components/Translate';

type Props = {
    blogger: CatalogBlogger;
}

const StatisticSection = ({ blogger }: Props) => {
    return (
        <div>
            <h2 className='font-title text-xl first-letter:bg-yellow mb-2'>
                <Translate namespace='Statistic' itemKey='index' />
            </h2>

            <div className='grid grid-cols-1 lg:grid-cols-2 place-content-center gap-5'>
                {blogger.type === 'Instagram' ? (
                    <InstagramStatistic blogger={blogger} />
                ) : null}

                {blogger.type === 'Telegram' ? (
                    <TelegramStatistic blogger={blogger} />
                ) : null}
            </div>
        </div>
    )
}

export default StatisticSection