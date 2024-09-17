import Translate from '@/components/Translate';
import Select from '@/components/select';
import React from 'react'

type Props<T extends readonly string[]> = {
    postTypes: T;
    value: T[number] | undefined;
    onChange: (value?: T[number]) => void;
}

function PostTypesSelect<T extends readonly string[]>({ postTypes, onChange, value }: Props<T>) {
    const Posts = postTypes
    const realPosts = ["all", ...Posts];

    return (
        <Select
            unselectable
            value={value}
            onChange={(select) => {
                if (select == null || select === value) {
                    return onChange(undefined)
                }

                if (realPosts.includes(select)) {
                    const value = select as (typeof realPosts)[number];
                    if (value == "all") {
                        onChange(undefined)
                    } else {
                        onChange(value)
                    }

                }
            }}
            placeholder={
                <Translate namespace='Default' itemKey='allposts' />
            }
            items={realPosts.map(postType => ({
                displayValue: <Translate namespace='Post-Types' itemKey={postType} />,
                value: postType
            }))}
        />
    )
}

export default PostTypesSelect