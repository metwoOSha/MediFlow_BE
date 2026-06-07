import type { Request, Response, NextFunction } from 'express';
import pool from '../db/index.js';

export async function getDoctors(req: Request, res: Response, next: NextFunction) {
    try {
        const { specialization, category, sort, order } = req.query;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 8;
        const offset = (page - 1) * limit;

        const params: unknown[] = [];
        const conditions: string[] = [];

        if (specialization) {
            params.push(specialization);
            conditions.push(`specializations.specialization_name = $${params.length}`);
        }

        if (category) {
            params.push(category);
            conditions.push(`doctors.category = $${params.length}`);
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        const allowedSort = ['name', 'category'];
        const allowedOrder = ['asc', 'desc'];

        const sortField = allowedSort.includes(sort as string) ? (sort as string) : 'name';
        const sortOrder = allowedOrder.includes(order as string) ? (order as string) : 'asc';

        const query = `
            SELECT
                doctors.*,
                specializations.specialization_name,
                MIN(schedules.time_start) AS time_start,
                MAX(schedules.time_end) AS time_end,
                array_agg(schedules.day_of_week ORDER BY schedules.day_of_week) AS day_of_week
            FROM doctors
            LEFT JOIN specializations ON doctors.specialization_id = specializations.id
            LEFT JOIN schedules ON schedules.doctor_id = doctors.id
            ${whereClause}
            GROUP BY doctors.id, specializations.specialization_name
            ORDER BY doctors.${sortField} ${sortOrder}
            LIMIT $${params.length + 1} OFFSET $${params.length + 2}
        `;
        params.push(limit, offset);

        const result = await pool.query(query, params);

        const countQuery = `
            SELECT COUNT(DISTINCT doctors.id)
            FROM doctors
            LEFT JOIN specializations ON doctors.specialization_id = specializations.id
            ${whereClause}
        `;
        const countResult = await pool.query(countQuery, params.slice(0, params.length - 2));

        const total = Number(countResult.rows[0].count);

        res.status(200).json({
            doctors: result.rows,
            total,
            page,
            limit,
        });
    } catch (err) {
        next(err);
    }
}

export async function getDoctorById(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;

        const doctor = await pool.query('SELECT * FROM doctors WHERE id=$1', [id]);

        if (doctor.rows.length === 0) return res.status(404).json({ message: 'Not found' });

        res.status(200).json(doctor.rows[0]);
    } catch (err) {
        next(err);
    }
}

export async function postDoctor(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, surname, phone, specialization_id, category, bio } = req.body;

        const doctor = await pool.query(
            'INSERT INTO doctors (name, surname, phone, specialization_id, category, bio) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, surname, phone, specialization_id, category, bio]
        );

        res.status(201).json(doctor.rows[0]);
    } catch (err) {
        next(err);
    }
}

export async function deleteDoctorById(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;

        const doctor = await pool.query('DELETE FROM doctors WHERE id = $1 RETURNING id', [id]);

        if (doctor.rows.length === 0) return res.status(404).json({ message: 'Doctor not found' });

        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

export async function putDoctorById(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;
        const whitelist = ['name', 'surname', 'phone', 'specialization_id', 'category', 'bio'];
        const fields: string[] = [];
        const params: unknown[] = [];

        Object.entries(req.body).forEach(([key, value]) => {
            if (whitelist.includes(key)) {
                params.push(value);
                fields.push(`${key} = $${params.length}`);
            }
        });

        params.push(id);

        if (fields.length === 0) return res.status(400).json({ message: 'No fields to update' });

        const query = await pool.query(
            `UPDATE doctors SET ${fields.join(', ')} WHERE id = $${params.length} RETURNING *`,
            params
        );

        res.status(200).json(query.rows[0]);
    } catch (err) {
        next(err);
    }
}
