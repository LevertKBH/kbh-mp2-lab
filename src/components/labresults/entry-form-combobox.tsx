"use client";

import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { FormControl } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { type entrySchema } from "@/lib/zod/labresults";
import { type BasicKeyValue } from "@/types/generic";
import { useState } from "react";
import { type ControllerRenderProps } from "react-hook-form";
import { type z } from "zod";

type ComboboxProps = {
  field: ControllerRenderProps<
    z.infer<typeof entrySchema>,
    keyof z.infer<typeof entrySchema>
  >;
  onSelect: (value: string) => void;
  options: BasicKeyValue[];
  disabled?: boolean;
};

export function FormCombobox({
  field,
  onSelect,
  options,
  disabled = false,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-full justify-between",
              !field.value && "text-muted-foreground",
            )}
          >
            <div className="max-w-[350px] truncate">
              {field.value
                ? options.find((option) => option.label === field.value)?.label
                : "Select item"}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[450px] p-0">
        <Command>
          <CommandInput placeholder="Search item..." />
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  value={option.label}
                  key={option.label}
                  onSelect={() => {
                    onSelect(option.label);
                    setOpen(false);
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      option.label === field.value
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
