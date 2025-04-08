import {
  disciplineValues,
  plantCategoryValues,
  plantEquipmentDescription,
  plantSectionValues,
} from "@/constants/entries";
import { entrySchema } from "@/lib/zod/entries";
import { api } from "@/trpc/react";
import { type PrismaModels } from "@/types/db-models";
import { zodResolver } from "@hookform/resolvers/zod";
import { type FC, useId } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";
import { Icons } from "../shared/icons";
import { ResponsiveModal } from "../shared/responsive-modal";
import { Button } from "../ui/button";
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
import { Textarea } from "../ui/textarea";
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
    <ResponsiveModal
      title="Edit Entry"
      description="Edit the downtime entry."
      hasTrigger={false}
      isOpen={open}
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
        }
        onOpenChange(open);
      }}
      onCloseAutoFocus={() => {
        form.reset();
      }}
    >
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
                    Adding an end date will set the status to &quot;up&quot; and
                    resolve the downtime.
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
                    onSelect={field.onChange}
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
                <FormItem className="space-y-2">
                  <FormLabel htmlFor={`${id}-breakdownDescription`}>
                    Breakdown Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      id={`${id}-breakdownDescription`}
                      placeholder="Enter breakdown description"
                      required
                      {...field}
                    />
                  </FormControl>
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
    </ResponsiveModal>
  );
};

export default EditEntryDialog;
