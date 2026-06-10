import { z } from 'zod';

export const createAppointmentSchema = z.object({
    doctor_id: z.string().uuid(),
    user_id: z.string().uuid().optional(),
    date: z.string(),
    time: z.string(),
    status: z.string().optional(),
});

export const updateAppointmentSchema = createAppointmentSchema.partial();

export const updateAppointmentStatusSchema = z.object({
    status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']),
});
