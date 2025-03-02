"use server";

import PDFView from "@/components/pdf/pdf-view";
import { api, HydrateClient } from "@/trpc/server";

type Params = Promise<{ id: string }>;

export default async function PDFViewPage({ params }: { params: Params }) {
  const { id } = await params;

  void api.entries.getEntryById.prefetch({ id });

  return (
    <HydrateClient>
      <PDFView id={id} />
    </HydrateClient>
  );
}
