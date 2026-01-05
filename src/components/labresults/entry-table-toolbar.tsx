"use client";

import { type Table } from "@tanstack/react-table";
import { api, type RouterOutputs } from "@/trpc/react";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect, type ChangeEvent } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
  const [exportAll, setExportAll] = useState(true);
  const [exportByShift, setExportByShift] = useState(false);
  const [shiftDate, setShiftDate] = useState<string>("");
  const [exporting, setExporting] = useState(false);
  const [exportType, setExportType] = useState<"excel" | "hourly-dist" | "foskor-dist">("excel");
  // Removed TRPC mutation hook to use direct Next.js API export
const exportFoskor = api.reports.exportFoskorHourlyDistribution.useMutation();

  const allColumnIds = table.getAllLeafColumns().map((c) => c.id);
  const [exportColumns, setExportColumns] = useState<string[]>(allColumnIds);

  const hasFilters =
    !!startDate ||
    !!endDate ||
    !!selectedPlant ||
    selectedHours.length > 0 ||
    allHours;

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
      { enabled: !exportAll && hasFilters }
    );

  const entriesToExport: Entry[] = exportAll
    ? allEntries ?? []
    : filteredEntries ?? [];

  const hasEntries = (entriesToExport.length ?? 0) > 0;

  const plantOptions = allEntries
    ? Array.from(new Set(allEntries.map((e) => e.plant)))
    : [];
  // Foskor-specific PDF export helper (declared before handleExport)
  const exportFoskorDistribution = async () => {
    if (!startDate || !selectedHours[0]) return;
    setExporting(true);
    try {
      const response = await fetch(
        `/api/reports/exportFoskorHourlyDistribution?date=${startDate}&hour=${selectedHours[0]}`,
        { headers: { Accept: "application/pdf" } }
      );
      if (!response.ok) throw new Error("Failed to export Foskor PDF");
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `FoskorHourlyDistributionReport_${startDate}_${selectedHours[0]}.pdf`;
      link.click();
    } catch (error) {
      console.error("Error exporting Foskor PDF:", error);
    } finally {
      setExporting(false);
    }
  };

  const handleExport = () => {
    if (exportType === "hourly-dist") {
      exportHourlyDistribution();
    } else if (exportType === "foskor-dist") {
      exportFoskorDistribution();
    } else if (exportByShift && shiftDate) {
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
    const sheetData = rows.map((row) => {
      const record: Record<string, unknown> = {};
      exportColumns.forEach((colId) => {
        record[colId] = row[colId as keyof Entry];
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

  const exportHourlyDistribution = async () => {
    if (!startDate || !selectedHours[0]) return;
    setExporting(true);
    try {
      const response = await fetch(
        `/api/reports/exportHourlyDistribution?date=${startDate}&hour=${selectedHours[0]}`,
        { headers: { Accept: "application/pdf" } }
      );
      if (!response.ok) throw new Error("Failed to export PDF");
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `HourlyDistributionReport_${startDate}_${selectedHours[0]}.pdf`;
      link.click();
    } catch (error) {
      console.error("Error exporting PDF:", error);
    } finally {
      setExporting(false);
    }
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
            {/* Report Type Selector */}
            <div className="flex flex-col space-y-1 pt-2">
              <Label>Report Type</Label>
              <RadioGroup
                value={exportType}
                onValueChange={(value: string) =>
                  setExportType(value as "excel" | "hourly-dist" | "foskor-dist")
                }
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="excel" id="type-excel" />
                  <Label htmlFor="type-excel">Excel</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hourly-dist" id="type-hourly" />
                  <Label htmlFor="type-hourly">Hourly Distribution</Label>
                </div>
<div className="flex items-center space-x-2">
                    <RadioGroupItem value="foskor-dist" id="type-foskor" />
                    <Label htmlFor="type-foskor">Foskor Hourly Distribution</Label>
                  </div>
              </RadioGroup>
            </div>
            {/* Debug: show selected export type */}
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Current type: {exportType}
            </div>
            <div className="space-y-4 py-2">
              {exportType === "excel" ? (
                <>
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
                </>
              ) : (
                <>
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="export-start-date">Date</Label>
                    <Input
                      id="export-start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full"
                    />
                  </div>
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
                </>
              )}
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
