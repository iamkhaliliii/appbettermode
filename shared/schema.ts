import { pgTable, text, timestamp, uuid, boolean, primaryKey, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// --- Enums (if you want to use pgEnum for roles) ---
export const memberRoleEnum = pgEnum('member_role', ['admin', 'editor', 'member', 'viewer']);

// --- Users Table (remains largely the same) ---
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  fullName: text("full_name"),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Corrected Zod schema for inserting a user (manual definition for clarity and to fix linter error)
export const insertUserSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  email: z.string().email({ message: "Invalid email address." }).optional(), // email is optional during creation, but if provided, must be valid
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }).optional(), // fullName is optional
});

export type InsertUser = z.infer<typeof insertUserSchema>; // This is the type for the data needed to create a user
export type User = typeof users.$inferSelect; // This is the type for the user data selected from DB

// --- Sites Table ---
export const sites = pgTable("sites", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  subdomain: text("subdomain").unique(), // Or customDomain
  ownerId: uuid("owner_id").notNull().references(() => users.id, { onDelete: 'restrict' }), // Site must have an owner, owner deletion restricted if sites exist
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
});

export const insertSiteSchema = createInsertSchema(sites, {
  name: z.string().min(1),
  subdomain: z.string().min(3).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid subdomain format").optional(), // Basic validation for subdomain
  // ownerId will be set server-side based on the logged-in user creating the site
}).omit({ id: true, createdAt: true, updatedAt: true, ownerId: true });

export type Site = typeof sites.$inferSelect;
export type InsertSite = typeof sites.$inferInsert;

// --- Memberships Table (Junction table for users and sites) ---
export const memberships = pgTable("memberships", {
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  siteId: uuid("site_id").notNull().references(() => sites.id, { onDelete: 'cascade' }),
  role: memberRoleEnum('role').notNull().default('member'), // Using pgEnum for roles
  joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.userId, table.siteId] }),
  };
});

export const insertMembershipSchema = createInsertSchema(memberships);
export type Membership = typeof memberships.$inferSelect;
export type InsertMembership = typeof memberships.$inferInsert;

// --- Events Table (add siteId) ---
export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  siteId: uuid("site_id").notNull().references(() => sites.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  dateTime: timestamp("date_time", { withTimezone: true }).notNull(),
  location: text("location"),
  description: text("description"),
  enableRegistration: boolean("enable_registration").default(false),
  sendReminders: boolean("send_reminders").default(false),
  creatorId: uuid("creator_id").references(() => users.id, { onDelete: 'set null' }), // Event can exist even if creator user is deleted
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const insertEventSchema = createInsertSchema(events, {
  title: z.string().min(3),
  dateTime: z.coerce.date(),
  // siteId and creatorId will be set server-side
}).omit({ id: true, createdAt: true, updatedAt: true, siteId: true, creatorId: true });

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

// --- Tags Table (add siteId) ---
export const tags = pgTable("tags", {
  id: uuid("id").defaultRandom().primaryKey(),
  siteId: uuid("site_id").notNull().references(() => sites.id, { onDelete: 'cascade' }),
  name: text("name").notNull(), // Name uniqueness should be per site, handled by application logic or composite index
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
});

// Consider a composite unique index for (siteId, name) for tags if using Drizzle Studio or manually
export const insertTagSchema = createInsertSchema(tags, {
  name: z.string().min(1),
}).omit({ id: true, createdAt: true, updatedAt: true, siteId: true });

export type Tag = typeof tags.$inferSelect;
export type InsertTag = typeof tags.$inferInsert;

// --- Categories Table (add siteId) ---
export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  siteId: uuid("site_id").notNull().references(() => sites.id, { onDelete: 'cascade' }),
  name: text("name").notNull(), // Name uniqueness per site
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
});

export const insertCategorySchema = createInsertSchema(categories, {
    name: z.string().min(1),
}).omit({ id: true, createdAt: true, updatedAt: true, siteId: true });

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

// --- Spaces Table (add siteId, creatorId now refers to a user, not directly a site owner) ---
export const spaces = pgTable("spaces", {
  id: uuid("id").defaultRandom().primaryKey(),
  siteId: uuid("site_id").notNull().references(() => sites.id, { onDelete: 'cascade' }),
  name: text("name").notNull(), // Name uniqueness per site
  description: text("description"),
  creatorId: uuid("creator_id").notNull().references(() => users.id, { onDelete: 'set null' }), // Space can exist if creator is deleted
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
});

export const insertSpaceSchema = createInsertSchema(spaces, {
    name: z.string().min(1),
}).omit({ id: true, createdAt: true, updatedAt: true, siteId: true, creatorId: true });

export type Space = typeof spaces.$inferSelect;
export type InsertSpace = typeof spaces.$inferInsert;

// --- Discussions Table (add siteId) ---
export const discussions = pgTable("discussions", {
  id: uuid("id").defaultRandom().primaryKey(),
  siteId: uuid("site_id").notNull().references(() => sites.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  body: text("body").notNull(),
  imageUrl: text("image_url"),
  allowReplies: boolean("allow_replies").default(true).notNull(),
  isPinned: boolean("is_pinned").default(false).notNull(),
  authorId: uuid("author_id").notNull().references(() => users.id, { onDelete: 'set null' }), // Discussion can exist if author is deleted
  spaceId: uuid("space_id").notNull().references(() => spaces.id, { onDelete: 'cascade' }), 
  categoryId: uuid("category_id").references(() => categories.id, { onDelete: 'set null' }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
});

export const insertDiscussionSchema = createInsertSchema(discussions, {
  title: z.string().min(3),
  body: z.string().min(10),
}).omit({ id: true, createdAt: true, updatedAt: true, siteId: true, authorId: true, spaceId: true, categoryId: true }); // More fields omitted as they are context/relation dependent

export type Discussion = typeof discussions.$inferSelect;
export type InsertDiscussion = typeof discussions.$inferInsert;

// --- Junction Table: discussion_tags (siteId is implicitly handled via discussion.siteId) ---
export const discussionTags = pgTable("discussion_tags", {
  discussionId: uuid("discussion_id").notNull().references(() => discussions.id, { onDelete: 'cascade' }),
  tagId: uuid("tag_id").notNull().references(() => tags.id, { onDelete: 'cascade' }), 
  assignedAt: timestamp("assigned_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.discussionId, table.tagId] }),
  };
});

export const insertDiscussionTagSchema = createInsertSchema(discussionTags);
export type DiscussionTag = typeof discussionTags.$inferSelect;
export type InsertDiscussionTag = typeof discussionTags.$inferInsert;
