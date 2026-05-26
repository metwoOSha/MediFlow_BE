import type { Request, Response, NextFunction } from 'express';
import pool from '../db/index.js';
import { generateSlots } from '../helpers/slots.helper.js';

export async function getSlots(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;
        const date = req.query.date as string;
        const dayOfWeek = new Date(date).getDay() === 0 ? 7 : new Date(date).getDay();

        const schedule = await pool.query('SELECT * FROM schedules WHERE doctor_id = $1 AND day_of_week = $2', [
            id,
            dayOfWeek,
        ]);

        if (schedule.rows.length === 0) return res.status(200).json({ slots: [] });

        const { time_start, time_end, slot_duration_minutes } = schedule.rows[0];

        const allSlots = generateSlots(time_start, time_end, slot_duration_minutes);

        const taken = await pool.query(
            'SELECT time FROM appointments WHERE doctor_id = $1 AND date = $2 AND status != $3',
            [id, date, 'cancelled']
        );

        const takenTimes = taken.rows.map((item) => item.time.slice(0, 5));

        res.status(200).json({
            slots: allSlots.map((slot) => ({
                time: slot,
                available: !takenTimes.includes(slot),
            })),
        });
    } catch (err) {
        next(err);
    }
}
