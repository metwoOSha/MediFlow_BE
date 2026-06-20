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

/**
 * @openapi
 * /appointments:
 *   get:
 *     summary: Get all appointments with patient and doctor details (admin only)
 *     tags: [Appointments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *           example: '2024-06-21'
 *         description: Filter appointments by date (YYYY-MM-DD)
 *     responses:
 *       '200':
 *         description: List of appointments sorted by time
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AppointmentFull'
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '403':
 *         description: Forbidden — admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', authMiddleware, adminMiddleware, getAllAppointments);

/**
 * @openapi
 * /appointments:
 *   post:
 *     summary: Book a new appointment
 *     tags: [Appointments]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [doctor_id, date, time]
 *             properties:
 *               doctor_id:
 *                 type: string
 *                 format: uuid
 *               user_id:
 *                 type: string
 *                 format: uuid
 *                 description: Override the patient ID (admin only); defaults to the authenticated user
 *               date:
 *                 type: string
 *                 format: date
 *                 example: '2024-06-21'
 *               time:
 *                 type: string
 *                 example: '09:00'
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, completed, cancelled]
 *                 description: Override the initial status (admin only); defaults to pending
 *     responses:
 *       '201':
 *         description: Appointment created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       '400':
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', authMiddleware, validateMiddleware(createAppointmentSchema), postAppointments);

/**
 * @openapi
 * /appointments/my:
 *   get:
 *     summary: Get the authenticated user's own appointments
 *     tags: [Appointments]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: List of the current user's appointments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/my', authMiddleware, getMyAppointments);

/**
 * @openapi
 * /appointments/{id}/cancel:
 *   patch:
 *     summary: Cancel an appointment (must belong to the authenticated user)
 *     tags: [Appointments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Appointment ID
 *     responses:
 *       '200':
 *         description: Appointment cancelled
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Appointment not found or does not belong to the authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/:id/cancel', authMiddleware, cancelAppointment);

/**
 * @openapi
 * /appointments/{id}/status:
 *   patch:
 *     summary: Update an appointment's status (admin only)
 *     tags: [Appointments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Appointment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, completed, cancelled]
 *     responses:
 *       '200':
 *         description: Appointment status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       '400':
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '403':
 *         description: Forbidden — admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Appointment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch(
    '/:id/status',
    authMiddleware,
    adminMiddleware,
    validateMiddleware(updateAppointmentStatusSchema),
    updateAppointmentStatus
);

export default router;
