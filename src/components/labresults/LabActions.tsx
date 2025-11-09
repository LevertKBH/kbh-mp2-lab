"use client";
import React from "react";
import CreateEntryDialog from "@/components/labresults/create-entry-dialog";
import BatchEntryButton from "@/components/labresults/BatchEntryButton";
import DateFilter from "@/components/labresults/DateFilter";

export default function LabActions() {
  return (
    <div className="flex items-center space-x-2">
      <CreateEntryDialog />
      <BatchEntryButton />
      <DateFilter />
    </div>
  );
}