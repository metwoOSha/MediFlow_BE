import { Router } from 'express';
import {
    getDoctors,
    getDoctorById,
    postDoctor,
    deleteDoctorById,
    putDoctorById,
} from '../controllers/doctors.controller.js';
import {
    postScheduleByDoctorId,
    getScheduleByDoctorId,
    deleteScheduleByDoctorId,
} from '../controllers/schedules.controller.js';
import { getSlots } from '../controllers/slots.controller.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateMiddleware } from '../middleware/validateMiddleware.js';
import { createDoctorSchema, updateDoctorSchema } from '../schemas/doctors.schema.js';
import { createScheduleSchema } from '../schemas/schedules.schema.js';

const router = Router();

router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.post('/', authMiddleware, adminMiddleware, validateMiddleware(createDoctorSchema), postDoctor);
router.delete('/:id', authMiddleware, adminMiddleware, deleteDoctorById);
router.put('/:id', authMiddleware, adminMiddleware, validateMiddleware(updateDoctorSchema), putDoctorById);

router.post(
    '/:id/schedule',
    authMiddleware,
    adminMiddleware,
    validateMiddleware(createScheduleSchema),
    postScheduleByDoctorId
);
router.get('/:id/schedule', getScheduleByDoctorId);
router.delete('/:id/schedule', authMiddleware, adminMiddleware, deleteScheduleByDoctorId);

router.get('/:id/slots', getSlots);

export default router;
