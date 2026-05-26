import { Pool } from "pg";
import { DB_CONFIG } from "../config/app.config.js";

const pool = new Pool(DB_CONFIG);

pool
  .connect()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Database connection error:", err));

export default pool;
