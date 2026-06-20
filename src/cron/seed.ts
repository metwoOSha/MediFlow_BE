import { GoogleGenAI } from '@google/genai';
import pool from '../db/index.js';

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
});

export async function seedAppointments() {
    const today = new Date().toISOString().split('T')[0];

    const users = await pool.query('SELECT id FROM users WHERE role = $1', ['patient']);
    const doctors = await pool.query('SELECT id FROM doctors');

    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `Generate 5 random medical appointment times for ${today}. 
        Return only JSON array with fields: time (HH:MM format, between 09:00-17:00), status (pending or confirmed).
        Example: [{"time": "09:30", "status": "confirmed"}]
        Return only JSON, no markdown, no explanation.`,
    });

    const appointments = JSON.parse(response.text!);

    for (const apt of appointments) {
        const user = users.rows[Math.floor(Math.random() * users.rows.length)];
        const doctor = doctors.rows[Math.floor(Math.random() * doctors.rows.length)];

        await pool.query(
            'INSERT INTO appointments (user_id, doctor_id, date, time, status) VALUES ($1, $2, $3, $4, $5)',
            [user.id, doctor.id, today, apt.time, apt.status]
        );
    }

    return { success: true, count: appointments.length };
}
