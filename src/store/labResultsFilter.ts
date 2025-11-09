import { startOfWeek, endOfWeek, format } from "date-fns";
import { create } from "zustand";

interface LabFilterState {
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
}

const today = new Date();
const defaultStart = format(startOfWeek(today), "yyyy-MM-dd");
const defaultEnd = format(endOfWeek(today), "yyyy-MM-dd");

export const useLabFilterStore = create<LabFilterState>(
  (set: (partial: Partial<LabFilterState>) => void) => ({
    startDate: defaultStart,
    endDate: defaultEnd,
    setStartDate: (date: string) => set({ startDate: date }),
    setEndDate: (date: string) => set({ endDate: date }),
  })
);