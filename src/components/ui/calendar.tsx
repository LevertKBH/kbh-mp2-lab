"use client";

import * as React from "react";
import * as CalendarPrimitive from "@radix-ui/react-calendar";
import { cn } from "@/lib/utils";

const Calendar = React.forwardRef<
  React.ElementRef<typeof CalendarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CalendarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CalendarPrimitive.Root
    ref={ref}
    className={cn(
      "grid w-full max-w-xs grid-cols-7 gap-1 rounded-md border p-2 bg-white",
      className
    )}
    {...props}
  />
));
Calendar.displayName = "Calendar";

export { Calendar };