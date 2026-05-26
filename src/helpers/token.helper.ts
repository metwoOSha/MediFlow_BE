import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/app.config.js';

export function createToken(user: { id: string; role: string }) {
    return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
}
