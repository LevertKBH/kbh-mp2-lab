"use client";

import { useMemo, useState } from "react";
import { format, parse } from "date-fns";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type Entry } from "@/lib/zod/labresults";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const HOURS = Array.from({ length: 12 }, (_, i) =>
  `${String((i * 2) % 24).padStart(2, "0")}h00`
);
// Force 06h00 as first shift hour
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
  const { data: entries = [] } = api.entries.getAllEntries.useQuery(
    undefined,
    { suspense: true, refetchOnMount: "always" }
  );

  // dedupe identical date/hour/sample
  const uniqueEntries = useMemo(
    () =>
      entries.filter((entry, idx, arr) =>
        arr.findIndex(
          (e) =>
            format(new Date(e.date), "dd-MMM-yy") ===
              format(new Date(entry.date), "dd-MMM-yy") &&
            e.hour === entry.hour &&
            e.sample_description === entry.sample_description
        ) === idx
      ),
    [entries]
  );

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
// track inline edits per entry
const [edits, setEdits] = useState<Record<string, Partial<PrismaModels["LabInspection"]>>>({});
// TRPC mutation for updating a single entry
const updateEntry = api.entries.updateEntry.useMutation();

// save handler for inline edits
const handleSave = () => {
  Object.values(edits).forEach((edit) => {
    const original = entries.find((e) => e.id === edit.id);
    if (!original) return;
    // strip out any fields not in the entrySchema
    const {
      id,
      date,
      hour,
      plant,
      sample_type,
      sample_description,
      fe_perc,
      sio_perc,
      al2o3_perc,
      p_perc,
      tio_perc,
      mgo_perc,
      cao_perc,
      p2o5_perc,
      cu_perc,
      screen425,
      screen212,
      screen150,
      screen75,
      screen106,
      screen53,
      screen45,
      screen38,
      pan,
      moisture,
    } = original;
    const base: Entry = {
      id,
      date,
      hour,
      plant,
      sample_type,
      sample_description,
      fe_perc,
      sio_perc,
      al2o3_perc,
      p_perc,
      tio_perc,
      mgo_perc,
      cao_perc,
      p2o5_perc,
      cu_perc,
      screen425,
      screen212,
      screen150,
      screen75,
      screen106,
      screen53,
      screen45,
      screen38,
      pan,
      moisture,
    };
    const payload: Entry = { ...base, ...(edit as Partial<Entry>) };
    updateEntry.mutate(payload);
  });
  setEdits({});
};

  // shift‐date helper
  function getShiftKey(entryDate: string, hour: string) {
    const d = new Date(entryDate);
    const hr = Number(hour.slice(0, 2));
    if (hr < 6) d.setDate(d.getDate() - 1);
    return format(d, "dd-MMM-yy");
  }

  // filter by start/end pickers (shift days)
  const filteredEntries = useMemo(() => {
    return uniqueEntries.filter((entry) => {
      const key = getShiftKey(entry.date, entry.hour);
      if (startDate) {
        const sd = new Date(startDate);
        const pd = parse(key, "dd-MMM-yy", new Date());
        if (pd < sd) return false;
      }
      if (endDate) {
        const ed = new Date(endDate);
        const pd = parse(key, "dd-MMM-yy", new Date());
        if (pd > ed) return false;
      }
      return true;
    });
  }, [uniqueEntries, startDate, endDate]);

  // list of shift days sorted descending
  const shiftDays = useMemo(() => {
    const keys = Array.from(
      new Set(filteredEntries.map((e) => getShiftKey(e.date, e.hour)))
    );
    return keys.sort(
      (a, b) =>
        parse(b, "dd-MMM-yy", new Date()).getTime() -
        parse(a, "dd-MMM-yy", new Date()).getTime()
    );
  }, [filteredEntries]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 space-x-2">
        <div className="flex items-center space-x-2">
          {/* Start shift picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                {startDate
                  ? format(parse(startDate, "yyyy-MM-dd", new Date()), "dd-MMM-yy")
                  : "Start shift"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar required
                                mode="single"
                selected={startDate ? parse(startDate, "yyyy-MM-dd", new Date()) : undefined}
                onSelect={(date: Date) => setStartDate(format(date, "yyyy-MM-dd"))}
              />
            </PopoverContent>
          </Popover>

          {/* End shift picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                {endDate
                  ? format(parse(endDate, "yyyy-MM-dd", new Date()), "dd-MMM-yy")
                  : "End shift"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar required
                                mode="single"
                selected={endDate ? parse(endDate, "yyyy-MM-dd", new Date()) : undefined}
                onSelect={(date: Date) => setEndDate(format(date, "yyyy-MM-dd"))}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>


      {/* If no shift days, show empty state */}
      {shiftDays.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          No Lab results for selected shift dates.
        </div>
      ) : shiftDays.map((dayKey) => {
        const dayEntries = filteredEntries
          .filter((e) => getShiftKey(e.date, e.hour) === dayKey)
          .sort(
            (a, b) =>
              ORDERED_HOURS.indexOf(a.hour) -
              ORDERED_HOURS.indexOf(b.hour)
          );

        return (
          <div key={dayKey} className="mb-8">
            <h2 className="sticky top-0 bg-white px-2 py-1 font-semibold">
              {format(parse(dayKey, "dd-MMM-yy", new Date()), "d MMMM yyyy")} Shift
            </h2>
            <Table className="w-full bg-white shadow-lg rounded-xl overflow-hidden divide-y divide-gray-100">
              <TableHeader>
                <TableRow className="bg-amber-50 text-amber-800 first:rounded-tl-xl last:rounded-tr-xl">
                  <TableHead className="border border-gray-300 px-4 py-2 text-center">
                    Hour
                  </TableHead>
                  {Array.from(
                    new Set(dayEntries.map((e) => e.sample_description))
                  ).map((desc) => (
                    <TableHead
                      key={desc}
                      colSpan={METRICS.length + 1}
                      className="border border-gray-300 px-4 py-2 text-center font-semibold"
                    >
                      {desc}
                    </TableHead>
                  ))}
                </TableRow>
                <TableRow className="bg-amber-100 text-amber-800">
                  {[
                    <TableHead
                      key="hour-header"
                      className="border border-gray-300 px-4 py-2 text-center"
                    >
                      &nbsp;
                    </TableHead>,
                    ...Array.from(
                      new Set(dayEntries.map((e) => e.sample_description))
                    ).flatMap((desc) => [
                      ...METRICS.map((col) => (
                        <TableHead
                          key={`${desc}-${col.key}`}
                          className="border border-gray-300 px-4 py-2 text-center"
                        >
                          {col.label}
                        </TableHead>
                      )),
                      <TableHead
                        key={`${desc}-actions-header`}
                        className="border border-gray-300 px-4 py-2 text-center"
                      >
                        Actions
                      </TableHead>,
                    ]),
                  ]}
                </TableRow>
              </TableHeader>
              <TableBody className="odd:bg-white even:bg-gray-50">
                {ORDERED_HOURS.map((hour) => (
                  <TableRow key={hour}>
                    <TableCell className="border border-gray-300 px-4 py-2 text-center">
                      {hour}
                    </TableCell>
                    {Array.from(
                      new Set(dayEntries.map((e) => e.sample_description))
                    ).flatMap((desc) => {
                      const entry = dayEntries.find(
                        (e) =>
                          e.hour === hour && e.sample_description === desc
                      );
                      return [
                        ...METRICS.map((col) => (
                          <TableCell
                            key={`${desc}-${hour}-${col.key}`}
                            className="border border-gray-300 px-4 py-2 text-center"
                          >
                            {entry ? (
                                <Input
                                  type="number"
                                  value={String(edits[entry.id]?.[col.key] ?? entry[col.key] ?? "")}
                                  onChange={(e) =>
                                    setEdits((prev) => ({
                                      ...prev,
                                      [entry.id]: {
                                        ...prev[entry.id],
                                        id: entry.id,
                                        [col.key]: e.target.value,
                                      },
                                    }))
                                  }
                                  className="w-16 p-1 text-sm"
                                />
                              ) : ""}
                          </TableCell>
                        )),
                        <TableCell
                          key={`${desc}-${hour}-actions`}
                          className="border border-gray-300 px-4 py-2 text-center"
                        >
                          {entry && <EntryRowActions entry={entry} />}
                        </TableCell>,
                      ];
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );
      })}

      {/* Save button */}
      <div className="mt-4 text-right">
        <Button onClick={handleSave} disabled={Object.keys(edits).length === 0} variant="default">
          Save Changes
        </Button>
      </div>
    </div>
  );
}