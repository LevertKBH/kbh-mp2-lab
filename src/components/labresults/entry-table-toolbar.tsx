"use client";

import { type Table } from "@tanstack/react-table";

import { DataTableViewOptions } from "@/components/shared/table/column-toggle";
import { Input } from "@/components/ui/input";

interface EntryDataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function EntryDataTableToolbar<TData>({
  table,
}: EntryDataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter by Plant ..."
          value={
            (table.getColumn("plant")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("plant")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
