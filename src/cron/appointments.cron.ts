import cron from 'node-cron';
import pool from '../db/index.js';

cron.schedule('*/15 * * * *', async () => {
    await pool.query(`
        UPDATE appointments 
        SET status = 'completed'
        WHERE status = 'confirmed'
        AND (date + time) < NOW()
    `);
});
