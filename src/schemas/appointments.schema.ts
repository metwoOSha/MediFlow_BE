import { z } from 'zod';

export const createAppointmentSchema = z.object({
    doctor_id: z.string().uuid(),
    date: z.string(),
    time: z.string(),
});

export const updateAppointmentSchema = createAppointmentSchema.partial();
