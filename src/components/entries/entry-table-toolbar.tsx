"use client";

import { type Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { DataTableViewOptions } from "@/components/shared/table/column-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { DataTableFacetedFilter } from "@/components/shared/table/faceted-filter";
import { statuses } from "./options";

interface EntryDataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function EntryDataTableToolbar<TData>({
  table,
}: EntryDataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter by plant section..."
          value={
            (table.getColumn("plant_section")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("plant_section")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
