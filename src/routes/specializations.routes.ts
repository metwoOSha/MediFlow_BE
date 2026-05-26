import { Router } from 'express';
import {
    getSpecializations,
    postSpecialization,
    deleteSpecializationById,
} from '../controllers/specializations.controller.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateMiddleware } from '../middleware/validateMiddleware.js';
import { createSpecializationSchema } from '../schemas/specializations.schema.js';

const router = Router();

router.get('/', getSpecializations);
router.post('/', authMiddleware, adminMiddleware, validateMiddleware(createSpecializationSchema), postSpecialization);
router.delete('/:id', authMiddleware, adminMiddleware, deleteSpecializationById);

export default router;
