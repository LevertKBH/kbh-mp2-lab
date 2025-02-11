"use client";

import { api } from "@/trpc/react";

export default function EntriesTest() {
  const [entries] = api.entries.getAllEntries.useSuspenseQuery();

  return <pre>{JSON.stringify(entries, null, 2)}</pre>;
}
