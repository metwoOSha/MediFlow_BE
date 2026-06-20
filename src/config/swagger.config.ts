import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'MediFlow API',
            version: '1.0.0',
            description: 'Medical clinic management API',
        },
        servers: [
            { url: 'http://localhost:3001', description: 'Development' },
            { url: 'https://mediflowbe-production.up.railway.app', description: 'Production' },
        ],
        tags: [
            { name: 'Auth', description: 'Authentication and account management' },
            { name: 'Doctors', description: 'Doctor management' },
            { name: 'Schedules', description: 'Doctor schedule management' },
            { name: 'Slots', description: 'Available appointment slots' },
            { name: 'Specializations', description: 'Medical specialization management' },
            { name: 'Appointments', description: 'Appointment management' },
            { name: 'Patients', description: 'Patient (user) management — admin only' },
            { name: 'Cron', description: 'Internal cron / seed endpoints' },
        ],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'token',
                    description: 'JWT stored in an httpOnly cookie (set on login/register)',
                },
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'An error occurred' },
                    },
                },
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        name: { type: 'string', example: 'John' },
                        surname: { type: 'string', example: 'Doe' },
                        email: { type: 'string', format: 'email', example: 'john@example.com' },
                        role: { type: 'string', enum: ['patient', 'admin'], example: 'patient' },
                    },
                },
                Patient: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        name: { type: 'string', example: 'Jane' },
                        surname: { type: 'string', example: 'Doe' },
                        email: { type: 'string', format: 'email', example: 'jane@example.com' },
                        phone: { type: 'string', nullable: true, example: '+380671234567' },
                        created_at: { type: 'string', format: 'date-time' },
                    },
                },
                Doctor: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        name: { type: 'string', example: 'Anna' },
                        surname: { type: 'string', example: 'Smith' },
                        phone: { type: 'string', nullable: true, example: '+380501234567' },
                        specialization_id: { type: 'string', format: 'uuid', nullable: true },
                        category: { type: 'string', enum: ['first', 'second', 'highest'] },
                        bio: { type: 'string', nullable: true, example: 'Experienced cardiologist' },
                        specialization_name: { type: 'string', nullable: true, example: 'Cardiology' },
                        time_start: { type: 'string', example: '08:00', nullable: true },
                        time_end: { type: 'string', example: '17:00', nullable: true },
                        day_of_week: {
                            type: 'array',
                            nullable: true,
                            items: { type: 'integer', minimum: 1, maximum: 7 },
                            example: [1, 2, 3, 4, 5],
                        },
                    },
                },
                Specialization: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        specialization_name: { type: 'string', example: 'Cardiology' },
                        icon_id: { type: 'integer', nullable: true, example: 1 },
                        color_id: { type: 'integer', nullable: true, example: 3 },
                        doctors_count: { type: 'integer', example: 5 },
                    },
                },
                Appointment: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        date: { type: 'string', format: 'date', example: '2024-06-21' },
                        time: { type: 'string', example: '09:00:00' },
                        status: {
                            type: 'string',
                            enum: ['pending', 'confirmed', 'completed', 'cancelled'],
                            example: 'pending',
                        },
                        user_id: { type: 'string', format: 'uuid' },
                        doctor_id: { type: 'string', format: 'uuid' },
                    },
                },
                AppointmentFull: {
                    allOf: [
                        { $ref: '#/components/schemas/Appointment' },
                        {
                            type: 'object',
                            properties: {
                                patient_name: { type: 'string', example: 'Jane' },
                                patient_surname: { type: 'string', example: 'Doe' },
                                doctor_name: { type: 'string', example: 'Anna' },
                                doctor_surname: { type: 'string', example: 'Smith' },
                                specialization_name: { type: 'string', example: 'Cardiology' },
                            },
                        },
                    ],
                },
                Schedule: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        doctor_id: { type: 'string', format: 'uuid' },
                        day_of_week: { type: 'integer', minimum: 1, maximum: 7, example: 1 },
                        time_start: { type: 'string', example: '08:00' },
                        time_end: { type: 'string', example: '17:00' },
                        slot_duration_minutes: { type: 'integer', example: 30 },
                    },
                },
                Slot: {
                    type: 'object',
                    properties: {
                        time: { type: 'string', example: '09:00' },
                        available: { type: 'boolean', example: true },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.ts', './dist/routes/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
