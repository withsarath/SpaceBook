import 'dotenv/config';
import { drizzle } from "drizzle-orm/node-postgres";
import {Pool} from "pg"
import * as schema from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10, // Avoid holding too many open sockets
  idleTimeoutMillis: 20000, // Close idle clients after 20s before Neon kills them
  connectionTimeoutMillis: 30000, // Timeout fast if unreachable
  keepAlive: true, // Send TCP keepalive packets to prevent Neon from dropping
});

// pool.on("connect", () => {
//   console.log("Database connected successfully ✅");
// });
// pool.on("error", (err) => {
//   console.error("Database connection error:", err);
// });
pool.on("error", (err) => {
  // Catch background drops so the node process doesn't crash on pooler disconnects
  console.warn("Neon pooler dropped an idle client (safely handled):", err.message);
});

export const db = drizzle({ client: pool, schema });
