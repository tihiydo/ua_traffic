'use client'

import Translate from "@/components/Translate";
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Settings2Icon } from "lucide-react"
import { useState } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
    children: React.ReactNode;
}

const FiltersSheet = ({ children }: Props) => {
    const [sheet, setOpenSheet] = useState(false);

    return (
        <Drawer open={sheet} onOpenChange={(e) => setOpenSheet(e)}>
            <DrawerTrigger asChild>
                <Button variant={"outline"} className={twMerge('h-fit gap-1 px-3 py-1.5 inline-flex @5xl/catalog-tab:hidden')}>
                    <Settings2Icon size={15} />
                    <Translate namespace='Default' itemKey='filters' />
                </Button>
            </DrawerTrigger>
            <DrawerContent className="px-[35px]  ">
                <div className="max-h-[90vh] overflow-y-auto no-scrollbar">
                    {children}
                    <Button className="mt-8  w-[10rem] mb-[35px]" onClick={() => setOpenSheet(false)}>OK</Button>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default FiltersSheet