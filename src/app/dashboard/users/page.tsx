"use server";

import UserDataTableClient from "@/components/users/users-data-table-client";
import { api, HydrateClient } from "@/trpc/server";

export default async function MainPage() {
  void api.users.getAllUsers.prefetch();
  return (
    <HydrateClient>
      <UserDataTableClient />
    </HydrateClient>
  );
}
