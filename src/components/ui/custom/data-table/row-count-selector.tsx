import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { Table } from "@tanstack/react-table";
import Translate from "@/components/Translate";

type Props<TData> = {
  table: Table<TData>;
};

function RowCountSelector<TData>({ table }: Props<TData>) {
    return (
        <div className="flex items-center text-sm gap-2">
            <h6><Translate namespace="Default" itemKey="rows"/></h6>
            <Select
                defaultValue={table.getState().pagination.pageSize.toString()}
                onValueChange={(value) => {
                    const valueNumber = parseInt(value) ?? 10;

                    table.setPageSize(valueNumber);
                }}
            >
                <SelectTrigger className="w-fit gap-2 h-fit py-2 px-3">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent className="text-sm">
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="15">15</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}

export default RowCountSelector;
