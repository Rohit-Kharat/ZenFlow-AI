import { z } from 'zod';

export const WellnessLogSchema = z.object({
  moodScore: z.number().min(1).max(10),
  sleepHours: z.number().positive(),
  activity: z.string().optional(),
  notes: z.string().max(500).optional(),
});

export type WellnessLogDTO = z.infer<typeof WellnessLogSchema>;
