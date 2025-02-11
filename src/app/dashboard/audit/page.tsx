"use server";

import AuditTableClient from "@/components/audit/audit-table-client";
import { api, HydrateClient } from "@/trpc/server";

export default async function MainPage() {
  void api.audit.getAllAudits.prefetch();
  return (
    <HydrateClient>
      <AuditTableClient />
    </HydrateClient>
  );
}
