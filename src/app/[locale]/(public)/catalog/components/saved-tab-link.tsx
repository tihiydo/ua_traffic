'use client'

import Translate from '@/components/Translate'
import { Button } from '@/components/ui/button'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { Bookmark } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React from 'react'

type Props = {
    className?: string;
}

const SavedTabLink = ({ className }: Props) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isActive = searchParams.get('tab') === 'Saved';

    return (
        <Link
            href={isActive ? pathname : `${pathname}?tab=Saved`}
            className={cn('w-full', className)}
        >
            <Button variant={'outline'} className={`px-3 py-2 gap-2 w-full ${isActive ? 'border-yellow ' : ''}`}>
                <div className="min-w-[20px]">
                    <Bookmark className='w-5 h-5 sm:w-6 sm:h-6' />
                </div>
                <h2 className='font-title'><Translate namespace='Catalogue' itemKey='saved-tab' /></h2>
            </Button>
        </Link>
    )
}

export default SavedTabLink