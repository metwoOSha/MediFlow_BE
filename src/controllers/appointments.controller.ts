import type { Request, Response, NextFunction } from 'express';
import pool from '../db/index.js';

export async function getAllAppointments(req: Request, res: Response, next: NextFunction) {
    try {
        const { date } = req.query as { date?: string };

        const result = await pool.query(
            `SELECT
                appointments.*,
                users.name        AS patient_name,
                users.surname     AS patient_surname,
                doctors.name      AS doctor_name,
                doctors.surname   AS doctor_surname,
                specializations.specialization_name
            FROM appointments
            JOIN users           ON appointments.user_id        = users.id
            JOIN doctors         ON appointments.doctor_id      = doctors.id
            JOIN specializations ON doctors.specialization_id   = specializations.id
            ${date ? 'WHERE appointments.date::date = $1' : ''}
            ORDER BY appointments.time ASC`,
            date ? [date] : [],
        );

        res.status(200).json(result.rows);
    } catch (err) {
        next(err);
    }
}

export async function postAppointments(req: Request, res: Response, next: NextFunction) {
    try {
        const user_id = req.user?.id;

        if (!user_id) return res.status(401).json({ message: 'Unauthorized' });

        const { doctor_id, date, time } = req.body;

        const appointment = await pool.query(
            'INSERT INTO appointments(user_id, doctor_id, date, time) VALUES ($1,$2,$3,$4) RETURNING *',
            [user_id, doctor_id, date, time]
        );

        res.status(201).json(appointment.rows[0]);
    } catch (err) {
        next(err);
    }
}

export async function getMyAppointments(req: Request, res: Response, next: NextFunction) {
    try {
        const user_id = req.user?.id;

        if (!user_id) return res.status(401).json({ message: 'Unauthorized' });

        const appointment = await pool.query('SELECT * FROM appointments WHERE user_id = $1', [user_id]);

        res.status(200).json(appointment.rows);
    } catch (err) {
        next(err);
    }
}

export async function cancelAppointment(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;

        const user_id = req.user?.id;

        if (!user_id) return res.status(401).json({ message: 'Unauthorized' });

        const appointment = await pool.query(
            'UPDATE appointments SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
            ['cancelled', id, user_id]
        );

        if (appointment.rows.length === 0) return res.status(404).json({ message: 'Appointment not found' });

        res.status(200).json(appointment.rows[0]);
    } catch (err) {
        next(err);
    }
}

export async function updateAppointmentStatus(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;
        const { status } = req.body;

        const appointment = await pool.query('UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *', [
            status,
            id,
        ]);

        if (appointment.rows.length === 0) return res.status(404).json({ message: 'Appointment not found' });

        res.status(200).json(appointment.rows[0]);
    } catch (err) {
        next(err);
    }
}
