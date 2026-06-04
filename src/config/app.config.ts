import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 3000;

export const DATABASE_URL = process.env.DATABASE_URL as string;
if (!DATABASE_URL) throw new Error('DATABASE_URL is not configured');

export const JWT_SECRET = process.env.JWT_TOKEN as string;
if (!JWT_SECRET) throw new Error('JWT_SECRET is not configured');
