import { pgTable, uuid, text, timestamp, primaryKey, pgEnum, boolean, uniqueIndex, jsonb } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
// Enum for membership roles - PLEASE VERIFY/UPDATE THESE VALUES
export const memberRoleEnum = pgEnum('member_role', ['member', 'admin', 'editor']); // Added 'admin', 'editor' as common roles
export const sites = pgTable('sites', {
    id: uuid('id').primaryKey().default(sql `gen_random_uuid()`),
    name: text('name').notNull(),
    subdomain: text('subdomain'), // Was unique, DB shows it's nullable and no unique constraint directly on column
    owner_id: uuid('owner_id').references(() => users.id), // Maps to owner_id in Supabase
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).default(sql `now()`), // DB has default now()
    state: text('state').default('pending'), // DB has default 'pending'
    status: text('status').default('active'), // New column from DB, varchar in DB, using text here. Default 'active'
    logo_url: text('logo_url'), // Brand logo URL from Brandfetch
    brand_color: text('brand_color'), // Primary brand color from Brandfetch
    content_types: jsonb('content_types').default('[]'), // Array of enabled content types
});
export const users = pgTable('users', {
    id: uuid('id').primaryKey().default(sql `gen_random_uuid()`),
    email: text('email'), // Was unique().notNull(). DB shows it's nullable and not unique. THIS IS A SIGNIFICANT CHANGE.
    full_name: text('full_name'), // Renamed from 'name', was text('name')
    username: text('username').notNull(), // New column from DB
    password: text('password').notNull(), // New column from DB
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).default(sql `now()`), // DB has default now()
});
export const memberships = pgTable('memberships', {
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    siteId: uuid('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
    role: memberRoleEnum('role').notNull().default('member'), // Using pgEnum, DB has 'member_role' type and default 'member'
    joined_at: timestamp('joined_at', { withTimezone: true }).defaultNow().notNull(), // New column from DB
}, (table) => {
    return {
        pk: primaryKey({ columns: [table.userId, table.siteId] })
    };
});
// New Tables based on DB Schema:
export const categories = pgTable('categories', {
    id: uuid('id').primaryKey().default(sql `gen_random_uuid()`),
    name: text('name').notNull(),
    description: text('description'),
    site_id: uuid('site_id').notNull().references(() => sites.id),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp('updated_at', { withTimezone: true }).default(sql `now()`),
});
export const spaces = pgTable('spaces', {
    id: uuid('id').primaryKey().default(sql `gen_random_uuid()`),
    name: text('name').notNull(),
    description: text('description'),
    site_id: uuid('site_id').notNull().references(() => sites.id),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp('updated_at', { withTimezone: true }).default(sql `now()`),
    is_private: boolean('is_private').notNull().default(false),
    cover_image_url: text('cover_image_url'),
    icon_url: text('icon_url'),
});
export const discussions = pgTable('discussions', {
    id: uuid('id').primaryKey().default(sql `gen_random_uuid()`),
    title: text('title').notNull(),
    content: text('content'),
    site_id: uuid('site_id').notNull().references(() => sites.id),
    author_id: uuid('author_id').notNull().references(() => users.id),
    space_id: uuid('space_id').references(() => spaces.id),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp('updated_at', { withTimezone: true }).default(sql `now()`),
});
export const tags = pgTable('tags', {
    id: uuid('id').primaryKey().default(sql `gen_random_uuid()`),
    name: text('name').notNull(), // DB has a unique constraint tags_name_key
    site_id: uuid('site_id').notNull().references(() => sites.id),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp('updated_at', { withTimezone: true }).default(sql `now()`),
}, (table) => {
    return {
        name_unique_idx: uniqueIndex('tags_name_site_id_idx').on(table.name, table.site_id), // Assuming name is unique per site
    };
});
export const discussion_tags = pgTable('discussion_tags', {
    discussion_id: uuid('discussion_id').notNull().references(() => discussions.id, { onDelete: 'cascade' }),
    tag_id: uuid('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
}, (table) => {
    return {
        pk: primaryKey({ columns: [table.discussion_id, table.tag_id] })
    };
});
export const events = pgTable('events', {
    id: uuid('id').primaryKey().default(sql `gen_random_uuid()`),
    name: text('name').notNull(),
    description: text('description'),
    start_time: timestamp('start_time', { withTimezone: true }).notNull(),
    end_time: timestamp('end_time', { withTimezone: true }),
    site_id: uuid('site_id').notNull().references(() => sites.id),
    location: text('location'),
    organizer_id: uuid('organizer_id').references(() => users.id),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp('updated_at', { withTimezone: true }).default(sql `now()`),
});
