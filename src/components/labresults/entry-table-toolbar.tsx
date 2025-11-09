"use client";

import { type Table } from "@tanstack/react-table";
import { api, type RouterOutputs } from "@/trpc/react";
import { useState, type ChangeEvent } from "react";
import { parseISO, addDays } from "date-fns";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { DataTableViewOptions } from "@/components/shared/table/column-toggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { validateHourValues } from "@/constants/entries";

interface EntryDataTableToolbarProps<TData> {
  table: Table<TData>;
}

type Entry = RouterOutputs["entries"]["getAllEntries"][number];

export function EntryDataTableToolbar<TData>({
  table,
}: EntryDataTableToolbarProps<TData>) {
  const { data: allEntries, isLoading: isExportLoading } =
    api.entries.getAllEntries.useQuery();

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedPlant, setSelectedPlant] = useState<string>("");
  const [selectedHours, setSelectedHours] = useState<string[]>([]);
  const [allHours, setAllHours] = useState(false);
  const [exportAll, setExportAll] = useState(false);
  const [exportByShift, setExportByShift] = useState(false);
  const [shiftDate, setShiftDate] = useState<string>("");
  const [exporting, setExporting] = useState(false);

  // Column selection state
  const allColumnIds = table.getAllLeafColumns().map((c) => c.id);
  const [exportColumns, setExportColumns] = useState<string[]>(allColumnIds);

  const { data: filteredEntries, isLoading: isFilterLoading } =
    api.entries.getFilteredEntries.useQuery(
      {
        startDate: startDate || null,
        endDate: endDate || null,
        plant: selectedPlant || null,
        hours:
          exportAll || allHours
            ? null
            : selectedHours.length
            ? selectedHours
            : null,
      },
      { enabled: !exportAll }
    );

  const entriesToExport: Entry[] = exportAll
    ? allEntries ?? []
    : filteredEntries ?? [];

  const hasEntries = (entriesToExport.length ?? 0) > 0;

  const plantOptions = allEntries
    ? Array.from(new Set(allEntries.map((e) => e.plant)))
    : [];

  const handleExport = () => {
    if (exportByShift && shiftDate) {
      const sd = parseISO(shiftDate);
      const start = new Date(sd.setHours(6, 0, 0, 0));
      const end = new Date(addDays(sd, 1).setHours(6, 0, 0, 0));
      const shiftFiltered = entriesToExport.filter((e) => {
        const exec = /\d+/.exec(e.hour);
        const hh = exec ? exec[0] : "00";
        const dt = new Date(`${e.date}T${hh.padStart(2, "0")}:00:00`);
        return dt >= start && dt < end;
      });
      if (shiftFiltered.length) {
        exportData(shiftFiltered);
      }
    } else {
      exportData(entriesToExport);
    }
  };

  const exportData = (rows: Entry[]) => {
    if (!rows.length) return;
    setExporting(true);
    // build sheet data with selected columns
    const sheetData = rows.map((row) => {
      const record: Record<string, unknown> = {};
      exportColumns.forEach((colId) => {
        const key = colId as keyof Entry;
        record[colId] = row[key];
      });
      return record;
    });
    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "LabResults");
    const wbout = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    }) as ArrayBuffer;
    const blob = new Blob([wbout], {
      type: "application/octet-stream",
    });
    saveAs(blob, "lab-results.xlsx");
    setExporting(false);
  };

  return (
    <div className="flex items-center justify-between">
      <Select
        value={(table.getColumn("hour")?.getFilterValue() as string) ?? ""}
        onValueChange={(val) => {
          const filter = val === "all" ? "" : val;
          table.getColumn("hour")?.setFilterValue(filter);
          setSelectedHours(filter ? [filter] : []);
        }}
      >
        <SelectTrigger className="h-8 w-[150px] lg:w-[250px]">
          <SelectValue placeholder="Filter by Hour..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem key="all" value="all">
            All Hours
          </SelectItem>
          {validateHourValues.map((h) => (
            <SelectItem key={h.value} value={h.value}>
              {h.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter by Plant..."
          value={(table.getColumn("plant")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("plant")?.setFilterValue(e.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="sm"
              disabled={!hasEntries || isExportLoading || exporting}
            >
              {exporting || isExportLoading || isFilterLoading
                ? "Exporting..."
                : "Export"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Export Options</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="flex flex-col space-y-1">
                <Label htmlFor="export-start-date">Start Date</Label>
                <Input
                  id="export-start-date"
                  type="date"
                  disabled={exportByShift}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <Label htmlFor="export-end-date">End Date</Label>
                <Input
                  id="export-end-date"
                  type="date"
                  disabled={exportByShift}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select
                disabled={exportByShift}
                value={selectedPlant}
                onValueChange={setSelectedPlant}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Plant" />
                </SelectTrigger>
                <SelectContent>
                  {plantOptions.map((plant) => (
                    <SelectItem key={plant} value={plant}>
                      {plant}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                disabled={exportByShift}
                value={selectedHours[0] ?? ""}
                onValueChange={(val) => setSelectedHours(val ? [val] : [])}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Hour" />
                </SelectTrigger>
                <SelectContent>
                  {validateHourValues.map((h) => (
                    <SelectItem key={h.value} value={h.value}>
                      {h.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border"
                  checked={exportByShift}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setExportByShift(e.target.checked)
                  }
                />
                <span>Export by Shift</span>
              </label>
              {exportByShift && (
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="export-shift-date">Shift Date</Label>
                  <Input
                    id="export-shift-date"
                    type="date"
                    value={shiftDate}
                    onChange={(e) => setShiftDate(e.target.value)}
                    className="w-full"
                  />
                </div>
              )}
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border"
                  disabled={exportByShift}
                  checked={allHours}
                  onChange={(e) => {
                    const c = e.target.checked;
                    setAllHours(c);
                    setSelectedHours(
                      c ? validateHourValues.map((h) => h.value) : []
                    );
                  }}
                />
                <span>Export All Hours</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border"
                  disabled={exportByShift}
                  checked={exportAll}
                  onChange={(e) => setExportAll(e.target.checked)}
                />
                <span>Export All</span>
              </label>
              {/* Column chooser */}
              <div className="space-y-2 pt-4 border-t">
                <Label>Select Columns to Export</Label>
                <div className="max-h-40 overflow-y-auto space-y-1 p-2 border rounded">
                  {allColumnIds.map((colId) => (
                    <label
                      key={colId}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        className="h-5 w-5 rounded border"
                        disabled={exportByShift}
                        checked={exportColumns.includes(colId)}
                        onChange={() =>
                          setExportColumns((prev) =>
                            prev.includes(colId)
                              ? prev.filter((c) => c !== colId)
                              : [...prev, colId]
                          )
                        }
                      />
                      <span>
                        {typeof table.getColumn(colId)?.columnDef.header ===
                        "string"
                          ? (table.getColumn(colId)?.columnDef.header as string)
                          : colId}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleExport}
                disabled={!hasEntries || isExportLoading || exporting}
              >
                {exporting ? "Exporting..." : "Export"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
