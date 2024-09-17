import React from 'react'
import StatisticItem from './statistic-item';
import { DollarSignIcon } from 'lucide-react';
import Translate from '@/components/Translate';
import { type Blogger } from '@/database/blogger';

type Props = {
    blogger: Blogger
}

const StatisticPriceItem = ({ blogger }: Props) => {

    return (
        <StatisticItem
            icon={<DollarSignIcon size={30} />}
            value={<Translate namespace='Catalogue' itemKey="formatandprice" />}
            name={<div>
                {Object.entries(blogger.prices)
                    .map(([key, value]) => (
                        value ?
                            <p key={key}><Translate itemKey={key} namespace="Post-Types" /> - {value.amount}</p>
                            : null

                    ))}
            </div>}
        />
    )
}

export default StatisticPriceItem