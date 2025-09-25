import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  host: process.env.DATABASE_HOST || "localhost",
  port: Number(process.env.DATABASE_PORT) || 5432,
  user: process.env.DATABASE_USERNAME || "postgres",
  password: String(process.env.DATABASE_PASSWORD || ""),
  database: process.env.DATABASE_NAME || "dbcollab",
});

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Database connected successfully");
    if (client) release();
  }
});

export default pool;
