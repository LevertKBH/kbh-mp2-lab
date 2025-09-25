import { z } from "zod";

export const entrySchema = z.object({
  id: z.string().optional(),
  date: z.string(),
  hour: z.string(),
  plant: z.string(),
  sample_type: z.string(),
  sample_description: z.string(),
  fe_perc: z.string(),
  sio_perc: z.string(),
  al2o3_perc: z.string().default("0"),
  p_perc: z.string(),
  tio_perc: z.string(),
  mgo_perc: z.string(),
  cao_perc: z.string(),
  p2o5_perc: z.string(),
  cu_perc: z.string(),
  screen425: z.string().optional(),
  screen212: z.string().optional(),
  screen150: z.string().optional(),
  screen75: z.string().optional(),
  screen106: z.string().optional(),
  screen53: z.string().optional(),
  screen45: z.string().optional(),
  screen38: z.string().optional(),
  pan: z.string().optional(),
  moisture: z.string().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type Entry = z.infer<typeof entrySchema>;

export const resolveEntrySchema = z.object({
  end_date: z.string(),
  notes: z.string(),
});
