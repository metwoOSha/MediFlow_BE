import { Router } from 'express';
import {
    getSpecializations,
    postSpecialization,
    patchSpecialization,
    deleteSpecializationById,
} from '../controllers/specializations.controller.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateMiddleware } from '../middleware/validateMiddleware.js';
import { createSpecializationSchema, updateSpecializationSchema } from '../schemas/specializations.schema.js';

const router = Router();

/**
 * @openapi
 * /specializations:
 *   get:
 *     summary: List all medical specializations with doctor count
 *     tags: [Specializations]
 *     responses:
 *       '200':
 *         description: Array of specializations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Specialization'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getSpecializations);

/**
 * @openapi
 * /specializations:
 *   post:
 *     summary: Create a new specialization (admin only)
 *     tags: [Specializations]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [specialization_name]
 *             properties:
 *               specialization_name:
 *                 type: string
 *                 minLength: 2
 *                 example: Cardiology
 *               icon_id:
 *                 type: integer
 *                 example: 1
 *               color_id:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       '201':
 *         description: Specialization created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Specialization'
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
router.post('/', authMiddleware, adminMiddleware, validateMiddleware(createSpecializationSchema), postSpecialization);

/**
 * @openapi
 * /specializations/{id}:
 *   patch:
 *     summary: Partially update a specialization (admin only)
 *     tags: [Specializations]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Specialization ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               specialization_name:
 *                 type: string
 *                 minLength: 2
 *               icon_id:
 *                 type: integer
 *               color_id:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Specialization updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Specialization'
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
 *       '404':
 *         description: Specialization not found
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
router.patch('/:id', authMiddleware, adminMiddleware, validateMiddleware(updateSpecializationSchema), patchSpecialization);

/**
 * @openapi
 * /specializations/{id}:
 *   delete:
 *     summary: Delete a specialization (admin only)
 *     tags: [Specializations]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Specialization ID
 *     responses:
 *       '204':
 *         description: Specialization deleted
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
 *         description: Specialization not found
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
router.delete('/:id', authMiddleware, adminMiddleware, deleteSpecializationById);

export default router;
