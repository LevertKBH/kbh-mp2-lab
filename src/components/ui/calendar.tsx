"use client";

import "react-day-picker/dist/style.css";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

// Wrap DayPicker as Calendar for consistency
const Calendar = DayPicker;

export { Calendar };