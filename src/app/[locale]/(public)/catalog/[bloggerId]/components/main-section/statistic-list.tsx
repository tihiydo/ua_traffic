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
        <ul className='flex md:flex-row flex-col items-center md:items-stretch gap-5 justify-between w-full max-w-[600px] lg:max-w-none'>
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
                    ? <div className='flex flex-wrap justify-center max-w-[300px] gap-1.5'>
                        {blogger.categories.map(category => (
                            <p key={category} >
                                <Translate namespace='Categories' itemKey={category} />
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