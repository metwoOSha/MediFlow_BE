import { Router } from 'express';
import {
    postAppointments,
    getMyAppointments,
    cancelAppointment,
    updateAppointmentStatus,
} from '../controllers/appointments.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { validateMiddleware } from '../middleware/validateMiddleware.js';
import { createAppointmentSchema, updateAppointmentSchema } from '../schemas/appointments.schema.js';

const router = Router();

router.post('/', authMiddleware, validateMiddleware(createAppointmentSchema), postAppointments);
router.get('/my', authMiddleware, getMyAppointments);
router.patch('/:id/cancel', authMiddleware, cancelAppointment);
router.patch(
    '/:id/status',
    authMiddleware,
    adminMiddleware,
    validateMiddleware(updateAppointmentSchema),
    updateAppointmentStatus
);

export default router;
