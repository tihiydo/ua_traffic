'use client'

import Translate from "@/components/Translate";
import ComboBox from "@/components/ui/combo-box";
import { categories } from "@/database/blogger/categories";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

type Category = (typeof categories)[number];
const realCategories = ["all", ...categories];

type Props = {
    value: Category | undefined;
    onChange: (value?: Category) => void;
}

const CategorySelect = ({ onChange, value }: Props) => {
    const t = useTranslations('Categories');

    const translatedCategories = useMemo(() => {
        return realCategories.map(category => ({
            original: category,
            translated: t(category).toLowerCase()
        }));
    }, [t]);

    const filterWithTranslations = (value: string, search: string) => {
        const lowerSearch = search.toLowerCase();
        const category = translatedCategories.find(cat => cat.original === value);
        
        if (!category) return 0;
        
        if (category.original.toLowerCase().includes(lowerSearch) || 
            category.translated.includes(lowerSearch)) {
            return 1;
        }
        
        return 0;
    };

    return (
        <div className="flex flex-col gap-3">
            <ComboBox
                filter={filterWithTranslations}
                value={value}
                onSelect={(selectedValue) => {
                    const newValue = selectedValue !== value
                        ? selectedValue as Category
                        : undefined;

                    onChange(newValue);
                }}
                placeholder={<Translate namespace='Default' itemKey='allcategories' />}
                items={realCategories.map(category => ({
                    label: <Translate namespace='Categories' itemKey={category} />,
                    value: category
                }))}
            />
        </div>
    )
}

export default CategorySelect;