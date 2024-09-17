import type { Table } from "@tanstack/react-table";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, Settings2 } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTrigger } from "../../sheet";
import { twMerge } from "tailwind-merge";
import Translate from "@/components/Translate";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "../../drawer";
import { getWindow } from "@/utils/window";
import { useTranslations } from "next-intl";


type Props<TData> = {
    findBy?: string;
    table: Table<TData>;
    filters?: React.ReactNode;
};

function TopRow<TData>({ table, findBy, filters }: Props<TData>) {
    const defaultT = useTranslations('Default');
    const window = getWindow();
    const isMobileScreen = window ? window.innerWidth <= 768 : false;

    return (
        <div className={twMerge("flex w-full sm:w-fit flex-col sm:flex-row gap-3 items-start sm:items-end justify-between", (!!filters || !!findBy) ? 'mb-4' : '')}>
            <div className="relative w-full sm:w-fit">
                {findBy ? (
                    <div className="flex flex-col gap-3">
                        <h5 className='font-bold'><Translate namespace='Default' itemKey='search' /></h5>
                        <div className="relative">
                            <Input
                                placeholder={defaultT("search")}
                                value={
                                    (table.getColumn(findBy)?.getFilterValue() as string) ?? ""
                                }
                                onChange={(event) =>
                                    table.getColumn(findBy)?.setFilterValue(event.target.value)
                                }
                                className="h-[40px] w-full sm:max-w-sm py-1.5 pl-10"
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-secondary">
                                <SearchIcon size={20} />
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>

            {!!filters && (
                !isMobileScreen ? (
                    <div>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant={"outline"} className="h-fit gap-1 px-3 py-1.5">
                                    <Settings2 size={15} />
                                    <Translate namespace="Default" itemKey="filter" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="overflow-y-scroll max-h-screen  w-screen">
                                <SheetHeader className="font-bold">
                                    <Translate namespace="Default" itemKey="filter" />
                                </SheetHeader>
                                {filters}
                                <SheetClose>
                                    <Button className="mt-[30px] w-[150px]">ОK</Button>
                                </SheetClose>
                            </SheetContent>
                        </Sheet>
                    </div>
                )
                    :
                    (
                        <div>
                            <Drawer>
                                <DrawerTrigger>
                                    <Button variant={"outline"} className="h-fit gap-1 px-3 py-1.5">
                                        <Settings2 size={15} />
                                        <Translate namespace="Default" itemKey="filter" />
                                    </Button>
                                </DrawerTrigger>
                                <DrawerContent>
                                    <DrawerHeader>
                                        <DrawerTitle><Translate namespace="Default" itemKey="filter" /></DrawerTitle>
                                    </DrawerHeader>
                                    <div className="px-[35px] mb-[60px]">
                                        {filters}
                                        <DrawerClose>
                                            <Button className="mt-[30px] w-[150px]">Окей</Button>
                                        </DrawerClose>
                                    </div>
                                </DrawerContent>
                            </Drawer>
                        </div>
                    )
            )}

        </div>
    );
}

export default TopRow;
