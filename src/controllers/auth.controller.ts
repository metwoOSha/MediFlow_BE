import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import pool from '../db/index.js';

import { createToken } from '../helpers/token.helper.js';

export async function register(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, surname, email, password } = req.body;

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await pool.query('SELECT email FROM users WHERE email = $1', [normalizedEmail]);

        if (existingUser.rows.length > 0) return res.status(409).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await pool.query(
            'INSERT INTO users(name, surname, email, password) VALUES($1, $2, $3, $4) RETURNING id, name, surname, email, role',
            [name, surname, normalizedEmail, hashedPassword]
        );

        const token = createToken(user.rows[0]);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({ user: user.rows[0] });
    } catch (err) {
        next(err);
    }
}

export async function changePassword(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.user as { id: string };
        const { currentPassword, newPassword } = req.body;

        const user = await pool.query('SELECT password FROM users WHERE id = $1', [id]);
        if (user.rows.length === 0) return res.status(404).json({ message: 'User not found' });

        const valid = await bcrypt.compare(currentPassword, user.rows[0].password);
        if (!valid) return res.status(400).json({ message: 'Current password is incorrect' });

        const hashed = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashed, id]);

        res.status(200).json({ ok: true });
    } catch (err) {
        next(err);
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;

        const normalizedEmail = email.trim().toLowerCase();

        const user = await pool.query('SELECT id, name, surname, email, password, role FROM users WHERE email = $1', [
            normalizedEmail,
        ]);

        if (user.rows.length === 0) return res.status(401).json({ message: 'Invalid email or password' });

        const valid = await bcrypt.compare(password, user.rows[0].password);

        if (!valid) return res.status(401).json({ message: 'Invalid email or password' });

        const token = createToken(user.rows[0]);

        const { password: _, ...safeUser } = user.rows[0];
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({ user: safeUser });
    } catch (err) {
        next(err);
    }
}
