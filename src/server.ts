import express, { type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import { PORT } from './config/app.config.js';
import loggerMiddleware from './middleware/loggerMiddleware.js';
import errorMiddleware from './middleware/errorMiddleware.js';

import authRoutes from './routes/auth.routes.js';
import doctorsRoutes from './routes/doctors.routes.js';
import specializationsRoutes from './routes/specializations.routes.js';
import appointmentsRoutes from './routes/appointments.routes.js';
import usersRoutes from './routes/users.routes.js';

import cronRoutes from './routes/cron.routes.js';

import './cron/appointments.cron.js';

const app = express();
app.use(loggerMiddleware);
app.use(cookieParser());
app.use(helmet());
app.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        credentials: true,
    })
);
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/doctors', doctorsRoutes);
app.use('/specializations', specializationsRoutes);
app.use('/appointments', appointmentsRoutes);
app.use('/users', usersRoutes);

app.use('/cron', cronRoutes);

app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
