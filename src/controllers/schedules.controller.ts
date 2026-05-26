import type { Request, Response, NextFunction } from 'express';
import pool from '../db/index.js';

export async function postScheduleByDoctorId(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;
        const { day_of_week, time_start, time_end, slot_duration_minutes } = req.body;

        const schedule = await pool.query(
            'INSERT INTO schedules (doctor_id, day_of_week, time_start,time_end, slot_duration_minutes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [id, day_of_week, time_start, time_end, slot_duration_minutes]
        );

        res.status(201).json(schedule.rows[0]);
    } catch (err) {
        next(err);
    }
}

export async function getScheduleByDoctorId(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;

        const schedule = await pool.query('SELECT * FROM schedules WHERE doctor_id = $1', [id]);

        if (schedule.rows.length === 0) return res.status(404).json({ message: 'Not Found' });

        res.status(200).json(schedule.rows);
    } catch (err) {
        next(err);
    }
}

export async function deleteScheduleByDoctorId(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;

        const schedule = await pool.query('DELETE FROM schedules WHERE doctor_id = $1 RETURNING *', [id]);

        if (schedule.rows.length === 0) return res.status(404).json({ message: 'Schedule not found' });

        res.status(204).send();
    } catch (err) {
        next(err);
    }
}
