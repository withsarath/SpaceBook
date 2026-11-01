import 'dotenv/config';
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("connect", () => {
  console.log("Database connected successfully ✅");
});
pool.on("error", (err) => {
  console.warn("Database pool error (safely handled):", err.message);
});

export const db = drizzle({ client: pool, schema });
