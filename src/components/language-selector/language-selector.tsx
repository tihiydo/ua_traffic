"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Globe } from "lucide-react";
import LanguageSelectorItem from "./language-selector-item";
import { locales } from "@/i18n/config";
import { usePathname, useRouter } from "@/i18n/navigation";
import { api } from "@/trpc/react";
import { useLocale } from "next-intl";

const LanguageSelector = () => {
    const locale = useLocale();
    const pathname = usePathname();
    const changeLocale = api.user.changeLocale.useMutation();
    const { replace } = useRouter();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-x-[2px] uppercase text-xs">
                <Globe className="duration-200 hover:text-yellow size-8" strokeWidth={2} size={30}/>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mt-7">
                {locales.map((localeItem) => (
                    <DropdownMenuItem
                        className={localeItem === locale ? "bg-yellow/80" : ''}
                        onClick={() => {
                            changeLocale.mutate({ locale: localeItem })
                            replace(pathname, { locale: localeItem });
                        }}
                        key={localeItem}
                    >
                        <LanguageSelectorItem locale={localeItem} />
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default LanguageSelector;
