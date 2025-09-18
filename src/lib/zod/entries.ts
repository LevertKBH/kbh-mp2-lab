import { z } from "zod";

export const entrySchema = z.object({
  id: z.string().optional(),
  date: z.string(),
  plant: z.string(),
  sample_type: z.string(),
  sample_description: z.string(),
  fe_perc: z.string().optional(),
  sio_perc: z.string().optional(),
  al2o3_perc: z.string().optional().default("0"),
  p_perc: z.string().optional(),
  tio_perc: z.string().optional(),
  mgo_perc: z.string().optional(),
  cao_perc: z.string().optional(),
  p2o5_perc: z.string().optional(),
  cu_perc: z.string().optional(),
  screen425µ: z.string().optional(),
  screen212µ: z.string().optional(),
  screen150µ: z.string().optional(),
  screen75µ: z.string().optional(),
  screen106µ: z.string().optional(),
  screen53µ: z.string().optional(),
  screen45µ: z.string().optional(),
  screen38µ: z.string().optional(),
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
