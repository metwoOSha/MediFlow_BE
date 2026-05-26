import { z } from 'zod';

export const createSpecializationSchema = z.object({
    specialization_name: z.string().min(2),
});
