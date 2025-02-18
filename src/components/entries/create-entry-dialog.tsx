"use client";

import { FormCombobox } from "@/components/entries/entry-form-combobox";
import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  disciplineValues,
  plantCategoryValues,
  plantEquipmentDescription,
  plantSectionValues,
} from "@/constants/entries";
import { entrySchema } from "@/lib/zod/entries";
import { api } from "@/trpc/react";
import { type BasicKeyValue } from "@/types/generic";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";
import { ResponsiveModal } from "../shared/responsive-modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

export default function CreateEntryDialog() {
  const id = useId();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlantEquipment, setSelectedPlantEquipment] = useState<
    (typeof plantEquipmentDescription)[number] | undefined
  >(undefined);

  const form = useForm<z.infer<typeof entrySchema>>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      start_date: "",
      end_date: "",
      plant_category: "",
      plant_section: "",
      discipline: "",
      plant_equipment: "",
      breakdown_description: "",
      notes: "",
    },
  });

  const utils = api.useUtils();
  const createEntry = api.entries.createEntry.useMutation({
    onSuccess: async () => {
      form.reset();
      await utils.entries.invalidate();
      await utils.audit.invalidate();
      setIsOpen(false);
      toast.success("Entry created", {
        description: "Entry has been created successfully",
      });
    },
    onError: () => {
      toast.error("Failed to create entry", {
        description: "Failed to create entry",
      });
    },
  });

  return (
    <ResponsiveModal
      title="Add Downtime Event"
      description="Create a new downtime entry."
      hasTrigger
      trigger={
        <Button variant="outline" size="sm">
          <PlusCircle className="mr-1 h-4 w-4" />
          Add Downtime Event
        </Button>
      }
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
        }
        setIsOpen(open);
      }}
      onCloseAutoFocus={() => {
        form.reset();
      }}
    >
      <Form {...form}>
        <form
          className="space-y-5"
          onSubmit={form.handleSubmit((data) => createEntry.mutate(data))}
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor={`${id}-startDate`}>Start Date</FormLabel>
                  <FormControl>
                    <Input
                      id={`${id}-startDate`}
                      max="9999-12-31T23:59"
                      type="datetime-local"
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="plant_category"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-2">
                  <FormLabel>Downtime Category</FormLabel>
                  <FormCombobox
                    field={field}
                    onSelect={field.onChange}
                    options={plantCategoryValues}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="plant_section"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-2">
                  <FormLabel>Plant Section</FormLabel>
                  <FormCombobox
                    field={field}
                    onSelect={field.onChange}
                    options={plantSectionValues}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discipline"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-2">
                  <FormLabel>Discipline</FormLabel>
                  <FormCombobox
                    field={field}
                    onSelect={field.onChange}
                    options={disciplineValues}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="plant_equipment"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-2">
                  <FormLabel>Plant Equipment</FormLabel>
                  <FormCombobox
                    field={field}
                    onSelect={(value) => {
                      setSelectedPlantEquipment(undefined);
                      form.setValue("breakdown_description", "");

                      const selectedOption = plantEquipmentDescription.find(
                        (option) => option.value === value,
                      );

                      setSelectedPlantEquipment(selectedOption);
                      field.onChange(value);
                    }}
                    options={plantEquipmentDescription}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="breakdown_description"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-2">
                  <FormLabel>Breakdown Description</FormLabel>
                  <FormCombobox
                    field={field}
                    onSelect={field.onChange}
                    disabled={!form.getValues("plant_equipment")}
                    options={
                      selectedPlantEquipment
                        ? (selectedPlantEquipment?.options?.map((option) => ({
                            label: option,
                            value: option,
                          })) as BasicKeyValue[])
                        : []
                    }
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={createEntry.isPending}
          >
            {createEntry.isPending && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create Entry
          </Button>
        </form>
      </Form>
    </ResponsiveModal>
  );
}
