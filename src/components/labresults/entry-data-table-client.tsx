"use client";

import type { PrismaModels } from "@/types/db-models";
import type { ColumnDef } from "@tanstack/react-table";

import { format, parse } from "date-fns";
import { useLabFilterStore } from "@/store/labResultsFilter";
import { entriesColumns } from "@/components/labresults/columns";
import { api } from "@/trpc/react";
import { DataTable } from "../shared/table/data-table";
import { EntryDataTableToolbar } from "./entry-table-toolbar";

// ----- Types -----
type Lab = PrismaModels["LabInspection"];
type LabKey = keyof Lab;

// If entriesColumns isn't already typed as ColumnDef<Lab, unknown>[], we coerce it here.
const labEntriesColumns = entriesColumns;

// ColumnDef may or may not have an accessorKey. This guard narrows it safely.
function hasAccessorKey<T>(
  col: ColumnDef<T, unknown>
): col is ColumnDef<T, unknown> & { accessorKey: string } {
  return "accessorKey" in col && typeof (col as { accessorKey?: unknown }).accessorKey === "string";
}

function getShiftKey(entryDate: string, hour: string): string {
  const d = new Date(entryDate);
  const hr = Number(hour.slice(0, 2));
  if (hr < 6) d.setDate(d.getDate() - 1);
  return format(d, "d MMMM yyyy");
}

// helper: parse to number, treating "" as invalid and preserving only finite numbers
function toNumberOrNaN(v: unknown): number {
  if (typeof v === "number") return Number.isFinite(v) ? v : NaN;
  if (typeof v === "string") {
    const s = v.trim();
    if (s === "") return NaN; // ignore empty strings
    const n = Number(s);
    return Number.isFinite(n) ? n : NaN;
  }
  return NaN;
}

export default function EntryDataTableClient() {
  const { startDate, endDate } = useLabFilterStore();
  const { data: entries = [] } = api.entries.getFilteredEntries.useQuery(
    { startDate, endDate, plant: null, hours: null },
    { suspense: true, refetchOnMount: "always" }
  );

  // Ensure correct typing for entries array
  const typedEntries: Lab[] = entries;

  const shiftKeys = Array.from(
    new Set(typedEntries.map((e) => getShiftKey(e.date, e.hour)))
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
          const dayEntries = typedEntries.filter(
            (e) => getShiftKey(e.date, e.hour) === dayKey
          );

          // --- keys you do NOT want to average
          const NON_NUMERIC_KEYS = [
            "plant",
            "hour",
            "sample_type",
            "sample_description",
            "date",
          ] as const satisfies Readonly<LabKey[]>;
          const nonNumericSet = new Set<LabKey>(NON_NUMERIC_KEYS as Readonly<LabKey[]>);

          // derive numeric keys from columns (typed as keyof Lab)
          const numericKeys: LabKey[] = labEntriesColumns
            .filter(hasAccessorKey<Lab>)
            .map((col) => col.accessorKey as LabKey)
            .filter((k) => !nonNumericSet.has(k));

          // build an average row; values stored as strings with 2 decimals
          // (switch to Number(avg.toFixed(2)) if your schema expects numbers)
          const avgRow: Partial<Lab> & { plant: Lab["plant"] } = {
            plant: "Average" as Lab["plant"],
          };

          numericKeys.forEach((key) => {
            // collect numeric values, excluding empties and zeros
            const values = dayEntries
              .map((item) => toNumberOrNaN(item[key]))
              .filter((n): n is number => Number.isFinite(n) && n !== 0);

            if (values.length === 0) {
              // no meaningful values -> blank cell
              (avgRow as Record<LabKey, unknown>)[key] = "" as Lab[LabKey];
              return;
            }

            const sum = values.reduce((acc, n) => acc + n, 0);
            const avg = sum / values.length;

            // Store as string for display-friendly cells
            (avgRow as Record<LabKey, unknown>)[key] = avg.toFixed(2) as Lab[LabKey];
            // If your schema requires numbers instead:
            // (avgRow as Record<LabKey, unknown>)[key] = Number(avg.toFixed(2)) as Lab[LabKey];
          });

          const dataWithAvg: Lab[] = [...dayEntries, avgRow as Lab];

          return (
            <div key={dayKey}>
              <h2 className="text-xl font-semibold mb-2">
                {dayKey} Shift
              </h2>
              <DataTable<Lab, unknown>
                columns={labEntriesColumns}
                data={dataWithAvg}
                toolbar={(table) => (
                  <EntryDataTableToolbar table={table} />
                )}
                rowClassName={(row) =>
                  row.plant === "Average"
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
