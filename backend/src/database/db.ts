// import 'dotenv/config';
// import {neon} from "@neondatabase/serverless";

// import * as schema from "../database/schema";
// import { drizzle } from 'drizzle-orm/neon-http';


// const sql = neon(process.env.DATABASE_URL!);

// export const db = drizzle(sql, {
//     schema
// })
import 'dotenv/config';
import { drizzle } from "drizzle-orm/node-postgres";
import {Pool} from "pg"
import * as schema from "./schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.on("connect", () => {
  console.log("Database connected successfully ✅");
});
pool.on("error", (err) => {
  console.error("Database connection error:", err);
});

export const db = drizzle({ client: pool, schema });
