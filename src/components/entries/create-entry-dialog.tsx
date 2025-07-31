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
  sampleDescriptionValues
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
      date: "",
      sample_description: "",
      fe_perc: "",
      sio_perc: "",
      tio_perc: "",
      mgo_perc: ""
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
      title="Add Lab Results"
      description="Create a new lab result entry."
      hasTrigger
      trigger={
        <Button variant="outline" size="sm">
          <PlusCircle className="mr-1 h-4 w-4" />
          Add Lab Results
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
              name="date"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor={`${id}-startDate`}>Date</FormLabel>
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
                  <FormLabel htmlFor={`${id}-sio_perc`}>%SiO2</FormLabel>
                  <FormControl>
                    <Input
                      id={`${id}-sio_perc`}
                      placeholder="Enter %SiO2 value"
                      type="text"
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
                <FormLabel htmlFor={`${id}-tio_perc`}>%TiO</FormLabel>
                <FormControl>
                  <Input
                    id={`${id}-tio_perc`}
                    placeholder="Enter %TiO2 value"
                    type="text"
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
                <FormLabel htmlFor={`${id}-mgo_perc`}>%Mg</FormLabel>
                <FormControl>
                  <Input
                    id={`${id}-mgo_perc`}
                    placeholder="Enter %MgO value"
                    type="text"
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
