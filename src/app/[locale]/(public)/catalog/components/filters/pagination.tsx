'use client'

import Translate from '@/components/Translate'
import { Button } from '@/components/ui/button'
import { usePrevious } from '@/hooks/use-previous'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { useCatalogParams } from '../../hooks/use-catalog-params'

type Props = {
    className?: string;
    itemsCount: number;
    take: number;
}

const Pagination = ({ className, itemsCount, take }: Props) => {
    const { update, schemaParams } = useCatalogParams()
    const [currentPage, setCurrentPage] = useState(schemaParams.page ?? 1);
    const prevItemsCount = usePrevious(itemsCount);
    
    useEffect(() => {
        update('page', currentPage)
    }, [currentPage])

    useEffect(() => {
        if (prevItemsCount == null) return;
        
        setCurrentPage(1)
    }, [itemsCount])

    const lastPage = Math.ceil(itemsCount / take)

    return (
        <div className={twMerge('flex items-center', className)}>
            <div className='mr-3'><Translate namespace='Default' itemKey='page'/> {currentPage} <Translate namespace='Default' itemKey='from'/> {lastPage}</div>

            <div className='flex gap-1.5 items-center'>
                <Button
                    variant="outline"
                    size="icon"
                    className={`h-8 w-8`}
                    onClick={() => {
                        setCurrentPage(1)
                    }}
                    disabled={currentPage === 1}
                >
                    <ChevronsLeft size={15} />
                </Button>

                <Button
                    variant="outline"
                    size="icon"
                    className={`h-8 w-8`}
                    onClick={() => {
                        setCurrentPage(currentPage - 1)
                    }}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft size={15} />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className={`h-8 w-8`}
                    onClick={() => {
                        setCurrentPage(currentPage + 1)
                    }}
                    disabled={currentPage === lastPage}

                >
                    <ChevronRight size={15} />
                </Button>

                <Button
                    variant="outline"
                    size="icon"
                    className={`h-8 w-8`}
                    onClick={() => {
                        setCurrentPage(lastPage)
                    }}
                    disabled={currentPage === lastPage}

                >
                    <ChevronsRight size={15} />
                </Button>
            </div>
        </div>
    )
}

export default Pagination