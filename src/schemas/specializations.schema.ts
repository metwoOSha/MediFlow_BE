import { z } from 'zod';

export const createSpecializationSchema = z.object({
    specialization_name: z.string().min(2),
    icon_id: z.number().optional(),
    color_id: z.number().optional(),
});

export const updateSpecializationSchema = createSpecializationSchema.partial();
