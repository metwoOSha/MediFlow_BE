import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/app.config.js';

export function createToken(user: { id: string; role: string; name: string; surname: string; email: string }) {
    return jwt.sign(
        { id: user.id, role: user.role, name: user.name, surname: user.surname, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
}
