import React from 'react'
import StatisticItem from './statistic-item'
import { Eye, ShapesIcon, UsersIcon } from 'lucide-react'
import StatisticPriceItem from './statistic-price-item'
import Translate from '@/components/Translate'
import { type Blogger } from '@/database/blogger'

type Props = {
    blogger: Blogger
}

const StatisticList = ({ blogger }: Props) => {
    return (
        <ul className='flex gap-5 justify-between w-full'>
            <StatisticItem
                icon={<UsersIcon size={30} />}
                value={blogger.followersCount}
                name={<Translate namespace='Catalogue' itemKey='followers' />}
            />

            {blogger.coverage &&
                <StatisticItem
                    icon={<Eye size={30} />}
                    value={blogger.coverage}
                    name={<Translate namespace='Catalogue' itemKey='coverage' />}
                />
            }

            <StatisticItem
                icon={<ShapesIcon size={30} />}
                value={blogger.categories.length
                    ? <div className='max-w-[300px]  flex flex-wrap justify-center gap-1.5'>
                        {blogger.categories.map(category => (
                            <p key={category} >
                                <Translate  namespace='Categories' itemKey={category} />
                            </p>
                        ))}
                    </div>
                    : <Translate namespace='Categories' itemKey="unknown" />}
                name={<Translate namespace='Default' itemKey="categories" />}
            />

            <StatisticPriceItem blogger={blogger} />
        </ul>
    )
}

export default StatisticList