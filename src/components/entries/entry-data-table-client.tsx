"use client";

import { entriesColumns } from "@/components/entries/columns";
import { api } from "@/trpc/react";
import { DataTable } from "../shared/table/data-table";
import { EntryDataTableToolbar } from "./entry-table-toolbar";

export default function EntryDataTableClient() {
  const [entries] = api.entries.getAllEntries.useSuspenseQuery();

  return (
    <>
      <DataTable
        columns={entriesColumns}
        data={entries}
        toolbar={(table) => <EntryDataTableToolbar table={table} />}
      />
    </>
  );
}
