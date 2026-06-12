import type { Request, Response, NextFunction } from 'express';
import pool from '../db/index.js';

export async function getSpecializations(req: Request, res: Response, next: NextFunction) {
    try {
        const specializations = await pool.query(
            'SELECT s.id, s.specialization_name, s.icon_id, s.color_id, COUNT(d.id)::int as doctors_count FROM specializations s LEFT JOIN doctors d ON d.specialization_id = s.id GROUP BY s.id'
        );

        res.status(200).json(specializations.rows);
    } catch (err) {
        next(err);
    }
}

export async function postSpecialization(req: Request, res: Response, next: NextFunction) {
    try {
        const { specialization_name, icon_id, color_id } = req.body;

        const specialization = await pool.query(
            'INSERT INTO specializations (specialization_name, icon_id, color_id) VALUES($1, $2, $3) RETURNING *',
            [specialization_name, icon_id ?? null, color_id ?? null]
        );

        res.status(201).json(specialization.rows[0]);
    } catch (err) {
        next(err);
    }
}

export async function patchSpecialization(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const whitelist = ['specialization_name', 'icon_id', 'color_id'];
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
            `UPDATE specializations SET ${fields.join(', ')} WHERE id = $${params.length} RETURNING *`,
            params
        );

        if (result.rows.length === 0) return res.status(404).json({ message: 'Specialization not found' });

        res.status(200).json(result.rows[0]);
    } catch (err) {
        next(err);
    }
}

export async function deleteSpecializationById(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;

        const specialization = await pool.query('DELETE FROM specializations WHERE id = $1 RETURNING id', [id]);

        if (specialization.rows.length === 0) return res.status(404).json({ message: 'Specialization not found' });

        res.status(204).send();
    } catch (err) {
        next(err);
    }
}
