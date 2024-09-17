"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import LanguageSelectorItem from "./language-selector-item";
import { locales } from "@/i18n/config";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { api } from "@/trpc/react";

const LanguageSelectorOriginal = () => {
    const locale = useLocale();
    const pathname = usePathname();
    const changeLocale = api.user.changeLocale.useMutation();
    const { replace } = useRouter();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-x-[2px] uppercase text-xs">
                { locale ?? "UA" }
                <ChevronDown size={"16px"}/>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {locales.map((locale) => (
                    <DropdownMenuItem
                        onClick={() => {
                            changeLocale.mutate({ locale })
                            replace(pathname, { locale });
                        }}
                        key={locale}
                    >
                        <LanguageSelectorItem locale={locale} />
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default LanguageSelectorOriginal;
