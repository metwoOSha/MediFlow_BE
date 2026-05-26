import type { Request, Response, NextFunction } from 'express';
import pool from '../db/index.js';

export async function getSpecializations(req: Request, res: Response, next: NextFunction) {
    try {
        const specializations = await pool.query('SELECT * FROM specializations');

        res.status(200).json(specializations.rows);
    } catch (err) {
        next(err);
    }
}

export async function postSpecialization(req: Request, res: Response, next: NextFunction) {
    try {
        const { specialization_name } = req.body;

        const specialization = await pool.query('INSERT INTO specializations (specialization_name) VALUES($1) RETURNING *', [
            specialization_name,
        ]);

        res.status(201).json(specialization.rows[0]);
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
