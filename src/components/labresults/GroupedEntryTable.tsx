"use client";


import { useMemo, useState } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { entriesColumns } from "./columns";
import { EntryDataTableToolbar } from "./entry-table-toolbar";

import { format } from "date-fns";
import { type PrismaModels } from "@/types/db-models";
import { api } from "@/trpc/react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import EntryRowActions from "./row-actions";
import { Input } from "@/components/ui/input";

const HOURS = Array.from({ length: 12 }, (_, i) =>
  `${String((i * 2) % 24).padStart(2, "0")}h00`
);
// Rotate hours so 06h00 starts first
const ORDERED_HOURS = [...HOURS.slice(3), ...HOURS.slice(0, 3)];

const METRICS: { key: keyof PrismaModels["LabInspection"]; label: string }[] = [
  { key: "fe_perc", label: "% Fe" },
  { key: "sio_perc", label: "% SiO2" },
  { key: "p_perc", label: "% P" },
  { key: "tio_perc", label: "% TiO2" },
  { key: "mgo_perc", label: "% MgO" },
  { key: "cao_perc", label: "% CaO" },
  { key: "screen212", label: "+212µ" },
  { key: "screen150", label: "+150µ" },
  { key: "screen75", label: "+75µ" },
  { key: "screen53", label: "+53µ" },
  { key: "screen38", label: "+38µ" },
  { key: "pan", label: "Pan" },
  { key: "moisture", label: "% Moisture" },
];

