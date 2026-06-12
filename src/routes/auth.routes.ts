import { Router } from 'express';
import { register, login, changePassword } from '../controllers/auth.controller.js';

import { validateMiddleware } from '../middleware/validateMiddleware.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { registerSchema, loginSchema, changePasswordSchema } from '../schemas/auth.schema.js';

const router = Router();

router.post('/register', validateMiddleware(registerSchema), register);
router.post('/login', validateMiddleware(loginSchema), login);
router.patch('/password', authMiddleware, validateMiddleware(changePasswordSchema), changePassword);

export default router;
