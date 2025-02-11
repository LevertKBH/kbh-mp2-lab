import AuditViewer from "@/components/audit/audit-viewer";
import { api } from "@/trpc/server";

type Params = Promise<{ id: string }>;

export default async function AuditViewerPage({ params }: { params: Params }) {
  const { id } = await params;
  void api.audit.getAuditById.prefetch({ id });
  return <AuditViewer id={id} />;
}
