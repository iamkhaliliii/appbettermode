"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.events = exports.discussion_tags = exports.tags = exports.discussions = exports.spaces = exports.categories = exports.memberships = exports.users = exports.sites = exports.memberRoleEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
// Enum for membership roles - PLEASE VERIFY/UPDATE THESE VALUES
exports.memberRoleEnum = (0, pg_core_1.pgEnum)('member_role', ['member', 'admin', 'editor']); // Added 'admin', 'editor' as common roles
exports.sites = (0, pg_core_1.pgTable)('sites', {
    id: (0, pg_core_1.uuid)('id').primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    name: (0, pg_core_1.text)('name').notNull(),
    subdomain: (0, pg_core_1.text)('subdomain'), // Was unique, DB shows it's nullable and no unique constraint directly on column
    owner_id: (0, pg_core_1.uuid)('owner_id').references(() => exports.users.id), // Maps to owner_id in Supabase
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).default((0, drizzle_orm_1.sql) `now()`), // DB has default now()
    state: (0, pg_core_1.text)('state').default('pending'), // DB has default 'pending'
    status: (0, pg_core_1.text)('status').default('active'), // New column from DB, varchar in DB, using text here. Default 'active'
});
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.uuid)('id').primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    email: (0, pg_core_1.text)('email'), // Was unique().notNull(). DB shows it's nullable and not unique. THIS IS A SIGNIFICANT CHANGE.
    full_name: (0, pg_core_1.text)('full_name'), // Renamed from 'name', was text('name')
    username: (0, pg_core_1.text)('username').notNull(), // New column from DB
    password: (0, pg_core_1.text)('password').notNull(), // New column from DB
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).default((0, drizzle_orm_1.sql) `now()`), // DB has default now()
});
exports.memberships = (0, pg_core_1.pgTable)('memberships', {
    userId: (0, pg_core_1.uuid)('user_id').notNull().references(() => exports.users.id, { onDelete: 'cascade' }),
    siteId: (0, pg_core_1.uuid)('site_id').notNull().references(() => exports.sites.id, { onDelete: 'cascade' }),
    role: (0, exports.memberRoleEnum)('role').notNull().default('member'), // Using pgEnum, DB has 'member_role' type and default 'member'
    joined_at: (0, pg_core_1.timestamp)('joined_at', { withTimezone: true }).defaultNow().notNull(), // New column from DB
}, (table) => {
    return {
        pk: (0, pg_core_1.primaryKey)({ columns: [table.userId, table.siteId] })
    };
});
// New Tables based on DB Schema:
exports.categories = (0, pg_core_1.pgTable)('categories', {
    id: (0, pg_core_1.uuid)('id').primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    name: (0, pg_core_1.text)('name').notNull(),
    description: (0, pg_core_1.text)('description'),
    site_id: (0, pg_core_1.uuid)('site_id').notNull().references(() => exports.sites.id),
    created_at: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updated_at: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).default((0, drizzle_orm_1.sql) `now()`),
});
exports.spaces = (0, pg_core_1.pgTable)('spaces', {
    id: (0, pg_core_1.uuid)('id').primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    name: (0, pg_core_1.text)('name').notNull(),
    description: (0, pg_core_1.text)('description'),
    site_id: (0, pg_core_1.uuid)('site_id').notNull().references(() => exports.sites.id),
    created_at: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updated_at: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).default((0, drizzle_orm_1.sql) `now()`),
    is_private: (0, pg_core_1.boolean)('is_private').notNull().default(false),
    cover_image_url: (0, pg_core_1.text)('cover_image_url'),
    icon_url: (0, pg_core_1.text)('icon_url'),
});
exports.discussions = (0, pg_core_1.pgTable)('discussions', {
    id: (0, pg_core_1.uuid)('id').primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    title: (0, pg_core_1.text)('title').notNull(),
    content: (0, pg_core_1.text)('content'),
    site_id: (0, pg_core_1.uuid)('site_id').notNull().references(() => exports.sites.id),
    author_id: (0, pg_core_1.uuid)('author_id').notNull().references(() => exports.users.id),
    space_id: (0, pg_core_1.uuid)('space_id').references(() => exports.spaces.id),
    created_at: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updated_at: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).default((0, drizzle_orm_1.sql) `now()`),
});
exports.tags = (0, pg_core_1.pgTable)('tags', {
    id: (0, pg_core_1.uuid)('id').primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    name: (0, pg_core_1.text)('name').notNull(), // DB has a unique constraint tags_name_key
    site_id: (0, pg_core_1.uuid)('site_id').notNull().references(() => exports.sites.id),
    created_at: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updated_at: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).default((0, drizzle_orm_1.sql) `now()`),
}, (table) => {
    return {
        name_unique_idx: (0, pg_core_1.uniqueIndex)('tags_name_site_id_idx').on(table.name, table.site_id), // Assuming name is unique per site
    };
});
exports.discussion_tags = (0, pg_core_1.pgTable)('discussion_tags', {
    discussion_id: (0, pg_core_1.uuid)('discussion_id').notNull().references(() => exports.discussions.id, { onDelete: 'cascade' }),
    tag_id: (0, pg_core_1.uuid)('tag_id').notNull().references(() => exports.tags.id, { onDelete: 'cascade' }),
}, (table) => {
    return {
        pk: (0, pg_core_1.primaryKey)({ columns: [table.discussion_id, table.tag_id] })
    };
});
exports.events = (0, pg_core_1.pgTable)('events', {
    id: (0, pg_core_1.uuid)('id').primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    name: (0, pg_core_1.text)('name').notNull(),
    description: (0, pg_core_1.text)('description'),
    start_time: (0, pg_core_1.timestamp)('start_time', { withTimezone: true }).notNull(),
    end_time: (0, pg_core_1.timestamp)('end_time', { withTimezone: true }),
    site_id: (0, pg_core_1.uuid)('site_id').notNull().references(() => exports.sites.id),
    location: (0, pg_core_1.text)('location'),
    organizer_id: (0, pg_core_1.uuid)('organizer_id').references(() => exports.users.id),
    created_at: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updated_at: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).default((0, drizzle_orm_1.sql) `now()`),
});
