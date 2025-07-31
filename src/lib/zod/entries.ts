import { z } from "zod";

export const entrySchema = z.object({
  id: z.string().optional(),
  date: z.string(),
  sample_description: z.string(),
  fe_perc: z.string().optional(),
  sio_perc: z.string().optional(),
  tio_perc: z.string().optional(),
  mgo_perc: z.string().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type Entry = z.infer<typeof entrySchema>;

export const resolveEntrySchema = z.object({
  end_date: z.string(),
  notes: z.string(),
});
