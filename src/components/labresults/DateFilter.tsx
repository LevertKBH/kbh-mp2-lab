"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { useLabFilterStore } from "@/store/labResultsFilter";

export default function DateFilter() {
  const { startDate, endDate, setStartDate, setEndDate } = useLabFilterStore();

  return (
    <div className="flex items-center space-x-2">
      <Input
        type="date"
        value={startDate}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setStartDate(e.target.value)
        }
      />
      <Input
        type="date"
        value={endDate}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setEndDate(e.target.value)
        }
      />
    </div>
  );
}