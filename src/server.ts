import express, { type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { swaggerSpec } from './config/swagger.config.js';

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
app.use((req, res, next) => {
    if (req.path.startsWith('/docs')) {
        helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com"],
                    styleSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com"],
                    imgSrc: ["'self'", "data:", "https://unpkg.com"],
                    connectSrc: ["'self'", "https://unpkg.com"],
                    workerSrc: ["'self'", "blob:"],
                },
            },
        })(req, res, next);
    } else {
        helmet()(req, res, next);
    }
});
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

app.get('/docs/json', (_req, res) => {
    res.json(swaggerSpec);
});

app.get('/docs', (_req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>MediFlow API</title>
            <meta charset="utf-8"/>
            <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css">
          </head>
          <body>
            <div id="swagger-ui"></div>
            <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
            <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-standalone-preset.js"></script>
            <script>
              window.onload = function() {
                SwaggerUIBundle({
                  url: '/docs/json',
                  dom_id: '#swagger-ui',
                  presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset],
                  layout: 'BaseLayout'
                });
              };
            </script>
          </body>
        </html>
    `);
});

app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
