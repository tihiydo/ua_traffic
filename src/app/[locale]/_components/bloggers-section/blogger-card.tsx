"use client"

import { Card, CardContent } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { DollarSignIcon, ShapesIcon, StarIcon, UsersIcon } from "lucide-react";
import Translate from "@/components/Translate";
import { type BloggerPrices } from "@/socials/shared/types";
import BloggerAvatar from "@/components/ui/custom/blogger-avatar";
import { type Blogger } from "@/database/blogger";
import BloggerCardWrapperLink from "./blogger-card-wrapper-link";
import { Link } from "@/i18n/navigation";
import { Separator } from "@/components/ui/separator";
import CardItem from "./card-item";
import BloggerCardButtons from "./blogger-card-buttons";
import BloggerCardTags from "./blogger-card-tags";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getDiscountedPrice } from '@/utils/discount';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


type Props = {
    blogger: Blogger
}

const BloggerCard = ({ blogger }: Props) => {

    const [selectedPrice, setSelectedPrice] = useState<string | null>(null)

    useEffect(() => {
        const firstPriceKey = Object.entries(blogger.prices)
            .filter(([_, value]) => value)
            .map(([key, _]) => key)[0]
        if (firstPriceKey) {
            setSelectedPrice(firstPriceKey)
        }
    }, [blogger.prices])
    return (
        <BloggerCardWrapperLink blogger={blogger}>
            <Card className="px-4 py-6  pt-3 shadow-md h-full cursor-pointer relative  w-[18rem]">
                <CardContent className="p-0 flex flex-col w-full h-full ">
                     <TooltipProvider>
                <Tooltip>
                        <TooltipTrigger className="absolute top-3 bg-slate-100 rounded-xl p-1 left-3 flex items-center gap-1 text-slate-500">
                    <StarIcon size={20} />
                    <span>{blogger.rating}</span>
                </TooltipTrigger>
                        <TooltipContent>
                            <p><Translate namespace='Blogger' itemKey="ratingTooltip"/>{blogger.rating}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                    <div className="flex items-center w-full flex-col gap-3 mb-2">
                        <BloggerAvatar src={blogger.profilePicture} className="w-20 h-20" />

                        <h4 className="font-bold">
                            <Link target="_blank" href={blogger.profileLink || ""}>{blogger.username}</Link>
                        </h4>
                    </div>

                  <Separator className="my-1" />

                    <div className="min-h-[40px]">
                        {blogger.tags.length ? (
                            <BloggerCardTags tags={blogger.tags} />
                        ) : null}
                    </div>

                    <Separator className="my-1" />

                    <ul className="flex flex-col gap-2 mb-8 flex-1 mt-3">
                        <li>
                            <CardItem
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
                                <CardItem
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
                            <CardItem
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

                    <BloggerCardButtons blogger={blogger} selectedPrice={selectedPrice} />
                </CardContent>
            </Card>
        </BloggerCardWrapperLink>
    );
};

export default BloggerCard;
