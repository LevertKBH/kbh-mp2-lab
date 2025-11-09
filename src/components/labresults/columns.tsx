"use client";

import { type PrismaModels } from "@/types/db-models";
import { type ColumnDef } from "@tanstack/react-table";
import { differenceInHours, differenceInMinutes, format } from "date-fns";
import { DataTableColumnHeader } from "../shared/table/column-header";
import { Badge } from "../ui/badge";
import EntryRowActions from "./row-actions";

export const entriesColumns: ColumnDef<PrismaModels["LabInspection"]>[] = [
  {
    id: "actions",
    cell: ({ row }) =>
      row.original.hour === "Average" ? null : (
        <EntryRowActions entry={row.original} />
      ),
  },
  {
    accessorKey: "plant",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Plant" />
    ),
  },  
  {
    accessorKey: "hour",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Hour" />
    ),
  },
  {
    accessorKey: "sample_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sample Type" />
    ),
  },  
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
      <DataTableColumnHeader column={column} title="% Fe" />
    ),
  },
  {
    accessorKey: "sio_perc",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="% SiO2" />
    ),
  },
  {
    accessorKey: "al2o3_perc",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="% Al2O3" />
    ),
  },
  {
    accessorKey: "p_perc",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="% P" />
    ),
  },
  {
    accessorKey: "tio_perc",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="% TiO2" />
    ),
  },
  {
    accessorKey: "mgo_perc",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="% MgO" />
    ),
  },
  {
    accessorKey: "cao_perc",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="% CaO" />
    ),
  },
  {
    accessorKey: "p2o5_perc",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="% P205" />
    ),
  },
  {
    accessorKey: "cu_perc",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="% Cu" />
    ),
  },
  {
    accessorKey: "moisture",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Moisture" />
    ),
  },
  {
    accessorKey: "screen425",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="+425µ" />
    ),
  },
  {
    accessorKey: "screen212",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="+212µ" />
    ),
  },
  {
    accessorKey: "screen150",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="+150µ" />
    ),
  },
  {
    accessorKey: "screen75",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="+75µ" />
    ),
  },
  {
    accessorKey: "screen106",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="+106µ" />
    ),
  },
  {
    accessorKey: "screen53",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="+53µ" />
    ),
  },
  {
    accessorKey: "screen45",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="+45µ" />
    ),
  },
  {
    accessorKey: "screen38",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="+38µ" />
    ),
  },
  {
    accessorKey: "s_perc",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="% S" />
    ),
  },
  {
    accessorKey: "aa_fe_perc",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="AA Wet Chem % Fe" />
    ),
  },
  {
    accessorKey: "pan",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pan" />
    ),
  },

];
