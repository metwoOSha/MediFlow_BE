import { Router } from 'express';
import { getPatients, postPatient, patchPatient, deletePatient } from '../controllers/users.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';

const router = Router();

/**
 * @openapi
 * /users/patients:
 *   get:
 *     summary: List all patients with pagination (admin only)
 *     tags: [Patients]
 *     security:
 *       - cookieAuth: []
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
 *         description: Results per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, surname or email (case-insensitive)
 *     responses:
 *       '200':
 *         description: Paginated list of patients
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 patients:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Patient'
 *                 total:
 *                   type: integer
 *                   example: 120
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 8
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
router.get('/patients', authMiddleware, adminMiddleware, getPatients);

/**
 * @openapi
 * /users/patients:
 *   post:
 *     summary: Create a patient account (admin only)
 *     tags: [Patients]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, surname, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jane
 *               surname:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jane@example.com
 *               phone:
 *                 type: string
 *                 example: '+380671234567'
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: patient123
 *     responses:
 *       '201':
 *         description: Patient account created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 patient:
 *                   $ref: '#/components/schemas/Patient'
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
 *       '409':
 *         description: Email already in use
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
router.post('/patients', authMiddleware, adminMiddleware, postPatient);

/**
 * @openapi
 * /users/patients/{id}:
 *   patch:
 *     summary: Update a patient's profile (admin only)
 *     tags: [Patients]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Patient ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               surname:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Patient updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 patient:
 *                   $ref: '#/components/schemas/Patient'
 *       '400':
 *         description: No valid fields provided
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
 *         description: Patient not found
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
router.patch('/patients/:id', authMiddleware, adminMiddleware, patchPatient);

/**
 * @openapi
 * /users/patients/{id}:
 *   delete:
 *     summary: Delete a patient account (admin only)
 *     tags: [Patients]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Patient ID
 *     responses:
 *       '204':
 *         description: Patient deleted
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
 *         description: Patient not found
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
router.delete('/patients/:id', authMiddleware, adminMiddleware, deletePatient);

export default router;
