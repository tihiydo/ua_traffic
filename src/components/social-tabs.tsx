'use client'

import instagramIcon from "@/assets/icons/instagram.svg";
import telegramIcon from "@/assets/icons/telegram.svg";
import Image from 'next/image'
import { SocialType } from '@prisma/client';
import { z } from 'zod';
import { CustomTabs, CustomTabsContent, CustomTabsList, CustomTabsTrigger, } from "./ui/custom/custom-tabs";
import { useState } from "react";
import { useSearchParams } from "next/navigation";


type Props = {
    children: React.ReactNode;
    value?: SocialType;
    onChange?: (value: SocialType) => void;
    className?: string;
}

const SocialSchema = z.nativeEnum(SocialType);


const SocialTabs = ({ children, onChange, value }: Props) => {
    const searchParams = useSearchParams();
    const searchParamsTabParseResult = SocialSchema.safeParse(searchParams.get('s-tab'))
    const defaultValue: SocialType = value ??
        (searchParamsTabParseResult.success
            ? searchParamsTabParseResult.data
            : 'Instagram')

    const [innerValue, setInnerValue] = useState<string>(defaultValue);

    return (
        <CustomTabs
            defaultValue={defaultValue}
            value={value ?? innerValue}
            onValueChange={(value) => {
                const social = SocialSchema.safeParse(value);

                if (social.success) {
                    onChange?.(social.data)
                    setInnerValue(social.data)
                }
            }}
        >
            <CustomTabsList className={"mb-3"}>
                <CustomTabsTrigger
                    className={`flex items-center gap-2`}
                    value={SocialType.Instagram}
                >
                    <div className="min-w-[20px]">
                        <Image src={instagramIcon} alt="ig" width={25} />
                    </div>
                    <p>Instagram</p>
                </CustomTabsTrigger>
                <CustomTabsTrigger
                    className={`flex items-center gap-2`}
                    value={SocialType.Telegram}
                >
                    <div className="min-w-[20px]">
                        <Image src={telegramIcon} alt="tg" width={25} />
                    </div>
                    <p >Telegram </p>
                </CustomTabsTrigger>
            </CustomTabsList>

            {children}
        </CustomTabs>
    )
}




const InstagramContent = ({ children, className }: { children?: React.ReactNode, className?: string }) => {
    return (
        <CustomTabsContent value={SocialType.Instagram} className={className}>
            {children}
        </CustomTabsContent>
    )
}

const TelegramContent = ({ children, className }: { children?: React.ReactNode, className?: string }) => {
    return (
        <CustomTabsContent value={SocialType.Telegram} className={className}>
            {children}
        </CustomTabsContent>
    )
}

const AnyContent = ({ children, className, value }: { children?: React.ReactNode, className?: string, value: SocialType }) => {
    return (
        <CustomTabsContent value={value} className={className}>
            {children}
        </CustomTabsContent>
    )
}


export { SocialTabs, InstagramContent, TelegramContent, AnyContent }