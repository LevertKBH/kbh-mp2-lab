import {
  disciplineValues,
  plantCategoryValues,
  plantEquipmentDescription,
  plantSectionValues,
} from "@/constants/entries";
import { entrySchema } from "@/lib/zod/entries";
import { api } from "@/trpc/react";
import { type PrismaModels } from "@/types/db-models";
import { type BasicKeyValue } from "@/types/generic";
import { zodResolver } from "@hookform/resolvers/zod";
import { type FC, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";
import { Icons } from "../shared/icons";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { FormCombobox } from "./entry-form-combobox";

interface EditEntryDialogProps {
  entry: PrismaModels["Downtime"];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditEntryDialog: FC<EditEntryDialogProps> = ({
  entry,
  open,
  onOpenChange,
}) => {
  const id = useId();

  const [selectedPlantEquipment, setSelectedPlantEquipment] = useState<
    (typeof plantEquipmentDescription)[number] | undefined
  >(
    plantEquipmentDescription.find(
      (option) => option.value === entry.plant_equipment,
    ),
  );

  const form = useForm<z.infer<typeof entrySchema>>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      plant_category: entry.plant_category,
      start_date: entry.start_date,
      end_date: entry.end_date ?? "",
      plant_section: entry.plant_section,
      discipline: entry.discipline,
      plant_equipment: entry.plant_equipment,
      breakdown_description: entry.breakdown_description,
      notes: entry.notes ?? "",
    },
  });

  const utils = api.useUtils();
  const updateEntry = api.entries.updateEntry.useMutation({
    onSuccess: async () => {
      form.reset();
      await utils.entries.invalidate();
      await utils.audit.invalidate();
      toast.success("Entry updated successfully");
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error("Failed to update entry", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
        }
        onOpenChange(open);
      }}
    >
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border"
            aria-hidden="true"
          >
            <svg
              className="stroke-zinc-800 dark:stroke-zinc-100"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <circle cx="16" cy="16" r="12" fill="none" strokeWidth="8" />
            </svg>
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">Edit Entry</DialogTitle>
            <DialogDescription className="sm:text-center">
              Edit the downtime entry.
            </DialogDescription>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form
            className="space-y-5"
            onSubmit={form.handleSubmit(() =>
              updateEntry.mutate({ id: entry.id, ...form.getValues() }),
            )}
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel htmlFor={`${id}-startDate`}>
                      Start Date
                    </FormLabel>
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
                name="end_date"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel htmlFor={`${id}-endDate`}>End Date</FormLabel>
                    <FormControl>
                      <Input
                        id={`${id}-endDate`}
                        max="9999-12-31T23:59"
                        disabled={!form.getValues("start_date")}
                        min={form.getValues("start_date")}
                        type="datetime-local"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Adding an end date will set the status to &quot;up&quot;
                      and resolve the downtime.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="plant_category"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-2">
                    <FormLabel>Plant Category</FormLabel>
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
              disabled={updateEntry.isPending}
            >
              {updateEntry.isPending && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Entry
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEntryDialog;
