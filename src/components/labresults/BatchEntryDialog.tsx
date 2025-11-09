"use client";

import { useState, useId, useEffect } from "react";
import type { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { api } from "@/trpc/react";
import { entrySchema } from "@/lib/zod/labresults";
import {
  sampleDescriptionValues,
  validateHourValues,
  sampleTypeValues,
  plantValues,
} from "@/constants/entries";

import { Form } from "../ui/form";
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { FormCombobox } from "./entry-form-combobox";
import { Button } from "../ui/button";
import { ResponsiveModal } from "../shared/responsive-modal";

type BatchEntryDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

type EntryData = z.infer<typeof entrySchema>;

export default function BatchEntryDialog({
  isOpen,
  onOpenChange,
}: BatchEntryDialogProps) {
  const id = useId();
  const [step, setStep] = useState(0);
  const [collected, setCollected] = useState<EntryData[]>([]);

  const form = useForm<EntryData>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      hour: validateHourValues[0]!.value,
      sample_type: sampleTypeValues[0]!.value,
      plant: plantValues[0]!.value,
      sample_description: sampleDescriptionValues[0]!.value,
      fe_perc: "",
      sio_perc: "",
      al2o3_perc: "",
      p_perc: "",
      tio_perc: "",
      mgo_perc: "",
      cao_perc: "",
      p2o5_perc: "",
      cu_perc: "",
      moisture: "",
      screen425: "",
      screen212: "",
      screen150: "",
      screen75: "",
      screen106: "",
      screen53: "",
      screen45: "",
      screen38: "",
      pan: "",
      s_perc: "",
      aa_fe_perc: ""
    },
  });

  const utils = api.useUtils();
  const batchMut = api.entries.batchCreateEntries.useMutation({
    onSuccess: () => {
      utils.invalidate();
      toast.success("Batch entries created");
      form.reset();
      setStep(0);
      setCollected([]);
      onOpenChange(false);
    },
    onError: (err) => {
      toast.error("Batch creation failed", {
        description: err instanceof Error ? err.message : String(err),
      });
    },
  });

  const numericFields = [
    "fe_perc",
    "sio_perc",
    "al2o3_perc",
    "p_perc",
    "tio_perc",
    "mgo_perc",
    "cao_perc",
    "p2o5_perc",
    "cu_perc",
    "moisture",
    "s_perc",
    "aa_fe_perc"
  ] as const;

  // Zero out numeric fields if no sample selected
  useEffect(() => {
    const type = form.getValues("sample_type");
    if (type === "NS - No Sample") {
      numericFields.forEach((f) => form.setValue(f, "0"));
    }
  }, [form.watch("sample_type")]);

  const goNext = form.handleSubmit((data) => {
    setCollected((prev) => [...prev, data]);
    const nextIndex = step + 1;
    const nextDesc = sampleDescriptionValues[nextIndex]!.value;
    form.reset({
      date: data.date,
      hour: data.hour,
      sample_type: data.sample_type,
      plant: data.plant,
      sample_description: nextDesc,
      fe_perc: "",
      sio_perc: "",
      al2o3_perc: "",
      p_perc: "",
      tio_perc: "",
      mgo_perc: "",
      cao_perc: "",
      p2o5_perc: "",
      cu_perc: "",
      moisture: "",
      screen425: "",
      screen212: "",
      screen150: "",
      screen75: "",
      screen106: "",
      screen53: "",
      screen45: "",
      screen38: "",
      pan: "",
      s_perc: "",
      aa_fe_perc: ""
    });
    setStep(nextIndex);
  });

  const finish = form.handleSubmit((data) => {
    batchMut.mutate([...collected, data]);
  });

  return (
    <ResponsiveModal
      title={`Sample Description ${step + 1}/${sampleDescriptionValues.length}`}
      description={sampleDescriptionValues[step]!.label}
      hasTrigger={false}
      isOpen={isOpen}
      onOpenChange={(open) => {
        form.reset();
        setStep(0);
        setCollected([]);
        onOpenChange(open);
      }}
    >
      <Form {...form}>
        <form className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel htmlFor={`${id}-date`}>Date</FormLabel>
                <FormControl>
                  <Input
                    id={`${id}-date`}
                    type="date"
                    required
                    disabled={step > 0}
                    {...(field as any)}
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
              <FormItem className="space-y-1">
                <FormLabel>Hour</FormLabel>
                <FormControl>
                  <FormCombobox
                    field={field as any}
                    onSelect={field.onChange}
                    options={validateHourValues}
                    disabled={step > 0}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sample_type"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Sample Type</FormLabel>
                <FormControl>
                  <FormCombobox field={field as any} onSelect={field.onChange} options={sampleTypeValues} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sample_description"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Sample Description</FormLabel>
                <FormControl>
                  <FormCombobox
                    field={field as any}
                    onSelect={field.onChange}
                    options={sampleDescriptionValues}
                    disabled
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
              <FormItem className="space-y-1">
                <FormLabel>Plant</FormLabel>
                <FormControl>
                  <FormCombobox
                    field={field}
                    onSelect={field.onChange}
                    options={plantValues}
                    disabled={step > 0}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Chemical fields */}
          {([
            ["fe_perc", "% Fe"],
            ["sio_perc", "% SiO₂"],
            ...(form.getValues("plant") === "LIO" ? [["al2o3_perc", "% Al₂O₃"]] : []),
            ...(form.getValues("plant") === "SAOB" || form.getValues("plant") === "LIO" || (form.getValues("plant") === "MP2" && form.getValues("sample_type") === "Special Sample")
              ? [["p_perc", "% P"]]
              : []),
            ...(form.getValues("plant") === "MP2" && form.getValues("sample_description") === "Product 1 ( Mags)"
              ? [["aa_fe_perc", "AA Wet Chem % Fe"]]
              : []),
            ["tio_perc", "% TiO₂"],
            ["mgo_perc", "% MgO"],
            ["cao_perc", "% CaO"],
            ...(form.getValues("plant") === "MP2"
              ? [
                  ["p2o5_perc", "% P₂O₅"],
                  ["cu_perc", "% Cu"],
                ]
              : []),
            ...(form.getValues("plant") === "MP2" && form.getValues("sample_type") === "Special Sample"
              ? [["s_perc", "S"]]
              : []),
            ["moisture", "Moisture"],
          ] as const).map(([name, label]) => (
            <FormField
              key={name}
              control={form.control}
              name={name as keyof EntryData}
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel htmlFor={`${id}-${name}`}>{label}</FormLabel>
                  <FormControl>
                    <Input
                      id={`${id}-${name}`}
                      type="text"
                      autoComplete="off"
                      inputMode="decimal"
                      pattern="^\\d{1,2}(\\.\\d{1,2})?$"
                      maxLength={6}
                      placeholder={`Enter ${label}`}
                      disabled={form.getValues("sample_type") === "NS - No Sample"}
                      {...(field as any)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          {/* Screen fields for Special samples */}
          {form.getValues("sample_type") === "Special Sample" &&
            [
              ["screen425", "Screen 425"],
              ["screen212", "Screen 212"],
              ["screen150", "Screen 150"],
              ["screen75", "Screen 75"],
              ["screen106", "Screen 106"],
              ["screen53", "Screen 53"],
              ["screen45", "Screen 45"],
              ["screen38", "Screen 38"],
              ["pan", "Pan"],
            ].map(([name, label]) => (
              <FormField
                key={name}
                control={form.control}
                name={name as keyof EntryData}
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel htmlFor={`${id}-${name}`}>{label}</FormLabel>
                    <FormControl>
                      <Input
                        id={`${id}-${name}`}
                        type="text"
                        autoComplete="off"
                        inputMode="decimal"
                        maxLength={6}
                        placeholder={`Enter ${label}`}
                        disabled={false}
                        {...(field as any)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          <div className="flex space-x-2 pt-4">
            {step < sampleDescriptionValues.length - 1 ? (
              <>
                <Button onClick={goNext}>Next</Button>
                <Button variant="secondary" onClick={finish}>
                  Complete
                </Button>
              </>
            ) : (
              <Button variant="secondary" onClick={finish}>
                Complete
              </Button>
            )}
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  );
}