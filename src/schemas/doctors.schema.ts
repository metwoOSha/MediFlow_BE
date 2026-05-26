import { z } from 'zod';

export const createDoctorSchema = z.object({
    name: z.string().min(2),
    surname: z.string().min(2),
    phone: z.string().optional(),
    specialization_id: z.string().uuid().optional(),
    category: z.enum(['first', 'second', 'highest']),
    bio: z.string().optional(),
});

export const updateDoctorSchema = createDoctorSchema.partial();
