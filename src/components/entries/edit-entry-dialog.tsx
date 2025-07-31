import {
  sampleDescriptionValues
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
  entry: PrismaModels["LabInspection"];
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
      date: entry.date,
      sample_description: entry.sample_description,
      fe_perc: entry.fe_perc,
      sio_perc: entry.sio_perc ?? "",
      tio_perc: entry.tio_perc,
      mgo_perc: entry.mgo_perc,
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
              name="date"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor={`${id}-date`}>Date</FormLabel>
                  <FormControl>
                    <Input
                      id={`${id}-date`}
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
                  name="sample_description"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-2">
                      <FormLabel>Sample Description</FormLabel>
                      <FormCombobox
                        field={field}
                        onSelect={field.onChange}
                        options={sampleDescriptionValues}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

            <FormField
              control={form.control}
              name="fe_perc"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor={`${id}-fe_perc`}>%Fe</FormLabel>
                  <FormControl>
                    <Input
                      id={`${id}-fe_perc`}
                      placeholder="Enter %Fe value"
                      type="number"
                      autoComplete="off"
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
              name="sio_perc"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor={`${id}-sio_perc`}>%SiO</FormLabel>
                  <FormControl>
                    <Input
                      id={`${id}-fe_perc`}
                      placeholder="Enter %SiO value"
                      type="number"
                      autoComplete="off"
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
              name="tio_perc"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor={`${id}-tio_perc`}>%Fe</FormLabel>
                  <FormControl>
                    <Input
                      id={`${id}-fe_perc`}
                      placeholder="Enter %TiO value"
                      type="number"
                      autoComplete="off"
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
              name="mgo_perc"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor={`${id}-mgo_perc`}>%Fe</FormLabel>
                  <FormControl>
                    <Input
                      id={`${id}-mgo_perc`}
                      placeholder="Enter %MgO value"
                      type="number"
                      autoComplete="off"
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
