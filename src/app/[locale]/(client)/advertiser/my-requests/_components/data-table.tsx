"use client";

import {
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import BottomRow from "@/components/ui/custom/data-table/bottom-row";
import TopRow from "@/components/ui/custom/data-table/top-row";
import { Skeleton } from "@/components/ui/skeleton";
import Translate from "@/components/Translate";
import Filters, { type FiltersData } from './filters';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    findBy?: string;
    onFiltersChange: (filters: FiltersData) => void;
    filters: FiltersData;
    isLoading?: boolean;
    disablePagination?: boolean;
    hideHeader?: boolean;
    noBorder?: boolean;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    findBy,
    onFiltersChange,
    filters,
    disablePagination = false,
    isLoading,
    hideHeader,
    noBorder = false,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState({});
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onRowSelectionChange: setRowSelection,
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            rowSelection,
            columnFilters,
        },
    });

    return (
        <div>
            <div className=" flex flex-col sm:flex-row items-start justify-start gap-4 sm:gap-7">
                <TopRow findBy={findBy} table={table} />
                <Filters
                    filters={filters}
                    onChange={onFiltersChange}
                />
            </div>

            <div className={noBorder ? "" : "rounded-md border border-gray-secondary"}>
                <Table>
                    {!hideHeader && (
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext(),
                                                    )}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                    )}
                    <TableBody>
                        {false
                            ?
                            Array(5).fill(0).map((_, index) => (
                                <TableRow
                                    key={index}
                                >
                                    {columns.map((cell, index) => (
                                        <TableCell key={index}>
                                            <Skeleton className="h-4 w-[80%]" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                            : table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell 
                                                className="p-2 last:border-b-0"
                                                key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        <Translate namespace="Default" itemKey="cantfind"/>
                                    </TableCell>
                                </TableRow>
                            )}

                    </TableBody>
                </Table>
            </div>

            {!disablePagination && (
                <BottomRow table={table} />
            )}
        </div>
    );
}
