import { Router } from 'express';
import {
    postAppointments,
    getMyAppointments,
    cancelAppointment,
    updateAppointmentStatus,
    getAllAppointments,
} from '../controllers/appointments.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { validateMiddleware } from '../middleware/validateMiddleware.js';
import { createAppointmentSchema, updateAppointmentSchema, updateAppointmentStatusSchema } from '../schemas/appointments.schema.js';

const router = Router();

router.get('/', authMiddleware, adminMiddleware, getAllAppointments);
router.post('/', authMiddleware, validateMiddleware(createAppointmentSchema), postAppointments);
router.get('/my', authMiddleware, getMyAppointments);
router.patch('/:id/cancel', authMiddleware, cancelAppointment);
router.patch(
    '/:id/status',
    authMiddleware,
    adminMiddleware,
    validateMiddleware(updateAppointmentStatusSchema),
    updateAppointmentStatus
);

export default router;
