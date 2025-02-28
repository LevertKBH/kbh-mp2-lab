/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";

import { api } from "@/trpc/react";
import { useEffect, useState } from "react";

// Main component that loads data
export default function PDFView({ id }: { id: string }) {
  const [entry] = api.entries.getEntryById.useSuspenseQuery({ id });
  const [ClientPDF, setClientPDF] = useState<React.ComponentType<any> | null>(
    null,
  );

  useEffect(() => {
    // Dynamically import the PDF component only on the client side
    void import("@/components/pdf/pdf-client-view").then((module) => {
      setClientPDF(() => module.default);
    });
  }, []);

  if (!ClientPDF) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        Loading PDF viewer...
      </div>
    );
  }

  return <ClientPDF data={entry} />;
}
