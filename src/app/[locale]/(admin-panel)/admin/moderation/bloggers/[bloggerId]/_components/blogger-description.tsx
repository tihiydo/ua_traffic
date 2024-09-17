import Translate from '@/components/Translate';
import React from 'react'

type Props = {
    about: string;
}

const BloggerDescription = ({ about }: Props) => {
    return (
        <div className='p-5 pb-7 shadow-md rounded-lg w-[70%]'> 
            <h4 className='uppercase text-xl font-title first-letter:bg-yellow mb-2'>
                <Translate namespace='Blogger' itemKey='descr'/>
            </h4>

            <div className='max-w-[500px] break-words' dangerouslySetInnerHTML={{ __html: about }} />
        </div>
    )
}

export default BloggerDescription