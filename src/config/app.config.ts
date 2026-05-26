import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 3000;

export const DB_CONFIG = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

export const JWT_SECRET = process.env.JWT_TOKEN as string;
if (!JWT_SECRET) throw new Error('JWT_SECRET is not configured');
