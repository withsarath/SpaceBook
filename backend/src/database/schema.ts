import { primaryKey } from 'drizzle-orm/pg-core';
import { pgEnum } from 'drizzle-orm/pg-core';
import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const roleNameEnum = pgEnum('role_name', ['customer', 'owner', 'admin']);

// users table
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  isActive: varchar('is_active', { length: 10 }).notNull().default('true'),
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

export const roles = pgTable('roles', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: roleNameEnum('name').notNull().unique(),
});

export const userRoles = pgTable('user_roles', {
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
}, (table)=>[
    primaryKey({
        columns: [table.userId, table.roleId]
    })
]);
