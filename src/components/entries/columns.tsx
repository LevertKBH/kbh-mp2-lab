"use client";

import { type PrismaModels } from "@/types/db-models";
import { type ColumnDef } from "@tanstack/react-table";
import { differenceInHours, differenceInMinutes, format } from "date-fns";
import { DataTableColumnHeader } from "../shared/table/column-header";
import { Badge } from "../ui/badge";
import EntryRowActions from "./row-actions";

export const entriesColumns: ColumnDef<PrismaModels["LabInspection"]>[] = [
    {
    accessorKey: "sample_description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sample Description" />
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
  },
  {
    accessorKey: "fe_perc",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fe%" />
    ),
  },
  {
    accessorKey: "sio_perc",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SiO%" />
    ),
  },
  {
    accessorKey: "tio_perc",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="TiO%" />
    ),
  },
  {
    accessorKey: "mgo_perc",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mg%" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <EntryRowActions entry={row.original} />,
  },
];
