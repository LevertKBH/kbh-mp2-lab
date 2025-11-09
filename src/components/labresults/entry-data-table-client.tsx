"use client";

import { format, parse } from "date-fns";
import { useLabFilterStore } from "@/store/labResultsFilter";
import { entriesColumns } from "@/components/labresults/columns";
import { api } from "@/trpc/react";
import { DataTable } from "../shared/table/data-table";
import { EntryDataTableToolbar } from "./entry-table-toolbar";

function getShiftKey(entryDate: string, hour: string): string {
  const d = new Date(entryDate);
  const hr = Number(hour.slice(0, 2));
  if (hr < 6) d.setDate(d.getDate() - 1);
  return format(d, "d MMMM yyyy");
}

export default function EntryDataTableClient() {
  const { startDate, endDate } = useLabFilterStore();
  const { data: entries = [] } = api.entries.getFilteredEntries.useQuery(
    { startDate, endDate, plant: null, hours: null },
    { suspense: true, refetchOnMount: "always" }
  );

  const shiftKeys = Array.from(
    new Set(entries.map((e) => getShiftKey(e.date, e.hour)))
  );
  const shiftDays = shiftKeys.sort((a, b) => {
    const da = parse(a, "d MMMM yyyy", new Date()).getTime();
    const db = parse(b, "d MMMM yyyy", new Date()).getTime();
    return db - da;
  });

  if (shiftDays.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No lab results found.
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-8">
        {shiftDays.map((dayKey) => {
          const dayEntries = entries.filter(
            (e) => getShiftKey(e.date, e.hour) === dayKey
          );


          // compute average row for numeric columns
          const avgRow: Record<string, string | number> = { plant: "Average" };
          const nonNumericKeys = ["actions", "plant", "hour", "sample_type", "sample_description", "date"];
          const numericKeys = entriesColumns
            .map((col) => (col as any).accessorKey)
            .filter(
              (k): k is string =>
                typeof k === "string" && !nonNumericKeys.includes(k)
            );
          numericKeys.forEach((key) => {
            const values = dayEntries
              .map((item) =>
                parseFloat(((item as any)[key] as string) || "0")
              )
              .filter((v) => v > 0);
            const sum = values.reduce((total, v) => total + v, 0);
            const avg = values.length > 0 ? sum / values.length : 0;
            avgRow[key] = parseFloat(avg.toFixed(2));
          });
          const dataWithAvg = [...dayEntries, avgRow as any];

          return (
            <div key={dayKey}>
              <h2 className="text-xl font-semibold mb-2">
                {dayKey} Shift
              </h2>
              <DataTable
                columns={entriesColumns}
                data={dataWithAvg}
                toolbar={(table) => (
                  <EntryDataTableToolbar table={table} />
                )}
                rowClassName={(row) =>
                  (row as any).plant === "Average"
                    ? "bg-sky-100 font-bold text-left"
                    : ""
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
