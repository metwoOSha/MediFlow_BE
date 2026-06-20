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

/**
 * @openapi
 * /doctors:
 *   get:
 *     summary: List all doctors with optional filtering and pagination
 *     tags: [Doctors]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 8
 *         description: Number of results per page
 *       - in: query
 *         name: specialization
 *         schema:
 *           type: string
 *         description: Filter by specialization name (exact match)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [first, second, highest]
 *         description: Filter by doctor category
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or surname (case-insensitive)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [name, category]
 *           default: name
 *         description: Sort field
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort direction
 *     responses:
 *       '200':
 *         description: Paginated list of doctors with schedule info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 doctors:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Doctor'
 *                 total:
 *                   type: integer
 *                   example: 42
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 8
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getDoctors);

/**
 * @openapi
 * /doctors/{id}:
 *   get:
 *     summary: Get a doctor by ID
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Doctor ID
 *     responses:
 *       '200':
 *         description: Doctor record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Doctor'
 *       '404':
 *         description: Doctor not found
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
router.get('/:id', getDoctorById);

/**
 * @openapi
 * /doctors:
 *   post:
 *     summary: Create a new doctor (admin only)
 *     tags: [Doctors]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, surname, category]
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 example: Anna
 *               surname:
 *                 type: string
 *                 minLength: 2
 *                 example: Smith
 *               phone:
 *                 type: string
 *                 example: '+380501234567'
 *               specialization_id:
 *                 type: string
 *                 format: uuid
 *               category:
 *                 type: string
 *                 enum: [first, second, highest]
 *               bio:
 *                 type: string
 *                 example: Experienced cardiologist with 10 years of practice
 *     responses:
 *       '201':
 *         description: Doctor created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Doctor'
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
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', authMiddleware, adminMiddleware, validateMiddleware(createDoctorSchema), postDoctor);

/**
 * @openapi
 * /doctors/{id}:
 *   delete:
 *     summary: Delete a doctor by ID (admin only)
 *     tags: [Doctors]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Doctor ID
 *     responses:
 *       '204':
 *         description: Doctor deleted
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
 *         description: Doctor not found
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
router.delete('/:id', authMiddleware, adminMiddleware, deleteDoctorById);

/**
 * @openapi
 * /doctors/{id}:
 *   put:
 *     summary: Replace a doctor's data (admin only)
 *     tags: [Doctors]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Doctor ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *               surname:
 *                 type: string
 *                 minLength: 2
 *               phone:
 *                 type: string
 *               specialization_id:
 *                 type: string
 *                 format: uuid
 *               category:
 *                 type: string
 *                 enum: [first, second, highest]
 *               bio:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Doctor updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Doctor'
 *       '400':
 *         description: Validation error or no valid fields provided
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
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', authMiddleware, adminMiddleware, validateMiddleware(updateDoctorSchema), putDoctorById);

/**
 * @openapi
 * /doctors/{id}/schedule:
 *   post:
 *     summary: Create a weekly schedule for a doctor (admin only)
 *     description: Inserts one schedule row per day_of_week value with shared time_start, time_end and slot_duration_minutes.
 *     tags: [Schedules]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Doctor ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [day_of_week, time_start, time_end, slot_duration_minutes]
 *             properties:
 *               day_of_week:
 *                 type: array
 *                 items:
 *                   type: integer
 *                   minimum: 1
 *                   maximum: 7
 *                 example: [1, 2, 3, 4, 5]
 *                 description: ISO weekday numbers (1=Monday … 7=Sunday)
 *               time_start:
 *                 type: string
 *                 example: '08:00'
 *               time_end:
 *                 type: string
 *                 example: '17:00'
 *               slot_duration_minutes:
 *                 type: integer
 *                 example: 30
 *     responses:
 *       '201':
 *         description: Schedule entries created
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Schedule'
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
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
    '/:id/schedule',
    authMiddleware,
    adminMiddleware,
    validateMiddleware(createScheduleSchema),
    postScheduleByDoctorId
);

/**
 * @openapi
 * /doctors/{id}/schedule:
 *   get:
 *     summary: Get a doctor's schedule
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Doctor ID
 *     responses:
 *       '200':
 *         description: List of schedule entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Schedule'
 *       '404':
 *         description: No schedule found for this doctor
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
router.get('/:id/schedule', getScheduleByDoctorId);

/**
 * @openapi
 * /doctors/{id}/schedule:
 *   delete:
 *     summary: Delete all schedule entries for a doctor (admin only)
 *     tags: [Schedules]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Doctor ID
 *     responses:
 *       '204':
 *         description: Schedule deleted
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
 *         description: No schedule found for this doctor
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
router.delete('/:id/schedule', authMiddleware, adminMiddleware, deleteScheduleByDoctorId);

/**
 * @openapi
 * /doctors/{id}/slots:
 *   get:
 *     summary: Get available appointment slots for a doctor on a given date
 *     tags: [Slots]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Doctor ID
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: '2024-06-21'
 *         description: Date to check (YYYY-MM-DD)
 *     responses:
 *       '200':
 *         description: List of time slots with availability; empty array when doctor has no schedule that day
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 slots:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Slot'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id/slots', getSlots);

export default router;
