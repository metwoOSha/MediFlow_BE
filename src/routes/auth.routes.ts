import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';

import { validateMiddleware } from '../middleware/validateMiddleware.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';

const router = Router();

router.post('/register', validateMiddleware(registerSchema), register);
router.post('/login', validateMiddleware(loginSchema), login);

export default router;
