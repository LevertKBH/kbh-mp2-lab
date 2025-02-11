"use client";

import { api } from "@/trpc/react";
import { DataTable } from "../shared/table/data-table";
import { usersColumns } from "./columns";
import { UsersDataTableToolbar } from "./users-table-toolbar";

export default function UserDataTableClient() {
  const [users] = api.users.getAllUsers.useSuspenseQuery();
  return (
    <DataTable
      columns={usersColumns}
      data={users.users}
      toolbar={(table) => <UsersDataTableToolbar table={table} />}
    />
  );
}
