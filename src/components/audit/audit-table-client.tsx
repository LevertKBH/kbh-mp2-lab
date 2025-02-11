"use client";

import { api } from "@/trpc/react";
import { DataTable } from "../shared/table/data-table";
import { AuditDataTableToolbar } from "./audit-table-toolbar";
import { auditColumns } from "./columns";

export default function AuditTableClient() {
  const [audits] = api.audit.getAllAudits.useSuspenseQuery();
  return (
    <DataTable
      columns={auditColumns}
      data={audits}
      toolbar={(table) => <AuditDataTableToolbar table={table} />}
    />
  );
}
