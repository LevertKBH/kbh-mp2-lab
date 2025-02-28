import AuditViewer from "@/components/audit/audit-viewer";
import { api, HydrateClient } from "@/trpc/server";

type Params = Promise<{ id: string }>;

export default async function AuditViewerPage({ params }: { params: Params }) {
  const { id } = await params;

  void api.audit.getAuditById.prefetch({ id });

  return (
    <HydrateClient>
      <AuditViewer id={id} />
    </HydrateClient>
  );
}
