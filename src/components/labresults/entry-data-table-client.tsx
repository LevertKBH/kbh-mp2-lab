"use client";

import { entriesColumns } from "@/components/labresults/columns";
import { api } from "@/trpc/react";
import { DataTable } from "../shared/table/data-table";
import { EntryDataTableToolbar } from "./entry-table-toolbar";

export default function EntryDataTableClient() {
  const entriesQuery = api.entries.getAllEntries.useQuery(undefined, {
    suspense: true,
    refetchOnMount: "always",
  });
  const entries = entriesQuery.data ?? [];

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
