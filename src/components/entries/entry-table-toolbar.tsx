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
          placeholder="Filter by Sample Description ..."
          value={
            (table.getColumn("sample_description")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("sample_description")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
