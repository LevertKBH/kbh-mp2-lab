"use server";

import EntryDataTableClient from "@/components/labresults/entry-data-table-client";
import { api, HydrateClient } from "@/trpc/server";

export default async function MainPage() {
  void api.entries.getAllEntries.prefetch();

  return (
    <HydrateClient>
      <EntryDataTableClient />
    </HydrateClient>
  );
}
