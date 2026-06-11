import { z } from 'zod';

export const createScheduleSchema = z.object({
    day_of_week: z.array(z.number()),
    time_start: z.string(),
    time_end: z.string(),
    slot_duration_minutes: z.number(),
});

export const updateScheduleSchema = createScheduleSchema.partial();
