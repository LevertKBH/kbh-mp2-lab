"use client";

import { api } from "@/trpc/react";
import { format } from "date-fns";
import CodeComparison from "../ui/code-comparison";

export default function AuditViewer({ id }: { id: string }) {
  const [audit] = api.audit.getAuditById.useSuspenseQuery({ id });
  return (
    <div>
      <div className="">
        <dl className="">
          <div className="border-b px-4 pb-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium">ID</dt>
            <dd className="mt-1 flex items-center text-sm/6 text-muted-foreground sm:col-span-2 sm:mt-0">
              {audit?.id}
            </dd>
          </div>
          <div className="border-b px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium">Created at Date</dt>
            <dd className="mt-1 flex items-center text-sm/6 text-muted-foreground sm:col-span-2 sm:mt-0">
              {format(audit!.created_at, "MM/dd/yyyy hh:mm a")}
            </dd>
          </div>
          <div className="border-b px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium">User ID</dt>
            <dd className="mt-1 text-sm/6 text-muted-foreground sm:col-span-2 sm:mt-0">
              {audit?.userId}
            </dd>
          </div>
          <div className="border-b px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium">User</dt>
            <dd className="mt-1 flex items-center text-sm/6 text-muted-foreground sm:col-span-2 sm:mt-0">
              {audit?.performed_by_name}
            </dd>
          </div>
          <div className="border-b px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium">User identifier</dt>
            <dd className="mt-1 text-sm/6 text-muted-foreground sm:col-span-2 sm:mt-0">
              {audit?.performed_by_identifier}
            </dd>
          </div>
          <div className="border-b px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium">Entity ID</dt>
            <dd className="mt-1 text-sm/6 text-muted-foreground sm:col-span-2 sm:mt-0">
              {audit?.entity_id}
            </dd>
          </div>
          <div className="border-b px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium">Action</dt>
            <dd className="mt-1 text-sm/6 text-muted-foreground sm:col-span-2 sm:mt-0">
              {audit?.action}
            </dd>
          </div>
          <div className="border-b px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium">Entity Type</dt>
            <dd className="mt-1 text-sm/6 text-muted-foreground sm:col-span-2 sm:mt-0">
              {audit?.entity_type}
            </dd>
          </div>
          <div className="border-b px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium">Description</dt>
            <dd className="mt-1 text-sm/6 text-muted-foreground sm:col-span-2 sm:mt-0">
              {audit?.description}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium">Metadata</dt>
            <dd className="mt-2 text-sm sm:col-span-2 sm:mt-0">
              <CodeComparison
                beforeCode={
                  audit?.metadata
                    ? JSON.stringify(JSON.parse(audit?.metadata ?? ""), null, 2)
                    : ""
                }
                language="json"
                filename="metadata.json"
                lightTheme="github-light"
                darkTheme="github-dark"
              />
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
