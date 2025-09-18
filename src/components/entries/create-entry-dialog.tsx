"use client";

import { FormCombobox } from "@/components/entries/entry-form-combobox";
import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  disciplineValues,
  plantEquipmentDescription,
  plantSectionValues,
  sampleDescriptionValues,
  sampleTypeValues,
  plantValues
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
      sample_type: "Normal Sample",
      plant: "MP2",
      sample_description: "Wet Feed - Frm CNV -2",
      fe_perc: "",
      sio_perc: "",
      al2o3_perc: "",
      p_perc: "",
      tio_perc: "",
      mgo_perc: "",
      cao_perc: "",
      p2o5_perc: "",
      cu_perc: "",
      screen425µ: "",
      screen212µ: "",
      screen150µ: "",
      screen75µ: "",
      screen106µ: "",
      screen53µ: "",
      screen45µ: "",
      screen38µ: "",
      pan: "",
      moisture: ""      
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

  const selectedSampleType = form.watch("sample_type");
  const selectedPlant = form.watch("plant");
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
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
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
                      step="7200"
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
              name="plant"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-2">
                  <FormLabel>Plant</FormLabel>
                  <FormCombobox
                    field={field}
                    onSelect={(value) => {
                      field.onChange(value);
                      form.reset({
                        plant: value,
                        cao_perc: "",
                        p2o5_perc: "",
                        cu_perc: "",
                        p_perc: "",
                        screen425µ: "",
                        al2o3_perc: "",
                        screen212µ: "",
                        screen150µ: "",
                        screen75µ: "",
                        screen106µ: "",
                        screen53µ: "",
                        screen45µ: "",
                        screen38µ: "",
                        pan: "",
                        moisture: "" 
                        // Add more fields as in your defaultValues
                      });
                    }}
                    options={plantValues}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sample_type"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-2">
                  <FormLabel>Sample Type</FormLabel>
                  <FormCombobox
                    field={field}
                    onSelect={field.onChange}
                    options={sampleTypeValues}
                  />
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
                  <FormLabel htmlFor={`${id}-fe_perc`}>% Fe</FormLabel>
                  <FormControl>
                    <Input
                      id={`${id}-fe_perc`}
                      placeholder="Enter % Fe value"
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
                  <FormLabel htmlFor={`${id}-sio_perc`}>% SiO<sub>2</sub></FormLabel>
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
            {selectedPlant === "LIO" && (<FormField
              control={form.control}
              name="al2o3_perc"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor={`${id}-al2o3_perc`}>% Al2O3</FormLabel>
                  <FormControl>
                    <Input
                      id={`${id}-al2o3_perc`}
                      placeholder="Enter %Al2O3 value"
                      type="text"
                      autoComplete="off"
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />)
            }
            {(selectedPlant === "SAOB" || selectedPlant === "LIO" ) && (<FormField
              control={form.control}
              name="p_perc"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor={`${id}-p_perc`}>% P</FormLabel>
                  <FormControl>
                    <Input
                      id={`${id}-p_perc`}
                      placeholder="Enter %P value"
                      type="text"
                      autoComplete="off"
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />)}
          <FormField
            control={form.control}
            name="tio_perc"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel htmlFor={`${id}-tio_perc`}>% TiO<sub>2</sub></FormLabel>
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
                <FormLabel htmlFor={`${id}-mgo_perc`}>% MgO</FormLabel>
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
          <FormField
            control={form.control}
            name="cao_perc"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel htmlFor={`${id}-cao_perc`}>% CaO</FormLabel>
                <FormControl>
                  <Input
                    id={`${id}-cao_perc`}
                    placeholder="Enter % CaO value"
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
          {selectedPlant === "MP2" && (<FormField
            control={form.control}
            name="p2o5_perc"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel htmlFor={`${id}-p2o5_perc`}>% P2O5</FormLabel>
                <FormControl>
                  <Input
                    id={`${id}-p2o5_perc`}
                    placeholder="Enter % P2O5 value"
                    type="number"
                    autoComplete="off"
                    required
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />)}
          
          {selectedPlant === "MP2" && (<FormField
            control={form.control}
            name="cu_perc"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel htmlFor={`${id}-cu_perc`}>% Cu</FormLabel>
                <FormControl>
                  <Input
                    id={`${id}-cu_perc`}
                    placeholder="Enter % Cu value"
                    type="number"
                    autoComplete="off"
                    required
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />)}

          {selectedSampleType === "Special Sample" && (
            <FormField
              control={form.control}
              name="screen425µ"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor={`${id}-screen425µ`}>+425µ</FormLabel>
                  <FormControl>
                    <Input
                      id={`${id}-screen425µ`}
                      placeholder="Enter +425µ value"
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
          )}

          {selectedSampleType === "Special Sample" && (
            <FormField
              control={form.control}
              name="screen212µ"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor={`${id}-screen212µ`}>+212µ</FormLabel>
                  <FormControl>
                    <Input
                      id={`${id}-screen212µ`}
                      placeholder="Enter +212µ value"
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
          )}

          {selectedSampleType === "Special Sample" && (
            <FormField
              control={form.control}
              name="screen150µ"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor={`${id}-screen150µ`}>+150µ</FormLabel>
                  <FormControl>
                    <Input
                      id={`${id}-screen150µ`}
                      placeholder="Enter +150µ value"
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
          )}

          {selectedSampleType === "Special Sample" && (
            <FormField
              control={form.control}
              name="screen75µ"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor={`${id}-screen75µ`}>+75µ</FormLabel>
                  <FormControl>
                    <Input
                      id={`${id}-screen75µ`}
                      placeholder="Enter +75µ value"
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
          )}

          {selectedSampleType === "Special Sample" && (
            <FormField
              control={form.control}
              name="screen106µ"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor={`${id}-screen106µ`}>+106µ</FormLabel>
                  <FormControl>
                    <Input
                      id={`${id}-screen106µ`}
                      placeholder="Enter +106µ value"
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
          )}

          {selectedSampleType === "Special Sample" && (
            <FormField
              control={form.control}
              name="screen53µ"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor={`${id}-screen53µ`}>+53µ</FormLabel>
                  <FormControl>
                    <Input
                      id={`${id}-screen53µ`}
                      placeholder="Enter +53µ value"
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
          )}

          {selectedSampleType === "Special Sample" && (
            <FormField
              control={form.control}
              name="screen45µ"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor={`${id}-screen45µ`}>+45µ</FormLabel>
                  <FormControl>
                    <Input
                      id={`${id}-screen45µ`}
                      placeholder="Enter +45µ value"
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
          )}

          {selectedSampleType === "Special Sample" && (
            <FormField
              control={form.control}
              name="screen38µ"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor={`${id}-screen38µ`}>+38µ</FormLabel>
                  <FormControl>
                    <Input
                      id={`${id}-screen38µ`}
                      placeholder="Enter +38µ value"
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
          )}

          {selectedSampleType === "Special Sample" && (
            <FormField
              control={form.control}
              name="pan"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor={`${id}-pan`}>Pan</FormLabel>
                  <FormControl>
                    <Input
                      id={`${id}-pan`}
                      placeholder="Enter Pan value"
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
          )}

          <FormField
              control={form.control}
              name="moisture"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor={`${id}-moisture`}>% Moisture</FormLabel>
                  <FormControl>
                    <Input
                      id={`${id}-fe_perc`}
                      placeholder="Enter % Moisture value"
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

