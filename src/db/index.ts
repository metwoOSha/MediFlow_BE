import { Pool } from 'pg';
import { DATABASE_URL } from '../config/app.config.js';

const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

export default pool;
