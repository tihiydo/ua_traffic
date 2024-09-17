"use client"
import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs-notification'
import { Accordion } from '@/components/ui/accordion'
import GuideTaskCard from './guide-task-card';
import { usePathname, useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { api } from '@/trpc/react'
import { X } from 'lucide-react';
import { useGuideStore } from '..';
import { Button } from '@/components/ui/button';
import { tasks } from '../tasks';
import Translate from '@/components/Translate';
import { getWindow } from '@/utils/window';


const Guide = () => {
    const window = getWindow();
    const { data: cabinetType, isSuccess: cabinetFetched } = api.user.getClientHeaderTab.useQuery()
    const t = useTranslations("guide")
    const { push } = useRouter();
    const pathname = usePathname();
    const [tab, setTab] = useState<string>()
    const closeGuide = useGuideStore(state => state.closeGuide);
    const activeTask = useGuideStore((state) => state.activeTask)
    const selectGuideTask = useGuideStore(state => state.selectTask)
    const resetActiveTask = useGuideStore(state => state.resetActiveTask)


    useEffect(() => {
        if (cabinetType === "Advertiser") {
            const includesCatalog = pathname.includes("catalog");
            const includesAdvertiser = pathname.includes("advertiser");

            if (includesAdvertiser) {
                return setTab('advertiser')
            }

            if (includesCatalog) {
                return setTab('catalog')
            }

            setTab('catalog')
        }

        if (cabinetType === 'Blogger') {
            const includesBloger = pathname.includes("blogger");
            if (includesBloger) {
                return setTab('blogger')
            }

            setTab('blogger')
        }
    }, [cabinetType])

    useEffect(() => {
        const onBeforeUnload = () => {
            resetActiveTask();
        }
        window?.addEventListener('beforeunload', onBeforeUnload)

        return () => {
            window?.removeEventListener('beforeunload', onBeforeUnload)
        }
    }, [window])


    useEffect(() => {
        if (!pathname.includes(`/${tab}`)) {
            const includesCatalog = pathname.includes("catalog");
            const includesAdvertiser = pathname.includes("advertiser");
            const includesBloger = pathname.includes("blogger");

            if (includesCatalog || includesBloger || includesAdvertiser) {
                switch (tab) {
                case 'catalog':
                    push("/catalog")
                    break;
                case 'advertiser':
                    push("/advertiser/dashboard")
                    break;
                case 'blogger':
                    push("/blogger/dashboard")
                    break;
                }
            }
        }
    }, [tab, pathname])

    return (
        <div className="block min-w-[18rem] relative  bg-[#f2f2f2] rounded-r-md">
            <div className=" w-[20rem]">
                <div className="h-[8rem] text-white up flex justify-center items-center font-bold" style={{ background: "linear-gradient(45deg, rgb(255, 245, 0) 0%, rgb(255 111 81) 54%, rgb(165, 231, 111) 100%)" }}>
                    {t("title")}

                    <Button className="size-6 absolute top-[9px] right-[6px] hover:bg-opacity-40" size={'icon'} variant={'ghost'}>
                        <X
                            color='#ffffff'
                            className='size-5'
                            onClick={() => {
                                closeGuide()
                            }}
                        />
                    </Button>

                </div>
                <div className="h-full">
                    <Tabs defaultValue="catalog" className="w-full h-full" value={tab} onValueChange={(e) => setTab(e)}>
                        <div className="flex w-full justify-center items-center h-[0.3rem]">
                            <TabsList className='flex overflow-x-auto w-full sm:w-fit shadow-custom'>
                                {cabinetFetched && (cabinetType === "Advertiser") ? (
                                    <>
                                        <TabsTrigger value="catalog">{t("catalog")}</TabsTrigger>
                                        <TabsTrigger value="advertiser">
                                            <Translate namespace='Default' itemKey='cabinet' />
                                        </TabsTrigger>
                                    </>
                                ) : null}

                                {cabinetFetched && (cabinetType === "Blogger"
                                    ? <>
                                        <TabsTrigger value="blogger">
                                            <Translate namespace='Default' itemKey='cabinet' />
                                        </TabsTrigger>
                                    </>
                                    : null
                                )}
                            </TabsList>
                        </div>
                        <div className="mx-2 my-10 h-full">
                            <div className="px-3 pt-1 pb-2 border border-[#c4c4c4] rounded-md bg-[#ffffffe8] shadow-custom-second text-sm">
                                <TabsContent value="catalog" className="!mt-0">
                                    <Accordion
                                        type="single"
                                        collapsible
                                        className="w-full"
                                        value={activeTask?.id ?? 'a_'}
                                        onValueChange={(value) => {
                                            if (!value) {
                                                return resetActiveTask()
                                            };

                                            selectGuideTask(value)
                                        }}
                                    >
                                        {tasks.catalog.map((task) => {
                                            return <GuideTaskCard
                                                key={task.id}
                                                task={task}
                                            />
                                        })}
                                    </Accordion>
                                </TabsContent>

                                <TabsContent value="advertiser" className="!mt-0">
                                    <Accordion
                                        type="single"
                                        className="w-full"
                                        collapsible
                                        value={activeTask?.id ?? 'a_'}
                                        onValueChange={(value) => {
                                            if (!value) {
                                                return resetActiveTask()
                                            };

                                            selectGuideTask(value)
                                        }}
                                    >
                                        {tasks.advertiser.map((task) => {
                                            return <GuideTaskCard
                                                key={task.id}
                                                task={task}
                                            />
                                        }
                                        )}
                                    </Accordion>
                                </TabsContent>

                                <TabsContent value="blogger" className="!mt-0">
                                    <Accordion
                                        type="single"
                                        collapsible
                                        className="w-full"
                                        value={activeTask?.id ?? 'a_'}
                                        onValueChange={(value) => {
                                            if (!value) {
                                                return resetActiveTask()
                                            };

                                            selectGuideTask(value)
                                        }}
                                    >
                                        {tasks.blogger.map((task) => {
                                            return <GuideTaskCard
                                                key={task.id}
                                                task={task}
                                            />
                                        })}
                                    </Accordion>
                                </TabsContent>
                            </div>
                        </div>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

export default Guide