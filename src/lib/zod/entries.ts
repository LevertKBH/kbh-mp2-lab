import { z } from "zod";

export const entrySchema = z.object({
  id: z.string().optional(),
  start_date: z.string(),
  end_date: z.string().optional(),
  plant_category: z.string().min(1, "Plant category is required"),
  plant_section: z.string().min(1, "Plant section is required"),
  discipline: z.string().min(1, "Discipline is required"),
  plant_equipment: z.string().min(1, "Plant equipment is required"),
  breakdown_description: z.string().min(1, "Breakdown description is required"),
  notes: z.string().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type Entry = z.infer<typeof entrySchema>;

export const resolveEntrySchema = z.object({
  end_date: z.string(),
  notes: z.string(),
});
