import { type Locale } from "@/i18n/config";
import React from "react";

type Props = {
    locale: Locale
};

const LanguageSelectorItem = ({ locale }: Props) => {
    return (
        <div className="flex items-center gap-[3px] uppercase text-xs">
            <p>{locale}</p>
        </div>
    );
};

export default LanguageSelectorItem;
