import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/app.config.js';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };

        req.user = decoded;

        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
}
