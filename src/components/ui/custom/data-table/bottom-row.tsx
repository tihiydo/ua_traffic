import type { Table } from "@tanstack/react-table";
import React from "react";
import NavButtons from "./nav-buttons";
import RowCountSelector from "./row-count-selector";
import Translate from "@/components/Translate";

type Props<TData> = {
  table: Table<TData>;
};

function BottomRow<TData>({ table }: Props<TData>) {
    return (
        <div className="flex items-center justify-between mt-2 px-2 text-sm flex-wrap">
            <div className="text-sm text-gray-secondary sm:mb-0 mb-8">
                {table.getSelectedRowModel().rows.length} <Translate namespace="Default" itemKey="from"/>{" "}
                {table.getRowModel().rows.length} <Translate namespace="Default" itemKey="rowsselected"/>
            </div>

            <div className="flex items-center gap-5 flex-wrap place-content-center sm:place-content-start">
                <RowCountSelector table={table} />

                <div>
                    {table.getState().pagination.pageIndex + 1} <Translate namespace="Default" itemKey="current"/> {table.getPageCount()}
                </div>

                <NavButtons table={table} />
            </div>
        </div>
    );
}

export default BottomRow;
