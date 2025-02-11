"use client";

import { type PrismaModels } from "@/types/db-models";
import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import AuditRowActions from "./audit-table-row-actions";

export const auditColumns: ColumnDef<PrismaModels["AuditLog"]>[] = [
  {
    accessorKey: "entity_type",
    header: "Entity Type",
  },
  {
    accessorKey: "action",
    header: "Action",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "performed_by_name",
    header: "Performed By Name",
  },
  {
    accessorKey: "performed_by_identifier",
    header: "Performed By",
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      return format(row.original.created_at, "yyyy/MM/dd HH:mm");
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <AuditRowActions audit={row.original} />;
    },
  },
];
