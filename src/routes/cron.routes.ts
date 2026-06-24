import { Router } from 'express';
import { seedAppointments } from '../cron/seed.js';

const router = Router();

/**
 * @openapi
 * /cron/seed:
 *   get:
 *     summary: Seed demo appointments (internal use only)
 *     description: Requires the `x-cron-secret` header to match the `CRON_SECRET` environment variable.
 *     tags: [Cron]
 *     parameters:
 *       - in: header
 *         name: x-cron-secret
 *         required: true
 *         schema:
 *           type: string
 *         description: Secret token matching the CRON_SECRET environment variable
 *     responses:
 *       '200':
 *         description: Seed completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       '401':
 *         description: Missing or invalid cron secret
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/seed', async (req, res, next) => {
    try {
        const secret = req.headers['x-cron-secret'];
        const isVercelCron = req.headers['x-vercel-cron'] === '1';

        if (!isVercelCron && secret !== process.env.CRON_SECRET) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const result = await seedAppointments();
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
});

export default router;
