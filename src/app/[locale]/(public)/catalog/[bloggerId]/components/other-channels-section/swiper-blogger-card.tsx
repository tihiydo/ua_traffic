"use client"

import { Card, CardContent } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { DollarSignIcon, ShapesIcon, UsersIcon } from "lucide-react";
import Translate from "@/components/Translate";
import { type BloggerPrices } from "@/socials/shared/types";
import BloggerAvatar from "@/components/ui/custom/blogger-avatar";
import SwiperBloggerCardWrapperLink from "./swiper-blogger-card-wrapper-link";
import { Link } from "@/i18n/navigation";
import { Separator } from "@/components/ui/separator";
import SwiperCardItem from "./swiper-card-item";
import SwiperBloggerCardButtons from "./swiper-blogger-card-buttons";
import SwiperBloggerCardTags from "./swiper-blogger-card-tags";
import { type CatalogBlogger } from "@/types/enities/blogger";
import { getDiscountedPrice } from '@/utils/discount';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type Props = {
    blogger: CatalogBlogger
}

const SwiperBloggerCard = ({ blogger }: Props) => {

    const [selectedPrice, setSelectedPrice] = useState<string | null>(null)

    useEffect(() => {
        const firstPriceKey = Object.entries(blogger.prices)
            .filter(([_, value]) => value)
            .map(([key, _]) => key)[0]
        if (firstPriceKey) {
            setSelectedPrice(firstPriceKey)
        }
    }, [blogger.prices])

    // Check for blogger status
    if (blogger.status === 'Inactive') {
        return null;
    }

    return (
        <SwiperBloggerCardWrapperLink blogger={blogger}>
            <Card className="px-4 py-6  pt-3 shadow-md h-full cursor-pointer relative  w-full max-w-[350px]">
                <CardContent className="p-0 flex flex-col w-full h-full ">
                    <div className="flex items-center w-full flex-col gap-3 mb-2">
                        <BloggerAvatar src={blogger.profilePicture} className="w-20 h-20" />

                        <h4 className="font-bold hover:underline">
                            <Link target="_blank" href={blogger.profileLink || ""}>{blogger.username}</Link>
                        </h4>
                    </div>

                    <Separator className="my-1" />

                    {blogger.tags.length ? (
                        <>
                            <SwiperBloggerCardTags tags={blogger.tags} />

                            <Separator className="my-1" />
                        </>
                    ) : null}


                    <ul className="flex flex-col gap-2 mb-8 flex-1 mt-3">
                        <li>
                            <SwiperCardItem
                                icon={<UsersIcon size={25} />}
                                content={<div className="flex gap-1.5">
                                    <h5 className="font-bold whitespace-nowrap">
                                        <Translate namespace='Catalogue' itemKey="followerssecond" />
                                    </h5>
                                    <p>
                                        {blogger.followersCount}
                                    </p>
                                </div>}
                            />
                        </li>

                        {
                            blogger.coverage &&
                            <li>
                                <SwiperCardItem
                                    icon={<UsersIcon size={25} />}
                                    content={<div className="flex gap-1.5">
                                        <h5 className="font-bold whitespace-nowrap">
                                            <Translate namespace='Catalogue' itemKey="coverage" />:
                                        </h5>
                                        <p>
                                            {blogger.coverage}
                                        </p>
                                    </div>}
                                />
                            </li>
                        }

                        <li className="flex-1">
                            <SwiperCardItem
                                icon={<ShapesIcon size={25} />}
                                content={<div className="">
                                    <h5 className="w-full whitespace-nowrap font-bold">
                                        <Translate namespace="Default" itemKey="categories" />
                                    </h5>
                                    <div>
                                        {blogger.categories.length ? <div className="inline-flex flex-wrap gap-1">
                                            {blogger.categories.map(category => (
                                                <p key={category} className="">
                                                    <Translate namespace='Categories' itemKey={category} />
                                                </p>
                                            ))}
                                        </div> : <Translate namespace='Catalogue' itemKey="followerssecond" />}
                                    </div>
                                </div>}
                            />
                        </li>

                        <li>
                            <div className="flex gap-2 items-center mb-2">
                                <DollarSignIcon className="text-yellow" size={25} />
                                <h5 className="w-full whitespace-nowrap font-bold">
                                    <Translate namespace='Catalogue' itemKey="formatandprice" />:
                                </h5>
                            </div>
                            <Select value={selectedPrice || undefined} onValueChange={setSelectedPrice}>
                                <SelectTrigger className="w-full h-auto py-2">
                                    <SelectValue placeholder="" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(blogger.prices)
                                        .filter(([_, value]) => value)
                                        .map(([key, value]) => (
                                            <SelectItem key={key} value={key} className="py-1.5">
                                                <div className="flex justify-between items-center w-full">
                                                    <span className="font-medium mr-2 flex-shrink">
                                                        <Translate itemKey={key} namespace="Post-Types" />
                                                    </span>
                                                    <div className={`flex items-center flex-shrink-0 ${value.discount ? 'ml-auto' : 'ml-auto'}`}>
                                                        {value.discount ? (
                                                            <>
                                                                <span className="text-sm text-slate-500 line-through mr-2">
                                                                    {value.amount} ₴
                                                                </span>
                                                                <span className="font-bold text-green-600">
                                                                    {getDiscountedPrice(value)} ₴
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="font-bold">
                                                                {value.amount} ₴
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </li>
                    </ul>

                    <SwiperBloggerCardButtons blogger={blogger} selectedPrice={selectedPrice} />
                </CardContent>
            </Card>
        </SwiperBloggerCardWrapperLink>
    );
};

export default SwiperBloggerCard;
