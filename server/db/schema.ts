import { pgTable, serial, text, varchar, timestamp, integer, boolean } from 'drizzle-orm/pg-core';

export const sites = pgTable('sites', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  subdomain: varchar('subdomain', { length: 256 }).unique(),
  status: varchar('status', { length: 50 }).default('pending'), // e.g., 'active', 'inactive', 'pending'
  memberCount: integer('member_count').default(0),
  // userId: varchar('user_id').notNull(), // If sites are linked to users
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastActivityAt: timestamp('last_activity_at'),
  // Add any other fields you need from your Site type:
  // locked: boolean('locked').default(false),
  // cmsModel: varchar('cms_model'),
  // etc.
});
