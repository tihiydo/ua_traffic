'use client'

import { DataTable } from './data-table';
import { api } from '@/trpc/react';
import React, { useMemo, useState } from 'react';
import Filters, { type FiltersData } from './filters';
import { columns } from './columns';
import { Prisma } from '@prisma/client';

export type ModerateReviewTableData = Prisma.BloggerReviewGetPayload<{ include: { blogger: true, advertiser: true } }>;

const BloggerReviewsTable = () => {
    const { data, isLoading } = api.admin.reviews.getReviews.useQuery({});
    const reviews = data?.reviews ?? [];

    const [filters, setFilters] = useState<FiltersData>({}); 

    const filteredReviews = useMemo(() => {
        let filteredReviews = reviews;

        if (filters?.reviewStatus) {
            filteredReviews = filteredReviews.filter((review: ModerateReviewTableData) => (
                review.status?.toLowerCase() === filters.reviewStatus
            ));
        }
        if (filters?.reviewStatus === 'all') {
            filteredReviews = reviews;
        }

        return filteredReviews;
    }, [filters, reviews]);

    return (
        <div>
            <DataTable
                findBy='text'
                isLoading={isLoading}
                columns={columns}
                data={filteredReviews}
                filters={filters}
                onFiltersChange={setFilters}
            />
        </div>
    );
};

export default BloggerReviewsTable;
