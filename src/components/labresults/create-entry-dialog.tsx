"use client";

import { FormCombobox } from "@/components/labresults/entry-form-combobox";
import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  disciplineValues,
  plantEquipmentDescription,
  plantSectionValues,
  sampleDescriptionValues,
  sampleTypeValues,
  plantValues,
  validateHourValues
} from "@/constants/entries";
import { entrySchema } from "@/lib/zod/labresults";
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
      date: new Date().toISOString().slice(0, 10), // 'YYYY-MM-DD'
      hour: "06h00",
      sample_type: "Normal Sample",
      plant: "MP2",
      sample_description: "Plant Feed - Frm CNV -2",
      fe_perc: "",
      sio_perc: "",
      al2o3_perc: "",
      p_perc: "",
      tio_perc: "",
      mgo_perc: "",
      cao_perc: "",
      p2o5_perc: "",
      cu_perc: "",
      screen425: "",
      screen212: "",
      screen150: "",
      screen75: "",
      screen106: "",
      screen53: "",
      screen45: "",
      screen38: "",
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
                        screen425: "",
                        al2o3_perc: "",
                        screen212: "",
                        screen150: "",
                        screen75: "",
                        screen106: "",
                        screen53: "",
                        screen45: "",
                        screen38: "",
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
              name="date"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor={`${id}-date`}>Date</FormLabel>
                  <FormControl>
                    <Input
                      id={`${id}-date`}
                      type="date"
                      required
                      value={field.value || new Date().toISOString().slice(0, 10)}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hour"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-2">
                  <FormLabel>Hour</FormLabel>
                  <FormCombobox
                    field={field}
                    onSelect={field.onChange}
                    options={validateHourValues}
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
                      placeholder="Enter %Fe value"
                      type="text" // Use "text" to get complete control
                      autoComplete="off"
                      required
                      inputMode="decimal"
                      pattern="^\d{1,2}(\.\d{1,2})?$"
                      maxLength={6} // e.g. "99.99"
                      // Custom restriction code:
                      {...field}
                      onChange={e => {
                        const val = e.target.value
                          .replace(/,/g, '')         // Remove all commas
                          .replace(/[^0-9.]/g, '')   // Only keep digits and dots
                          .replace(/(\..*)\./g, '$1'); // Only allow a single "."
                        // Restrict to the format NN.NN:
                        // - only one dot
                        // - at most two digits before and after decimal
                        if (/^\d{0,2}(\.\d{0,2})?$/.test(val) || val === "") {
                          field.onChange(val);
                        }
                      }}
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
                      type="text" // Use "text" to get complete control
                      autoComplete="off"
                      required
                      inputMode="decimal"
                      pattern="^\d{1,2}(\.\d{1,2})?$"
                      maxLength={6} // e.g. "99.99"
                      // Custom restriction code:
                      {...field}
                      onChange={e => {
                        const val = e.target.value
                          .replace(/,/g, '')         // Remove all commas
                          .replace(/[^0-9.]/g, '')   // Only keep digits and dots
                          .replace(/(\..*)\./g, '$1'); // Only allow a single "."
                        // Restrict to the format NN.NN:
                        // - only one dot
                        // - at most two digits before and after decimal
                        if (/^\d{0,2}(\.\d{0,2})?$/.test(val) || val === "") {
                          field.onChange(val);
                        }
                      }}
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
                      type="text" // Use "text" to get complete control
                      autoComplete="off"
                      required
                      inputMode="decimal"
                      pattern="^\d{1,2}(\.\d{1,2})?$"
                      maxLength={6} // e.g. "99.99"
                      // Custom restriction code:
                      {...field}
                      onChange={e => {
                        const val = e.target.value
                          .replace(/,/g, '')         // Remove all commas
                          .replace(/[^0-9.]/g, '')   // Only keep digits and dots
                          .replace(/(\..*)\./g, '$1'); // Only allow a single "."
                        // Restrict to the format NN.NN:
                        // - only one dot
                        // - at most two digits before and after decimal
                        if (/^\d{0,2}(\.\d{0,2})?$/.test(val) || val === "") {
                          field.onChange(val);
                        }
                      }}
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
                      type="text" // Use "text" to get complete control
                      autoComplete="off"
                      required
                      inputMode="decimal"
                      pattern="^\d{1,2}(\.\d{1,2})?$"
                      maxLength={6} // e.g. "99.99"
                      // Custom restriction code:
                      {...field}
                      onChange={e => {
                        const val = e.target.value
                          .replace(/,/g, '')         // Remove all commas
                          .replace(/[^0-9.]/g, '')   // Only keep digits and dots
                          .replace(/(\..*)\./g, '$1'); // Only allow a single "."
                        // Restrict to the format NN.NN:
                        // - only one dot
                        // - at most two digits before and after decimal
                        if (/^\d{0,2}(\.\d{0,2})?$/.test(val) || val === "") {
                          field.onChange(val);
                        }
                      }}
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
                      type="text" // Use "text" to get complete control
                      autoComplete="off"
                      required
                      inputMode="decimal"
                      pattern="^\d{1,2}(\.\d{1,2})?$"
                      maxLength={6} // e.g. "99.99"
                      // Custom restriction code:
                      {...field}
                      onChange={e => {
                        const val = e.target.value
                          .replace(/,/g, '')         // Remove all commas
                          .replace(/[^0-9.]/g, '')   // Only keep digits and dots
                          .replace(/(\..*)\./g, '$1'); // Only allow a single "."
                        // Restrict to the format NN.NN:
                        // - only one dot
                        // - at most two digits before and after decimal
                        if (/^\d{0,2}(\.\d{0,2})?$/.test(val) || val === "") {
                          field.onChange(val);
                        }
                      }}
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
                      type="text" // Use "text" to get complete control
                      autoComplete="off"
                      required
                      inputMode="decimal"
                      pattern="^\d{1,2}(\.\d{1,2})?$"
                      maxLength={6} // e.g. "99.99"
                      // Custom restriction code:
                      {...field}
                      onChange={e => {
                        const val = e.target.value
                          .replace(/,/g, '')         // Remove all commas
                          .replace(/[^0-9.]/g, '')   // Only keep digits and dots
                          .replace(/(\..*)\./g, '$1'); // Only allow a single "."
                        // Restrict to the format NN.NN:
                        // - only one dot
                        // - at most two digits before and after decimal
                        if (/^\d{0,2}(\.\d{0,2})?$/.test(val) || val === "") {
                          field.onChange(val);
                        }
                      }}
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
                      placeholder="Enter %CaO value"
                      type="text" // Use "text" to get complete control
                      autoComplete="off"
                      required
                      inputMode="decimal"
                      pattern="^\d{1,2}(\.\d{1,2})?$"
                      maxLength={6} // e.g. "99.99"
                      // Custom restriction code:
                      {...field}
                      onChange={e => {
                        const val = e.target.value
                          .replace(/,/g, '')         // Remove all commas
                          .replace(/[^0-9.]/g, '')   // Only keep digits and dots
                          .replace(/(\..*)\./g, '$1'); // Only allow a single "."
                        // Restrict to the format NN.NN:
                        // - only one dot
                        // - at most two digits before and after decimal
                        if (/^\d{0,2}(\.\d{0,2})?$/.test(val) || val === "") {
                          field.onChange(val);
                        }
                      }}
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
                      placeholder="Enter %P2O5 value"
                      type="text" // Use "text" to get complete control
                      autoComplete="off"
                      required
                      inputMode="decimal"
                      pattern="^\d{1,2}(\.\d{1,2})?$"
                      maxLength={6} // e.g. "99.99"
                      // Custom restriction code:
                      {...field}
                      onChange={e => {
                        const val = e.target.value
                          .replace(/,/g, '')         // Remove all commas
                          .replace(/[^0-9.]/g, '')   // Only keep digits and dots
                          .replace(/(\..*)\./g, '$1'); // Only allow a single "."
                        // Restrict to the format NN.NN:
                        // - only one dot
                        // - at most two digits before and after decimal
                        if (/^\d{0,2}(\.\d{0,2})?$/.test(val) || val === "") {
                          field.onChange(val);
                        }
                      }}
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
                      placeholder="Enter %Cu value"
                      type="text" // Use "text" to get complete control
                      autoComplete="off"
                      required
                      inputMode="decimal"
                      pattern="^\d{1,2}(\.\d{1,2})?$"
                      maxLength={6} // e.g. "99.99"
                      // Custom restriction code:
                      {...field}
                      onChange={e => {
                        const val = e.target.value
                          .replace(/,/g, '')         // Remove all commas
                          .replace(/[^0-9.]/g, '')   // Only keep digits and dots
                          .replace(/(\..*)\./g, '$1'); // Only allow a single "."
                        // Restrict to the format NN.NN:
                        // - only one dot
                        // - at most two digits before and after decimal
                        if (/^\d{0,2}(\.\d{0,2})?$/.test(val) || val === "") {
                          field.onChange(val);
                        }
                      }}
                />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />)}

          {selectedSampleType === "Special Sample" && (
            <FormField
              control={form.control}
              name="screen425"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor={`${id}-screen425`}>+425µ</FormLabel>
                  <FormControl>
                    <Input
                      id={`${id}-screen425`}
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
              name="screen212"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor={`${id}-screen212µ`}>+212µ</FormLabel>
                  <FormControl>
                    <Input
                      id={`${id}-screen212`}
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
              name="screen150"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor={`${id}-screen150µ`}>+150µ</FormLabel>
                  <FormControl>
                    <Input
                      id={`${id}-screen150`}
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

          {selectedSampleType === "Special Sample" && selectedPlant != "MP2" && (
            <FormField
              control={form.control}
              name="screen106"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor={`${id}-screen106`}>+106µ</FormLabel>
                  <FormControl>
                    <Input
                      id={`${id}-screen106`}
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
              name="screen75"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor={`${id}-screen75`}>+75µ</FormLabel>
                  <FormControl>
                    <Input
                      id={`${id}-screen75`}
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
              name="screen53"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor={`${id}-screen53`}>+53µ</FormLabel>
                  <FormControl>
                    <Input
                      id={`${id}-screen53`}
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
              name="screen45"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor={`${id}-screen45`}>+45µ</FormLabel>
                  <FormControl>
                    <Input
                      id={`${id}-screen45`}
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
              name="screen38"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor={`${id}-screen38`}>+38µ</FormLabel>
                  <FormControl>
                    <Input
                      id={`${id}-screen38`}
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
                        id={`${id}-moisture`}
                        placeholder="Enter %Moisture value"
                        type="text" // Use "text" to get complete control
                        autoComplete="off"
                        required
                        inputMode="decimal"
                        pattern="^\d{1,2}(\.\d{1,2})?$"
                        maxLength={6} // e.g. "99.99"
                        // Custom restriction code:
                        {...field}
                        onChange={e => {
                          const val = e.target.value
                            .replace(/,/g, '')         // Remove all commas
                            .replace(/[^0-9.]/g, '')   // Only keep digits and dots
                            .replace(/(\..*)\./g, '$1'); // Only allow a single "."
                          // Restrict to the format NN.NN:
                          // - only one dot
                          // - at most two digits before and after decimal
                          if (/^\d{0,2}(\.\d{0,2})?$/.test(val) || val === "") {
                            field.onChange(val);
                          }
                        }}
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
            Add Lab Result
          </Button>
        </form>
      </Form>
    </ResponsiveModal>
  );
}

