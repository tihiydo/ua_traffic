import Translate from '@/components/Translate';
import { cn } from '@/lib/utils';
// import SanitizedDOM from '@/components/sanitized-dom';
import React from 'react'

type Props = {
    className?: string;
    about: string;
}

const BloggerDescription = ({ about, className }: Props) => {
    return (
        <section className={cn(className)}>
            <h4 className='text-xl font-title first-letter:bg-yellow mb-2'>
                <Translate namespace='Blogger' itemKey='descr' />
            </h4>

            <div className='border rounded-md border-gray-secondary p-4'>
                <div className='w-full max-w-none break-words select-text' dangerouslySetInnerHTML={{ __html: about }}>
                </div>
            </div>
        </section>
    )
}

export default BloggerDescription