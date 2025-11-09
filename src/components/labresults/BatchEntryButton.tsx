"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import BatchEntryDialog from "./BatchEntryDialog";
import { PlusCircle } from "lucide-react";

export default function BatchEntryButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
      <PlusCircle className="mr-1 h-4 w-4" />
        Add Lab Results in Batch
      </Button>
      <BatchEntryDialog isOpen={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}