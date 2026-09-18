import 'dotenv/config';
import {neon} from "@neondatabase/serverless";

import * as schema from "../database/schema";
import { drizzle } from 'drizzle-orm/neon-http';


const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, {
    schema
})