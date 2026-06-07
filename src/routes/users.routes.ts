import { Router } from 'express';
import { getPatients, postPatient, patchPatient, deletePatient } from '../controllers/users.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';

const router = Router();

router.get('/patients', authMiddleware, adminMiddleware, getPatients);
router.post('/patients', authMiddleware, adminMiddleware, postPatient);
router.patch('/patients/:id', authMiddleware, adminMiddleware, patchPatient);
router.delete('/patients/:id', authMiddleware, adminMiddleware, deletePatient);

export default router;
