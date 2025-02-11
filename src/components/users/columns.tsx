"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { type UserWithRole } from "better-auth/plugins";
import { format } from "date-fns";
import { ShieldCheckIcon, ShieldIcon } from "lucide-react";
import { DataTableColumnHeader } from "../shared/table/column-header";
import { Badge } from "../ui/badge";
import UserRowActions from "./row-actions";

export const usersColumns: ColumnDef<UserWithRole>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    enableSorting: true,
    cell: ({ row }) => {
      switch (row.original.role) {
        case "admin":
          return (
            <Badge variant="outline">
              <ShieldCheckIcon className="mr-2 h-4 w-4" />
              Admin
            </Badge>
          );
        case "user":
          return (
            <Badge variant="outline">
              <ShieldIcon className="mr-2 h-4 w-4" />
              Member
            </Badge>
          );
      }
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      return <span>{format(createdAt, "dd/MM/yyyy")}</span>;
    },
    enableSorting: true,
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => {
      const updatedAt = row.original.updatedAt;
      return <span>{format(updatedAt, "dd/MM/yyyy")}</span>;
    },
    enableSorting: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <UserRowActions user={row.original} />,
  },
];
