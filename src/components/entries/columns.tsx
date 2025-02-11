"use client";

import { type PrismaModels } from "@/types/db-models";
import { type ColumnDef } from "@tanstack/react-table";
import { differenceInHours, differenceInMinutes, format } from "date-fns";
import { DataTableColumnHeader } from "../shared/table/column-header";
import { Badge } from "../ui/badge";
import EntryRowActions from "./row-actions";

export const entriesColumns: ColumnDef<PrismaModels["Downtime"]>[] = [
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      return (
        <Badge
          className="capitalize"
          variant={row.original.end_date ? "outline" : "destructive"}
        >
          {row.original.end_date ? "up" : "down"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "start_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Date" />
    ),
    sortDescFirst: true,
    enableHiding: false,
    cell: ({ row }) => {
      return format(row.original.start_date, "yyyy/MM/dd HH:mm");
    },
    enableSorting: true,
    sortingFn: (a, b) => {
      const startDateA = new Date(a.original.start_date);
      const startDateB = new Date(b.original.start_date);
      return startDateA.getTime() - startDateB.getTime();
    },
  },
  {
    accessorKey: "end_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End Date" />
    ),
    enableSorting: true,
    enableHiding: false,
    sortingFn: (a, b) => {
      if (a.original.end_date && b.original.end_date) {
        return (
          new Date(a.original.end_date).getTime() -
          new Date(b.original.end_date).getTime()
        );
      }
      return 0;
    },
    cell: ({ row }) => {
      if (row.original.end_date) {
        return format(row.original.end_date, "yyyy/MM/dd HH:mm");
      }
      return "N/A";
    },
  },
  {
    id: "total_downtime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Downtime" />
    ),
    cell: ({ row }) => {
      return row.original.end_date
        ? `${differenceInHours(
            row.original.end_date,
            row.original.start_date,
          )}h ${
            differenceInMinutes(
              row.original.end_date,
              row.original.start_date,
            ) % 60
          }m`
        : "N/A";
    },
  },
  {
    accessorKey: "plant_section",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Plant Section" />
    ),
  },
  {
    accessorKey: "discipline",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Discipline" />
    ),
  },
  {
    accessorKey: "plant_equipment",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Plant Equipment" />
    ),
  },
  {
    accessorKey: "breakdown_description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Breakdown Description" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <EntryRowActions entry={row.original} />,
  },
];