export default function GroupedEntryTable() {
    const { data: entries = [] } = api.entries.getAllEntries.useQuery(undefined, {
      suspense: true,
      refetchOnMount: "always",
    });
  
    // remove duplicate records by date, hour, and sample description
    const uniqueEntries = entries.filter((entry, idx, arr) =>
    arr.findIndex(
      (e) =>
        format(new Date(e.date), "dd-MMM-yy") === format(new Date(entry.date), "dd-MMM-yy") &&
        e.hour === entry.hour &&
        e.sample_description === entry.sample_description
    ) === idx
    );
  const descriptions = Array.from(
    new Set(uniqueEntries.map((e) => e.sample_description))
  );

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const filteredEntries = useMemo(
    () =>
      uniqueEntries.filter((entry) => {
        const d = new Date(entry.date);
        if (startDate && d < new Date(startDate)) return false;
        if (endDate && d > new Date(endDate)) return false;
        return true;
      }),
    [uniqueEntries, startDate, endDate]
  );

  const sortedEntries = useMemo(
    () =>
      [...filteredEntries].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [filteredEntries]
  );

  const table = useReactTable({
    data: sortedEntries,
    columns: entriesColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const byDate: Record<string, typeof entries> = {};
  sortedEntries.forEach((entry) => {
    const key = format(new Date(entry.date), "dd-MMM-yy");
    if (!byDate[key]) byDate[key] = [];
    byDate[key].push(entry);
  });

  return (
    <div className="w-full overflow-auto">
<div className="flex items-center justify-between mb-2 space-x-2">
  <div className="flex items-center space-x-2">
    <Input
      type="date"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
      className="h-6 w-24 text-sm"
      placeholder="Start date"
    />
    <Input
      type="date"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
      className="h-6 w-24 text-sm"
      placeholder="End date"
    />
  </div>
  <EntryDataTableToolbar table={table} />
</div>
      <Table className="w-full border-collapse border border-gray-300 rounded-lg bg-white">
        <TableHeader>
          <TableRow className="bg-gray-200">
            <TableHead
              rowSpan={2}
              className="sticky top-0 left-0 z-40 w-16 border-r border-b border-gray-300 bg-gray-200 px-2 py-2 text-center transform -rotate-90 origin-bottom-left"
            >
              Date:
            </TableHead>
            <TableHead
              rowSpan={2}
              className="sticky top-0 left-16 z-50 w-32 border-r border-b border-gray-300 bg-gray-200 px-6 py-2 text-center"
            >
              Hour:
            </TableHead>
            {descriptions.map((desc) => (
              <TableHead
                key={desc}
                colSpan={METRICS.length + 1}
                className="sticky top-0 z-50 border-r-2 border-gray-800 border-b border-gray-300 bg-gray-200 text-center font-semibold px-4 py-2"
              >
                {desc}
              </TableHead>
            ))}
          </TableRow>
          <TableRow className="bg-gray-100">
            {descriptions.flatMap((desc) => [
              ...METRICS.map((col) => (
                <TableHead
                  key={`${desc}-${col.key}`}
                  className="sticky top-10 z-50 border-r-2 border-gray-800 border-b border-gray-300 bg-gray-100 text-center px-4 py-2"
                >
                  {col.label}
                </TableHead>
              )),
              <TableHead
                  key={`${desc}-actions`}
                  className="sticky top-10 z-50 border-r-2 border-gray-800 border-b border-gray-300 bg-gray-100 text-center px-4 py-2"
              >
                Actions
              </TableHead>
            ])}
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-200">
          {Object.entries(byDate).flatMap(([date, items]) => {
            const rows = ORDERED_HOURS.map((hour, idx) => (
              <TableRow
                key={`${date}-${hour}`}
                className={`odd:bg-white even:bg-gray-50 ${
                  idx === 0 ? "border-t-2 border-gray-300" : ""
                }`}
              >
                {idx === 0 && (
                  <TableCell
                    rowSpan={ORDERED_HOURS.length + 1}
                    className="sticky top-10 left-0 z-50 w-16 border border-gray-300 bg-gray-50 px-4 py-2 text-center"
                  >
                    <div className="transform -rotate-90 origin-center whitespace-nowrap">
                      {date}
                    </div>
                  </TableCell>
                )}
                <TableCell className="sticky top-10 left-16 z-50 w-32 border border-gray-300 bg-gray-50 px-6 py-2 text-center">
                  {hour}
                </TableCell>
                {descriptions.flatMap((desc) => {
                  const entry = items.find(
                    (e) =>
                      format(new Date(e.date), "dd-MMM-yy") === date &&
                      e.hour === hour &&
                      e.sample_description === desc
                  );
                  return [
                    ...METRICS.map((col) => (
                      <TableCell
                        key={`${desc}-${hour}-${col.key}`}
                        className="border-r-2 border-gray-800 border-b border-gray-300 text-center px-4 py-2"
                      >
                        {entry ? String(entry[col.key]) : ""}
                      </TableCell>
                    )),
                    <TableCell
                      key={`${desc}-${hour}-actions`}
                      className="border-r-2 border-gray-800 border-b border-gray-300 text-center px-4 py-2"
                    >
                      {entry && <EntryRowActions entry={entry} />}
                    </TableCell>
                  ];
                })}
              </TableRow>
            ));
            const avgRow = (
              <TableRow key={`${date}-avg`} className="bg-white">
                <TableCell className="sticky left-0 z-30 w-16 border border-gray-300 bg-gray-50 px-4 py-2 text-center">
                  Avg:
                </TableCell>
                {descriptions.flatMap((desc) =>
                  METRICS.map((col) => {
                    const vals = items
                      .filter(
                        (e) =>
                          e.sample_description === desc &&
                          e[col.key] != null &&
                          e[col.key] !== ""
                      )
                      .map((e) => Number(e[col.key]));
                    const avg = vals.length
                      ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2)
                      : "";
                    return (
                      <TableCell
                        key={`${desc}-avg-${col.key}`}
                        className="border-r-2 border-gray-800 border-b border-gray-300 text-center px-4 py-2"
                      >
                        {avg}
                      </TableCell>
                    );
                  })
                )}
              </TableRow>
            );
            const spacer = (
              <TableRow key={`${date}-spacer`} className="h-4">
                <TableCell colSpan={2 + descriptions.length * (METRICS.length + 1)} />
              </TableRow>
            );
            return [...rows, avgRow, spacer];
          })}
        </TableBody>
      </Table>
    </div>
  );
}