import { pgTable, uuid, text, timestamp, varchar, primaryKey, pgEnum, boolean, uniqueIndex, jsonb, integer } from 'drizzle-orm/pg-core';
import { sql, InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { relations } from 'drizzle-orm';

// Enum for membership roles
export const memberRoleEnum = pgEnum('member_role', ['member', 'admin', 'editor']);

// Enum for content status - updated to include all required statuses
export const contentStatusEnum = pgEnum('content_status', ['draft', 'published', 'archived', 'scheduled', 'pending_review']);

// Enum for site plan
export const sitePlanEnum = pgEnum('site_plan', ['lite', 'pro']);

// First create a new enum for space visibility
export const spaceVisibilityEnum = pgEnum('space_visibility', ['public', 'private', 'paid']);

// Enum for CMS type category
export const cmsTypeCategoryEnum = pgEnum('cms_type_category', ['official', 'custom']);

// Common tables
export const sites = pgTable('sites', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  subdomain: text('subdomain'),
  owner_id: uuid('owner_id'), // Will reference users.id
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).default(sql`now()`),
  status: text('status').default('active'),
  plan: sitePlanEnum('plan').default('lite'),
  logo_url: text('logo_url'),
  brand_color: text('brand_color'),
  content_types: jsonb('content_types').default('[]'),
  space_ids: jsonb('space_ids').default('[]'), // Store space IDs related to this site
});

export const users = pgTable('users', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  email: text('email'),
  full_name: text('full_name'),
  username: text('username').notNull(),
  password: text('password').notNull(),
  avatar_url: text('avatar_url'),
  bio: text('bio'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).default(sql`now()`),
});

// Set up the references after table definitions
export const sitesRelations = relations(sites, ({ one }) => ({
  owner: one(users, {
    fields: [sites.owner_id],
    references: [users.id],
  }),
}));

export const memberships = pgTable('memberships', {
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  siteId: uuid('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
  role: memberRoleEnum('role').notNull().default('member'),
  joined_at: timestamp('joined_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.userId, table.siteId] })
  };
});

export const spaces = pgTable('spaces', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  description: text('description'),
  creator_id: uuid('creator_id').references(() => users.id),
  site_id: uuid('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).default(sql`now()`),
  hidden: boolean('hidden').default(false),
  visibility: spaceVisibilityEnum('visibility').default('public').notNull(),
  cms_type: uuid('cms_type').references(() => cms_types.id),
});

export const tags = pgTable('tags', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  site_id: uuid('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
  icon: text('icon'),
  content_id: uuid('content_id'),
  content_type: text('content_type'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).default(sql`now()`),
}, (table) => {
  return {
    name_unique_idx: uniqueIndex('tags_name_site_id_idx').on(table.name, table.site_id),
  };
});

// CMS Types table to store content type definitions
export const cms_types = pgTable('cms_types', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  name: text('name').notNull(), // Slug-like identifier
  label: text('label').notNull(), // Human-readable label
  description: text('description'),
  color: text('color'),
  icon_name: text('icon_name'),
  favorite: boolean('favorite').default(false),
  type: cmsTypeCategoryEnum('type').default('official'),
  fields: jsonb('fields').default('[]').notNull(),
});

// Posts table for all CMS content types
export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  title: text('title').notNull(),
  content: jsonb('content').notNull(),
  content_format: text('content_format').default('richtext').notNull(),
  status: contentStatusEnum('status').default('draft'),
  author_id: uuid('author_id').references(() => users.id),
  space_id: uuid('space_id').references(() => spaces.id),
  published_at: timestamp('published_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).default(sql`now()`),
  cms_type: text('cms_type').notNull(), // The type of CMS content this post relates to
  site_id: uuid('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
  locked: boolean('locked').default(false),
  hidden: boolean('hidden').default(false),
  cover_image_url: text('cover_image_url'),
  pinned: boolean('pinned').default(false),
  other_properties: jsonb('other_properties').default('{}'), // All CMS-specific properties
});

// Relation between posts and tags
export const post_tags = pgTable('post_tags', {
  post_id: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  tag_id: uuid('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.post_id, table.tag_id] })
  };
});

// Relations for posts
export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.author_id],
    references: [users.id],
  }),
  space: one(spaces, {
    fields: [posts.space_id],
    references: [spaces.id],
  }),
  site: one(sites, {
    fields: [posts.site_id],
    references: [sites.id],
  }),
  tags: many(post_tags),
}));

// Type exports
export type Site = InferSelectModel<typeof sites>;
export type User = InferSelectModel<typeof users>;
export type Membership = InferSelectModel<typeof memberships>;
export type Space = InferSelectModel<typeof spaces>;
export type Tag = InferSelectModel<typeof tags>;
export type CmsType = InferSelectModel<typeof cms_types>;
export type Post = InferSelectModel<typeof posts>;
export type PostTag = InferSelectModel<typeof post_tags>;