import Translate from '@/components/Translate';
import Select from '@/components/select';
import { InstagramAdPostType } from '@/database/ad-post/post/post-types'
import React from 'react'

type Props = {
    value: InstagramAdPostType;
    onChange?: (value: InstagramAdPostType) => void
    classNames?: Partial<{ 
        trigger: string;
        content: string
    }>;
}

const PostTypeSelect = ({ value, classNames, onChange }: Props) => {
    return (
        <Select
            classNames={classNames}
            onChange={(value) => {
                if (!value) return;
                onChange?.(value);
            }}
            value={value}
            items={Object.values(InstagramAdPostType).map(postType => ({
                value: postType,
                displayValue: <Translate namespace='Post-Types' itemKey={postType} />
            }))}
        />
    )
}

export default PostTypeSelect