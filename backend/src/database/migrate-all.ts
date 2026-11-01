import 'dotenv/config';
import { Pool } from 'pg';

async function setup() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    // Create enums
    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE role_name AS ENUM ('customer', 'owner', 'admin');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE owner_application_status AS ENUM ('pending', 'approved', 'rejected');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar(100) NOT NULL,
        "email" varchar(255) UNIQUE NOT NULL,
        "password_hash" varchar(255) NOT NULL,
        "phone" varchar(20),
        "is_active" varchar(10) DEFAULT 'true' NOT NULL,
        "refresh_token_hash" varchar(255),
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `);

    // Roles table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "roles" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" role_name NOT NULL UNIQUE
      );
    `);

    // User roles table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "user_roles" (
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "role_id" uuid NOT NULL REFERENCES "roles"("id") ON DELETE CASCADE,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        PRIMARY KEY ("user_id", "role_id")
      );
    `);

    // Owner applications table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "owner_applications" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "business_name" varchar(150) NOT NULL,
        "description" varchar(255) NOT NULL,
        "reason" varchar(255) NOT NULL,
        "status" owner_application_status DEFAULT 'pending' NOT NULL,
        "reviewed_by" uuid REFERENCES "users"("id") ON DELETE SET NULL,
        "reviewed_at" timestamp with time zone,
        "rejection_reason" varchar(255),
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `);

    // Workspaces table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "workspaces" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "owner_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "name" varchar(150) NOT NULL,
        "description" varchar(255) NOT NULL,
        "address" varchar(255) NOT NULL,
        "city" varchar(150) NOT NULL,
        "country" varchar(255) NOT NULL,
        "amenities" jsonb DEFAULT '[]'::jsonb NOT NULL,
        "image_url" varchar(500),
        "is_active" boolean DEFAULT true NOT NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `);

    // Bookings table
    await pool.query(`
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
    `);

    // Seed default roles
    await pool.query(`
      INSERT INTO "roles" ("name") VALUES ('customer'), ('owner'), ('admin')
      ON CONFLICT ("name") DO NOTHING;
    `);

    console.log('All tables created successfully ✅');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setup();
