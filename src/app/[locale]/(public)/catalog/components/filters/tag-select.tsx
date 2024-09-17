import Translate from '@/components/Translate';
import Select from '@/components/select';
import { BloggerTag } from '@prisma/client';
import React from 'react'

type Props = {
    value: BloggerTag | undefined;
    onChange: (value?: BloggerTag | undefined) => void;
}

function TagSelect({ onChange, value }: Props) {
    const tags = ["all", ...Object.values(BloggerTag)] as const;

    return (
        <Select
            unselectable
            value={value}
            onChange={(select) => {
                if (select == null || select === value) {
                    return onChange(undefined)
                }

                if (tags.includes(select)) {
                    const value = select as (typeof tags)[number];
                    if (value == "all") {
                        onChange(undefined)
                    } else {
                        onChange(value)
                    }

                }
            }}
            placeholder={
                <Translate namespace='Catalogue' itemKey='tags-placeholder' />
            }
            items={tags.map(tag => ({
                displayValue: <Translate namespace='Blogger-Tags' itemKey={tag} />,
                value: tag
            }))}
        />
    )
}

export default TagSelect