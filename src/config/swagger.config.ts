import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'MediFlow API',
            version: '1.0.0',
            description: 'Medical clinic management API',
        },
        servers: [{ url: 'https://mediflowbe.vercel.app', description: 'Production' }],
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
        paths: {
            '/auth/register': {
                post: {
                    summary: 'Register a new user account',
                    tags: ['Auth'],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['name', 'surname', 'email', 'password'],
                                    properties: {
                                        name: { type: 'string', minLength: 2, example: 'John' },
                                        surname: { type: 'string', minLength: 2, example: 'Doe' },
                                        email: { type: 'string', format: 'email', example: 'john@example.com' },
                                        password: { type: 'string', minLength: 6, example: 'secret123' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        '201': {
                            description: 'User registered; httpOnly auth cookie is set',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: { user: { $ref: '#/components/schemas/User' } },
                                    },
                                },
                            },
                        },
                        '400': {
                            description: 'Validation error',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '409': {
                            description: 'Email already in use',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '500': {
                            description: 'Internal server error',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                    },
                },
            },
            '/auth/login': {
                post: {
                    summary: 'Authenticate a user',
                    tags: ['Auth'],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['email', 'password'],
                                    properties: {
                                        email: { type: 'string', format: 'email', example: 'john@example.com' },
                                        password: { type: 'string', minLength: 6, example: 'secret123' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        '200': {
                            description: 'Login successful; httpOnly auth cookie is set',
                            headers: {
                                'Set-Cookie': {
                                    schema: { type: 'string', example: 'token=eyJ...; HttpOnly; Path=/; SameSite=Lax' },
                                },
                            },
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: { user: { $ref: '#/components/schemas/User' } },
                                    },
                                },
                            },
                        },
                        '400': {
                            description: 'Validation error',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '401': {
                            description: 'Invalid email or password',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '500': {
                            description: 'Internal server error',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                    },
                },
            },
            '/auth/password': {
                patch: {
                    summary: "Change the authenticated user's password",
                    tags: ['Auth'],
                    security: [{ cookieAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['currentPassword', 'newPassword'],
                                    properties: {
                                        currentPassword: { type: 'string', example: 'oldpassword' },
                                        newPassword: { type: 'string', minLength: 6, example: 'newpassword123' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        '200': {
                            description: 'Password changed successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: { ok: { type: 'boolean', example: true } },
                                    },
                                },
                            },
                        },
                        '400': {
                            description: 'Current password is incorrect or validation error',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '401': {
                            description: 'Unauthorized — missing or invalid auth cookie',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '404': {
                            description: 'User not found',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '500': {
                            description: 'Internal server error',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                    },
                },
            },
            '/doctors': {
                get: {
                    summary: 'List all doctors with optional filtering and pagination',
                    tags: ['Doctors'],
                    parameters: [
                        {
                            in: 'query',
                            name: 'page',
                            schema: { type: 'integer', default: 1 },
                            description: 'Page number',
                        },
                        {
                            in: 'query',
                            name: 'limit',
                            schema: { type: 'integer', default: 8 },
                            description: 'Number of results per page',
                        },
                        {
                            in: 'query',
                            name: 'specialization',
                            schema: { type: 'string' },
                            description: 'Filter by specialization name (exact match)',
                        },
                        {
                            in: 'query',
                            name: 'category',
                            schema: { type: 'string', enum: ['first', 'second', 'highest'] },
                            description: 'Filter by doctor category',
                        },
                        {
                            in: 'query',
                            name: 'search',
                            schema: { type: 'string' },
                            description: 'Search by name or surname (case-insensitive)',
                        },
                        {
                            in: 'query',
                            name: 'sort',
                            schema: { type: 'string', enum: ['name', 'category'], default: 'name' },
                            description: 'Sort field',
                        },
                        {
                            in: 'query',
                            name: 'order',
                            schema: { type: 'string', enum: ['asc', 'desc'], default: 'asc' },
                            description: 'Sort direction',
                        },
                    ],
                    responses: {
                        '200': {
                            description: 'Paginated list of doctors with schedule info',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            doctors: { type: 'array', items: { $ref: '#/components/schemas/Doctor' } },
                                            total: { type: 'integer', example: 42 },
                                            page: { type: 'integer', example: 1 },
                                            limit: { type: 'integer', example: 8 },
                                        },
                                    },
                                },
                            },
                        },
                        '500': {
                            description: 'Internal server error',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                    },
                },
                post: {
                    summary: 'Create a new doctor (admin only)',
                    tags: ['Doctors'],
                    security: [{ cookieAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['name', 'surname', 'category'],
                                    properties: {
                                        name: { type: 'string', minLength: 2, example: 'Anna' },
                                        surname: { type: 'string', minLength: 2, example: 'Smith' },
                                        phone: { type: 'string', example: '+380501234567' },
                                        specialization_id: { type: 'string', format: 'uuid' },
                                        category: { type: 'string', enum: ['first', 'second', 'highest'] },
                                        bio: {
                                            type: 'string',
                                            example: 'Experienced cardiologist with 10 years of practice',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        '201': {
                            description: 'Doctor created',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Doctor' } } },
                        },
                        '400': {
                            description: 'Validation error',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '401': {
                            description: 'Unauthorized',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '403': {
                            description: 'Forbidden — admin role required',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '500': {
                            description: 'Internal server error',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                    },
                },
            },
            '/doctors/{id}': {
                get: {
                    summary: 'Get a doctor by ID',
                    tags: ['Doctors'],
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: { type: 'string', format: 'uuid' },
                            description: 'Doctor ID',
                        },
                    ],
                    responses: {
                        '200': {
                            description: 'Doctor record',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Doctor' } } },
                        },
                        '404': {
                            description: 'Doctor not found',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '500': {
                            description: 'Internal server error',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                    },
                },
                put: {
                    summary: "Replace a doctor's data (admin only)",
                    tags: ['Doctors'],
                    security: [{ cookieAuth: [] }],
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: { type: 'string', format: 'uuid' },
                            description: 'Doctor ID',
                        },
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        name: { type: 'string', minLength: 2 },
                                        surname: { type: 'string', minLength: 2 },
                                        phone: { type: 'string' },
                                        specialization_id: { type: 'string', format: 'uuid' },
                                        category: { type: 'string', enum: ['first', 'second', 'highest'] },
                                        bio: { type: 'string' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        '200': {
                            description: 'Doctor updated',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Doctor' } } },
                        },
                        '400': {
                            description: 'Validation error or no valid fields provided',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '401': {
                            description: 'Unauthorized',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '403': {
                            description: 'Forbidden — admin role required',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '500': {
                            description: 'Internal server error',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                    },
                },
                delete: {
                    summary: 'Delete a doctor by ID (admin only)',
                    tags: ['Doctors'],
                    security: [{ cookieAuth: [] }],
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: { type: 'string', format: 'uuid' },
                            description: 'Doctor ID',
                        },
                    ],
                    responses: {
                        '204': { description: 'Doctor deleted' },
                        '401': {
                            description: 'Unauthorized',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '403': {
                            description: 'Forbidden — admin role required',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '404': {
                            description: 'Doctor not found',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '500': {
                            description: 'Internal server error',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                    },
                },
            },
            '/doctors/{id}/schedule': {
                post: {
                    summary: 'Create a weekly schedule for a doctor (admin only)',
                    description:
                        'Inserts one schedule row per day_of_week value with shared time_start, time_end and slot_duration_minutes.',
                    tags: ['Schedules'],
                    security: [{ cookieAuth: [] }],
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: { type: 'string', format: 'uuid' },
                            description: 'Doctor ID',
                        },
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['day_of_week', 'time_start', 'time_end', 'slot_duration_minutes'],
                                    properties: {
                                        day_of_week: {
                                            type: 'array',
                                            items: { type: 'integer', minimum: 1, maximum: 7 },
                                            example: [1, 2, 3, 4, 5],
                                            description: 'ISO weekday numbers (1=Monday … 7=Sunday)',
                                        },
                                        time_start: { type: 'string', example: '08:00' },
                                        time_end: { type: 'string', example: '17:00' },
                                        slot_duration_minutes: { type: 'integer', example: 30 },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        '201': {
                            description: 'Schedule entries created',
                            content: {
                                'application/json': {
                                    schema: { type: 'array', items: { $ref: '#/components/schemas/Schedule' } },
                                },
                            },
                        },
                        '400': {
                            description: 'Validation error',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '401': {
                            description: 'Unauthorized',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '403': {
                            description: 'Forbidden — admin role required',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '500': {
                            description: 'Internal server error',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                    },
                },
                get: {
                    summary: "Get a doctor's schedule",
                    tags: ['Schedules'],
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: { type: 'string', format: 'uuid' },
                            description: 'Doctor ID',
                        },
                    ],
                    responses: {
                        '200': {
                            description: 'List of schedule entries',
                            content: {
                                'application/json': {
                                    schema: { type: 'array', items: { $ref: '#/components/schemas/Schedule' } },
                                },
                            },
                        },
                        '404': {
                            description: 'No schedule found for this doctor',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '500': {
                            description: 'Internal server error',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                    },
                },
                delete: {
                    summary: 'Delete all schedule entries for a doctor (admin only)',
                    tags: ['Schedules'],
                    security: [{ cookieAuth: [] }],
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: { type: 'string', format: 'uuid' },
                            description: 'Doctor ID',
                        },
                    ],
                    responses: {
                        '204': { description: 'Schedule deleted' },
                        '401': {
                            description: 'Unauthorized',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '403': {
                            description: 'Forbidden — admin role required',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '404': {
                            description: 'No schedule found for this doctor',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '500': {
                            description: 'Internal server error',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                    },
                },
            },
            '/doctors/{id}/slots': {
                get: {
                    summary: 'Get available appointment slots for a doctor on a given date',
                    tags: ['Slots'],
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: { type: 'string', format: 'uuid' },
                            description: 'Doctor ID',
                        },
                        {
                            in: 'query',
                            name: 'date',
                            required: true,
                            schema: { type: 'string', format: 'date', example: '2024-06-21' },
                            description: 'Date to check (YYYY-MM-DD)',
                        },
                    ],
                    responses: {
                        '200': {
                            description:
                                'List of time slots with availability; empty array when doctor has no schedule that day',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            slots: { type: 'array', items: { $ref: '#/components/schemas/Slot' } },
                                        },
                                    },
                                },
                            },
                        },
                        '500': {
                            description: 'Internal server error',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                    },
                },
            },
            '/specializations': {
                get: {
                    summary: 'List all medical specializations with doctor count',
                    tags: ['Specializations'],
                    responses: {
                        '200': {
                            description: 'Array of specializations',
                            content: {
                                'application/json': {
                                    schema: { type: 'array', items: { $ref: '#/components/schemas/Specialization' } },
                                },
                            },
                        },
                        '500': {
                            description: 'Internal server error',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                    },
                },
                post: {
                    summary: 'Create a new specialization (admin only)',
                    tags: ['Specializations'],
                    security: [{ cookieAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['specialization_name'],
                                    properties: {
                                        specialization_name: { type: 'string', minLength: 2, example: 'Cardiology' },
                                        icon_id: { type: 'integer', example: 1 },
                                        color_id: { type: 'integer', example: 3 },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        '201': {
                            description: 'Specialization created',
                            content: {
                                'application/json': { schema: { $ref: '#/components/schemas/Specialization' } },
                            },
                        },
                        '400': {
                            description: 'Validation error',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '401': {
                            description: 'Unauthorized',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '403': {
                            description: 'Forbidden — admin role required',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '500': {
                            description: 'Internal server error',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                    },
                },
            },
            '/specializations/{id}': {
                patch: {
                    summary: 'Partially update a specialization (admin only)',
                    tags: ['Specializations'],
                    security: [{ cookieAuth: [] }],
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: { type: 'string', format: 'uuid' },
                            description: 'Specialization ID',
                        },
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        specialization_name: { type: 'string', minLength: 2 },
                                        icon_id: { type: 'integer' },
                                        color_id: { type: 'integer' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        '200': {
                            description: 'Specialization updated',
                            content: {
                                'application/json': { schema: { $ref: '#/components/schemas/Specialization' } },
                            },
                        },
                        '400': {
                            description: 'Validation error or no valid fields provided',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '401': {
                            description: 'Unauthorized',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '403': {
                            description: 'Forbidden — admin role required',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '404': {
                            description: 'Specialization not found',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '500': {
                            description: 'Internal server error',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                    },
                },
                delete: {
                    summary: 'Delete a specialization (admin only)',
                    tags: ['Specializations'],
                    security: [{ cookieAuth: [] }],
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: { type: 'string', format: 'uuid' },
                            description: 'Specialization ID',
                        },
                    ],
                    responses: {
                        '204': { description: 'Specialization deleted' },
                        '401': {
                            description: 'Unauthorized',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '403': {
                            description: 'Forbidden — admin role required',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '404': {
                            description: 'Specialization not found',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '500': {
                            description: 'Internal server error',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                    },
                },
            },
            '/appointments': {
                get: {
                    summary: 'Get all appointments with patient and doctor details (admin only)',
                    tags: ['Appointments'],
                    security: [{ cookieAuth: [] }],
                    parameters: [
                        {
                            in: 'query',
                            name: 'date',
                            schema: { type: 'string', format: 'date', example: '2024-06-21' },
                            description: 'Filter appointments by date (YYYY-MM-DD)',
                        },
                    ],
                    responses: {
                        '200': {
                            description: 'List of appointments sorted by time',
                            content: {
                                'application/json': {
                                    schema: { type: 'array', items: { $ref: '#/components/schemas/AppointmentFull' } },
                                },
                            },
                        },
                        '401': {
                            description: 'Unauthorized',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '403': {
                            description: 'Forbidden — admin role required',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '500': {
                            description: 'Internal server error',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                    },
                },
                post: {
                    summary: 'Book a new appointment',
                    tags: ['Appointments'],
                    security: [{ cookieAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['doctor_id', 'date', 'time'],
                                    properties: {
                                        doctor_id: { type: 'string', format: 'uuid' },
                                        user_id: {
                                            type: 'string',
                                            format: 'uuid',
                                            description:
                                                'Override the patient ID (admin only); defaults to the authenticated user',
                                        },
                                        date: { type: 'string', format: 'date', example: '2024-06-21' },
                                        time: { type: 'string', example: '09:00' },
                                        status: {
                                            type: 'string',
                                            enum: ['pending', 'confirmed', 'completed', 'cancelled'],
                                            description:
                                                'Override the initial status (admin only); defaults to pending',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        '201': {
                            description: 'Appointment created',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Appointment' } } },
                        },
                        '400': {
                            description: 'Validation error',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '401': {
                            description: 'Unauthorized',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '500': {
                            description: 'Internal server error',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                    },
                },
            },
            '/appointments/my': {
                get: {
                    summary: "Get the authenticated user's own appointments",
                    tags: ['Appointments'],
                    security: [{ cookieAuth: [] }],
                    responses: {
                        '200': {
                            description: "List of the current user's appointments",
                            content: {
                                'application/json': {
                                    schema: { type: 'array', items: { $ref: '#/components/schemas/Appointment' } },
                                },
                            },
                        },
                        '401': {
                            description: 'Unauthorized',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '500': {
                            description: 'Internal server error',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                    },
                },
            },
            '/appointments/{id}/cancel': {
                patch: {
                    summary: 'Cancel an appointment (must belong to the authenticated user)',
                    tags: ['Appointments'],
                    security: [{ cookieAuth: [] }],
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: { type: 'string', format: 'uuid' },
                            description: 'Appointment ID',
                        },
                    ],
                    responses: {
                        '200': {
                            description: 'Appointment cancelled',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Appointment' } } },
                        },
                        '401': {
                            description: 'Unauthorized',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '404': {
                            description: 'Appointment not found or does not belong to the authenticated user',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '500': {
                            description: 'Internal server error',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                    },
                },
            },
            '/appointments/{id}/status': {
                patch: {
                    summary: "Update an appointment's status (admin only)",
                    tags: ['Appointments'],
                    security: [{ cookieAuth: [] }],
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: { type: 'string', format: 'uuid' },
                            description: 'Appointment ID',
                        },
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['status'],
                                    properties: {
                                        status: {
                                            type: 'string',
                                            enum: ['pending', 'confirmed', 'completed', 'cancelled'],
                                        },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        '200': {
                            description: 'Appointment status updated',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Appointment' } } },
                        },
                        '400': {
                            description: 'Validation error',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '401': {
                            description: 'Unauthorized',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '403': {
                            description: 'Forbidden — admin role required',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '404': {
                            description: 'Appointment not found',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '500': {
                            description: 'Internal server error',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                    },
                },
            },
            '/users/patients': {
                get: {
                    summary: 'List all patients with pagination (admin only)',
                    tags: ['Patients'],
                    security: [{ cookieAuth: [] }],
                    parameters: [
                        {
                            in: 'query',
                            name: 'page',
                            schema: { type: 'integer', default: 1 },
                            description: 'Page number',
                        },
                        {
                            in: 'query',
                            name: 'limit',
                            schema: { type: 'integer', default: 8 },
                            description: 'Results per page',
                        },
                        {
                            in: 'query',
                            name: 'search',
                            schema: { type: 'string' },
                            description: 'Search by name, surname or email (case-insensitive)',
                        },
                    ],
                    responses: {
                        '200': {
                            description: 'Paginated list of patients',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            patients: {
                                                type: 'array',
                                                items: { $ref: '#/components/schemas/Patient' },
                                            },
                                            total: { type: 'integer', example: 120 },
                                            page: { type: 'integer', example: 1 },
                                            limit: { type: 'integer', example: 8 },
                                        },
                                    },
                                },
                            },
                        },
                        '401': {
                            description: 'Unauthorized',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '403': {
                            description: 'Forbidden — admin role required',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '500': {
                            description: 'Internal server error',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                    },
                },
                post: {
                    summary: 'Create a patient account (admin only)',
                    tags: ['Patients'],
                    security: [{ cookieAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['name', 'surname', 'email', 'password'],
                                    properties: {
                                        name: { type: 'string', example: 'Jane' },
                                        surname: { type: 'string', example: 'Doe' },
                                        email: { type: 'string', format: 'email', example: 'jane@example.com' },
                                        phone: { type: 'string', example: '+380671234567' },
                                        password: { type: 'string', minLength: 6, example: 'patient123' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        '201': {
                            description: 'Patient account created',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: { patient: { $ref: '#/components/schemas/Patient' } },
                                    },
                                },
                            },
                        },
                        '401': {
                            description: 'Unauthorized',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '403': {
                            description: 'Forbidden — admin role required',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '409': {
                            description: 'Email already in use',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '500': {
                            description: 'Internal server error',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                    },
                },
            },
            '/users/patients/{id}': {
                patch: {
                    summary: "Update a patient's profile (admin only)",
                    tags: ['Patients'],
                    security: [{ cookieAuth: [] }],
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: { type: 'string', format: 'uuid' },
                            description: 'Patient ID',
                        },
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        name: { type: 'string' },
                                        surname: { type: 'string' },
                                        email: { type: 'string', format: 'email' },
                                        phone: { type: 'string' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        '200': {
                            description: 'Patient updated',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: { patient: { $ref: '#/components/schemas/Patient' } },
                                    },
                                },
                            },
                        },
                        '400': {
                            description: 'No valid fields provided',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '401': {
                            description: 'Unauthorized',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '403': {
                            description: 'Forbidden — admin role required',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '404': {
                            description: 'Patient not found',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '500': {
                            description: 'Internal server error',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                    },
                },
                delete: {
                    summary: 'Delete a patient account (admin only)',
                    tags: ['Patients'],
                    security: [{ cookieAuth: [] }],
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: { type: 'string', format: 'uuid' },
                            description: 'Patient ID',
                        },
                    ],
                    responses: {
                        '204': { description: 'Patient deleted' },
                        '401': {
                            description: 'Unauthorized',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '403': {
                            description: 'Forbidden — admin role required',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '404': {
                            description: 'Patient not found',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '500': {
                            description: 'Internal server error',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                    },
                },
            },
            '/cron/seed': {
                get: {
                    summary: 'Seed demo appointments (internal use only)',
                    description: 'Requires the `x-cron-secret` header to match the `CRON_SECRET` environment variable.',
                    tags: ['Cron'],
                    parameters: [
                        {
                            in: 'header',
                            name: 'x-cron-secret',
                            required: true,
                            schema: { type: 'string' },
                            description: 'Secret token matching the CRON_SECRET environment variable',
                        },
                    ],
                    responses: {
                        '200': {
                            description: 'Seed completed successfully',
                            content: { 'application/json': { schema: { type: 'object' } } },
                        },
                        '401': {
                            description: 'Missing or invalid cron secret',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                        '500': {
                            description: 'Internal server error',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                        },
                    },
                },
            },
        },
    },
    apis: ['/var/task/src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
