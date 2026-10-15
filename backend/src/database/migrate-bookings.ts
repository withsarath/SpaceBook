import 'dotenv/config';
import { Pool } from 'pg';

async function setup() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const query = `
    CREATE TABLE IF NOT EXISTS "bookings" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "workspace_id" uuid NOT NULL REFERENCES "workspaces"("id") ON DELETE CASCADE,
      "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
      "booking_date" varchar(50) NOT NULL,
      "start_time" varchar(20) NOT NULL,
      "end_time" varchar(20) NOT NULL,
      "seats" integer DEFAULT 1 NOT NULL,
      "status" varchar(30) DEFAULT 'confirmed' NOT NULL,
      "notes" varchar(255),
      "created_at" timestamp with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp with time zone DEFAULT now() NOT NULL
    );
  `;

  try {
    await pool.query(query);
    console.log('Bookings table created or already exists ✅');
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await pool.end();
  }
}

setup();
