"use client";

import { entriesColumns } from "@/components/entries/columns";
import { api } from "@/trpc/react";
import { DataTable } from "../shared/table/data-table";
import { Button } from "../ui/button";
import { EntryDataTableToolbar } from "./entry-table-toolbar";

export default function EntryDataTableClient() {
  const [entries] = api.entries.getAllEntries.useSuspenseQuery();

  const generatePdf = api.entries.generatePdf.useMutation({
    onSuccess: (data) => {
      console.log(data);
    },
  });

  return (
    <>
      <Button onClick={() => generatePdf.mutate({ id: entries[0]!.id })}>
        Generate PDF
      </Button>
      <DataTable
        columns={entriesColumns}
        data={entries}
        toolbar={(table) => <EntryDataTableToolbar table={table} />}
      />
    </>
  );
}
