import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import type { Table } from "@tanstack/react-table";

type Props<TData> = {
    table: Table<TData>
};

function NavButtons<TData>({ table }: Props<TData>) {
    return (
        <div className="flex gap-1.5">
            <Button
                variant="outline"
                size="icon"
                className={`${!table.getCanPreviousPage() && "border-0 "} h-8 w-8`}
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
            >
                <ChevronsLeft size={15} />
            </Button>
            <Button
                variant="outline"
                size="icon"
                className={`${!table.getCanPreviousPage() && "border-0"} h-8 w-8`}
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
            >
                <ChevronLeft size={15} />
            </Button>
            <Button
                variant="outline"
                size="icon"
                className={`${!table.getCanNextPage() && "border-0"} h-8 w-8`}
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
            >
                <ChevronRight size={15} />
            </Button>

            <Button
                variant="outline"
                size="icon"
                className={`${!table.getCanNextPage() && "border-0"} h-8 w-8`}
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
            >
                <ChevronsRight size={15} />
            </Button>
        </div>
    );
}

export default NavButtons;
