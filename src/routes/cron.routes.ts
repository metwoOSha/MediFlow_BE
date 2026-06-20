import { Router } from 'express';
import { seedAppointments } from '../cron/seed.js';

const router = Router();

router.get('/seed', async (req, res, next) => {
    try {
        const secret = req.headers['x-cron-secret'];

        if (secret !== process.env.CRON_SECRET) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const result = await seedAppointments();
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
});

export default router;
