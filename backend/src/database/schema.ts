import { primaryKey } from 'drizzle-orm/pg-core';
import { pgEnum } from 'drizzle-orm/pg-core';
import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

// enums
export const roleNameEnum = pgEnum('role_name', ['customer', 'owner', 'admin']);
export const ownerApplicationStatusEnum = pgEnum('owner_application_status', [
  'pending',
  'approved',
  'rejected',
]);

// users table
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  isActive: varchar('is_active', { length: 10 }).notNull().default('true'),
  refreshTokenHash: varchar('refresh_token_hash', { length: 255 }),
  createdAt: timestamp('created_at', {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

//roles table
export const roles = pgTable('roles', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: roleNameEnum('name').notNull().unique(),
});

// user roles tables
export const userRoles = pgTable(
  'user_roles',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    roleId: uuid('role_id')
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.userId, table.roleId],
    }),
  ],
);
// owner-application table
export const ownerApplications = pgTable('owner_applications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  businessName: varchar('business_name', { length: 150 }).notNull(),
  description: varchar('description', { length: 255 }).notNull(),
  reason: varchar('reason', { length: 255 }).notNull(),
  status: ownerApplicationStatusEnum('status').notNull().default('pending'),
  reviewedBy: uuid('reviewed_by').references(() => users.id, {
    onDelete: 'set null',
  }),
  reviewedAt: timestamp('reviewed_at', {
    withTimezone: true,
  }),
  rejectionReason: varchar('rejection_reason', { length: 255 }),
  createdAt: timestamp('created_at', {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});
