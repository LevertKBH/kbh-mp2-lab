"use client";
import React from "react";
import CreateEntryDialog from "@/components/labresults/create-entry-dialog";
import BatchEntryButton from "@/components/labresults/BatchEntryButton";
import DateFilter from "@/components/labresults/DateFilter";
import { authClient } from "@/lib/auth-client";

export default function LabActions() {
  const session = authClient.useSession();
  const role = session.data?.user.role;

  // Hide create and batch buttons for viewers
  const isViewer = role === "mp2-view-only";

  return (
    <div className="flex items-center space-x-2">
      {!isViewer && (
        <>
          <CreateEntryDialog />
          <BatchEntryButton />
        </>
      )}
      <DateFilter />
    </div>
  );
}