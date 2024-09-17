'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React from 'react';

export type FiltersData = {
    reviewStatus?: string;
};

type Props = {
    filters?: FiltersData;
    onChange: (filters: FiltersData) => void;
};

const Filters = ({ filters, onChange }: Props) => {
    return (
        <div className='flex flex-col gap-3'>
            <h5 className='font-bold block'>Статус відгука</h5>
            <Select
                value={filters?.reviewStatus}
                onValueChange={(value) => {
                    onChange({
                        ...filters,
                        reviewStatus: value,
                    });
                }}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Статус відгука" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Всі</SelectItem>
                    <SelectItem value="pending">На модерації</SelectItem>
                    <SelectItem value="approved">Одобрені</SelectItem>
                    <SelectItem value="rejected">Відхилені</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
};

export default Filters;
