"use client";

import { type Table } from "@tanstack/react-table";
import { api, type RouterOutputs } from "@/trpc/react";
import { useState } from "react";
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
  const [allHours, setAllHours] = useState<boolean>(false);
  const [exportAll, setExportAll] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);

  const { data: filteredEntries, isLoading: isFilterLoading } =
    api.entries.getFilteredEntries.useQuery(
      {
        startDate: startDate || null,
        endDate: endDate || null,
        plant: selectedPlant || null,
        hours: allHours ? null : selectedHours.length ? selectedHours : null,
      },
      { enabled: !exportAll }
    );
// determine if there are entries available for export
  const hasEntries =
    exportAll
      ? (allEntries?.length ?? 0) > 0
      : (filteredEntries?.length ?? 0) > 0;

  const plantOptions = allEntries
    ? Array.from(new Set(allEntries.map((e) => e.plant)))
    : [];

  const handleExport = () => {
    const entriesToExport: Entry[] = exportAll
      ? allEntries ?? []
      : filteredEntries ?? [];

    if (!entriesToExport.length) return;
    setExporting(true);

    const worksheet = XLSX.utils.json_to_sheet(
      entriesToExport.map((e) => ({ ...e, date: e.date }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "LabResults");
    const wbout = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([wbout], {
      type: "application/octet-stream",
    });
    saveAs(blob, "lab-results.xlsx");
    setExporting(false);
  };

  return (
    <div className="flex items-center justify-between">
{/* Hour filter */}
        <Select
          value={(table.getColumn("hour")?.getFilterValue() as string) ?? ""}
          onValueChange={(val) => {
            const filterVal = val === "all" ? "" : val;
            table.getColumn("hour")?.setFilterValue(filterVal);
            setSelectedHours(filterVal ? [filterVal] : []);
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
          onChange={(e) => table.getColumn("plant")?.setFilterValue(e.target.value)}
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
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select
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
                value={selectedHours[0] ?? ""}
                onValueChange={(val) =>
                  setSelectedHours(val ? [val] : [])
                }
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
                  checked={allHours}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setAllHours(checked);
                    setSelectedHours(
                      checked
                        ? validateHourValues.map((h) => h.value)
                        : []
                    );
                  }}
                />
                <span>Export All Hours</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border"
                  checked={exportAll}
                  onChange={(e) => setExportAll(e.target.checked)}
                />
                <span>Export All</span>
              </label>
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
