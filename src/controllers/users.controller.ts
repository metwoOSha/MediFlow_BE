import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import pool from '../db/index.js';

const PATIENT_FIELDS = 'id, name, surname, email, phone, created_at';

export async function getPatients(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await pool.query(
            `SELECT ${PATIENT_FIELDS} FROM users WHERE role = 'patient' ORDER BY created_at DESC`
        );

        res.status(200).json({ patients: result.rows, total: result.rows.length });
    } catch (err) {
        next(err);
    }
}

export async function postPatient(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, surname, email, phone, password } = req.body;

        const normalizedEmail = email.trim().toLowerCase();

        const existing = await pool.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
        if (existing.rows.length > 0) return res.status(409).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (name, surname, email, phone, password, role)
             VALUES ($1, $2, $3, $4, $5, 'patient')
             RETURNING ${PATIENT_FIELDS}`,
            [name, surname, normalizedEmail, phone ?? null, hashedPassword]
        );

        res.status(201).json({ patient: result.rows[0] });
    } catch (err) {
        next(err);
    }
}

export async function patchPatient(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const whitelist = ['name', 'surname', 'email', 'phone'];
        const fields: string[] = [];
        const params: unknown[] = [];

        for (const [key, value] of Object.entries(req.body)) {
            if (whitelist.includes(key)) {
                params.push(value);
                fields.push(`${key} = $${params.length}`);
            }
        }

        if (fields.length === 0) return res.status(400).json({ message: 'No valid fields to update' });

        params.push(id);

        const result = await pool.query(
            `UPDATE users SET ${fields.join(', ')}
             WHERE id = $${params.length} AND role = 'patient'
             RETURNING ${PATIENT_FIELDS}`,
            params
        );

        if (result.rows.length === 0) return res.status(404).json({ message: 'Patient not found' });

        res.status(200).json({ patient: result.rows[0] });
    } catch (err) {
        next(err);
    }
}

export async function deletePatient(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM users WHERE id = $1 AND role = 'patient' RETURNING id`,
            [id]
        );

        if (result.rows.length === 0) return res.status(404).json({ message: 'Patient not found' });

        res.status(204).send();
    } catch (err) {
        next(err);
    }
}
