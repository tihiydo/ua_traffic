'use client'

import React from 'react'

import instagramIcon from "@/assets/icons/instagram.svg";
import telegramIcon from "@/assets/icons/telegram.svg";
import { useCatalogParams } from '../hooks/use-catalog-params';
import Image from 'next/image';
import { Bookmark } from 'lucide-react';
import Translate from '@/components/Translate';
import { CustomTabsContent, CustomTabsTrigger, CustomTabsList, CustomTabs } from '@/components/ui/custom/custom-tabs';

export const tabs = ['Instagram', 'Telegram', 'Saved'] as const
export type CatalogTabType = (typeof tabs)[number];

type Props = {
    children?: React.ReactNode;
}

const SocialTypeSelect = ({ children }: Props) => {
    const { schemaParams, replace } = useCatalogParams();

    return (
        <CustomTabs
            defaultValue={schemaParams.tab}
            value={schemaParams.tab}
            onValueChange={(value) => {
                const typedValue = value as CatalogTabType
                if (!tabs.includes(typedValue as CatalogTabType)) return;

                replace({ tab: typedValue })
            }}
        >
            <CustomTabsList className={"mb-3 gap-4"}>
                <Trigger
                    value='Instagram'
                    text={<Translate namespace='Catalogue' itemKey='insta-tab' />}
                    icon={<Image src={instagramIcon} alt="ig" width={25} />}
                />

                <Trigger
                    value='Telegram'
                    text={<Translate namespace='Catalogue' itemKey='tg-tab' />}
                    icon={<Image src={telegramIcon} alt="tg" width={25} />}
                />
            </CustomTabsList>

            {children}
        </CustomTabs>
    )
}

type TriggerProps = {
    value: CatalogTabType;
    icon: React.ReactNode
    text: React.ReactNode;
}

const Trigger = ({ value, icon, text }: TriggerProps) => {
    return (
        <CustomTabsTrigger
            className={`flex items-center gap-2`}
            value={value}
        >
            <div className="min-w-[20px]">
                {icon}
            </div>
            <h2>{text}</h2>
        </CustomTabsTrigger>
    )
}


type TabProps = {
    value: CatalogTabType;
    children: React.ReactNode;
}

export const CatalogTabContent = ({ children, value }: TabProps) => {
    return (
        <CustomTabsContent value={value}>
            {children}
        </CustomTabsContent>
    )
}


export default SocialTypeSelect