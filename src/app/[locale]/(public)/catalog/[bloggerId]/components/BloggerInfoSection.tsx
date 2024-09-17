import React from 'react';
import Translate from "@/components/Translate";
import type { InstagramAdPostType, TelegramAdPostType } from '@/database/ad-post/post/post-types';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarIcon, PercentIcon, TrendingUpIcon } from 'lucide-react';
import SwiperCardItem from './other-channels-section/swiper-card-item';
import { type PostPriceSchema } from '@/database/blogger/prices';
import { type z } from 'zod';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { InfoIcon } from "lucide-react";
import InfoTooltip from './InfoToolTip';

type PricesType = Partial<Record<InstagramAdPostType | TelegramAdPostType, z.infer<typeof PostPriceSchema>>>;

type BloggerInfoSectionProps = {
    prices: PricesType;
    womenPercentage?: number | null;
    menPercentage?: number | null;
    ageCategory?: string | null;
    cpm?: number | null;
    cpv?: number | null;
    channelAge?: number | null;
    averageAcceptanceTime?: number | null;
    tooltips: {
        ageCategory?: string;
        channelAge?: string;
        cpmCpv?: string;
    };
};

const BloggerInfoSection: React.FC<BloggerInfoSectionProps> = ({
    prices,
    womenPercentage,
    menPercentage,
    ageCategory,
    cpm,
    cpv,
    channelAge,
    averageAcceptanceTime,
    tooltips
}) => {

    const hasAdditionalInfo = womenPercentage || menPercentage || ageCategory || cpm || cpv || channelAge;

    if(!hasAdditionalInfo) {
        return null;
    }

    
    const checkYears = (channelAge: number) => {
        if (channelAge <= 1) {
            return `${channelAge} ${Translate({ namespace: 'Blogger', itemKey: 'year' })}`;
        } else {
            return `${channelAge} ${Translate({ namespace: 'Blogger', itemKey: 'years' })}`;
        }
    }
    return (
        <div>
            <h2 className='font-title text-xl first-letter:bg-yellow mb-2'>
                <Translate namespace='Blogger' itemKey='additionalInfo' />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-7">
                {(womenPercentage || menPercentage) && (
                    <Card className="relative">
                        <CardContent className="p-4">
                            <SwiperCardItem
                                icon={<PercentIcon size={30} />}
                                content={
                                    <div className="flex flex-col">
                                        <h3 className='font-bold'><Translate namespace='Blogger' itemKey="Auditory" /></h3>
                                        {womenPercentage && (
                                            
                                            <div className="flex gap-1.5">
                                                <h5 className=" whitespace-nowrap">
                                                    <Translate namespace='Blogger' itemKey="womenPercentage" />
                                                </h5>
                                                <p>{womenPercentage}%</p>
                                            </div>
                                        )}
                                        {menPercentage && (
                                            <div className="flex gap-1.5">
                                                <h5 className=" whitespace-nowrap">
                                                    <Translate namespace='Blogger' itemKey="menPercentage" />
                                                </h5>
                                                <p>{menPercentage}%</p>
                                            </div>
                                        )}
                                    </div>
                                }
                            />
                        </CardContent>
                    </Card>
                )}

                {ageCategory && (
                    <Card className="relative">
                        {tooltips.ageCategory && <InfoTooltip message={tooltips.ageCategory} />}
                        <CardContent className="p-4">
                            <SwiperCardItem
                                icon={<CalendarIcon size={30} />}
                                content={
                                    <div className="flex gap-1.5 flex-col">
                                        <h5 className="font-bold whitespace-nowrap">
                                            <Translate namespace='Blogger' itemKey="ageCategory" />
                                        </h5>
                                        <p>{ageCategory}</p>
                                    </div>
                                }
                            />
                        </CardContent>
                    </Card>
                )}

                {channelAge && (
                    <Card className="relative">
                        {tooltips.channelAge && <InfoTooltip message={tooltips.channelAge} />}
                        <CardContent className="p-4">
                            <SwiperCardItem
                                icon={<CalendarIcon size={30} />}
                                content={
                                    <div className="flex gap-1.5 flex-col">
                                        <h5 className="font-bold whitespace-nowrap">
                                            <Translate namespace='Blogger' itemKey="channelAge" />
                                        </h5>
                                        <p>{checkYears(channelAge)}</p>
                                    </div>
                                }
                            />
                        </CardContent>
                    </Card>
                )}

                {(cpm || cpv) && (
                    <Card className="relative">
                        {tooltips.cpmCpv && <InfoTooltip message={tooltips.cpmCpv} />}
                        <CardContent className="p-4">
                            <SwiperCardItem
                                icon={<TrendingUpIcon size={30} />}
                                content={
                                    <div className="flex flex-col">
                                        {cpm && (
                                            <div className="flex gap-1.5">
                                                <h5 className="font-bold whitespace-nowrap">
                                                    <Translate namespace='Blogger' itemKey="cpm" />:
                                                </h5>
                                                <p>{cpm}</p>
                                            </div>
                                        )}
                                        {cpv && (
                                            <div className="flex gap-1.5">
                                                <h5 className="font-bold whitespace-nowrap">
                                                    <Translate namespace='Blogger' itemKey="cpv" />:
                                                </h5>
                                                <p>{cpv}</p>
                                            </div>
                                        )}
                                    </div>
                                }
                            />
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default BloggerInfoSection;