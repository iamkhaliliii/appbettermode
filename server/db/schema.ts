import { pgTable, uuid, text, timestamp, varchar, primaryKey, pgEnum, boolean, uniqueIndex, jsonb, integer } from 'drizzle-orm/pg-core';
import { sql, InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { relations } from 'drizzle-orm';

// Enum for membership roles
export const memberRoleEnum = pgEnum('member_role', ['member', 'admin', 'editor']);

// Enum for content status
export const contentStatusEnum = pgEnum('content_status', ['draft', 'published', 'archived']);

// Common tables
export const sites = pgTable('sites', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  subdomain: text('subdomain'),
  owner_id: uuid('owner_id'), // Will reference users.id
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).default(sql`now()`),
  state: text('state').default('pending'),
  status: text('status').default('active'),
  logo_url: text('logo_url'),
  brand_color: text('brand_color'),
  content_types: jsonb('content_types').default('[]'),
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

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  description: text('description'),
  site_id: uuid('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
  parent_id: uuid('parent_id'), // Self-reference will be set up in relations
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).default(sql`now()`),
});

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parent_id],
    references: [categories.id],
  }),
  children: many(categories),
}));

export const spaces = pgTable('spaces', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  description: text('description'),
  site_id: uuid('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).default(sql`now()`),
  is_private: boolean('is_private').notNull().default(false),
  cover_image_url: text('cover_image_url'),
  icon_url: text('icon_url'),
});

export const tags = pgTable('tags', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  site_id: uuid('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).default(sql`now()`),
}, (table) => {
  return {
    name_unique_idx: uniqueIndex('tags_name_site_id_idx').on(table.name, table.site_id),
  };
});

export const media = pgTable('media', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  site_id: uuid('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
  file_name: text('file_name').notNull(),
  file_type: text('file_type').notNull(),
  file_size: integer('file_size').notNull(),
  url: text('url').notNull(),
  upload_by: uuid('upload_by').references(() => users.id),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).default(sql`now()`),
});

// Define answer table first to avoid circular references
export const cms_qa_answers = pgTable('cms_qa_answers', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  question_id: uuid('question_id').notNull(), // Will be referred by qa_questions
  body: text('body').notNull(),
  author_id: uuid('author_id').references(() => users.id),
  upvotes: integer('upvotes').default(0),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).default(sql`now()`),
});

// Then define questions with reference to answers
export const cms_qa_questions = pgTable('cms_qa_questions', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  question: text('question').notNull(),
  details: text('details').notNull(),
  site_id: uuid('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
  author_id: uuid('author_id').references(() => users.id),
  category_id: uuid('category_id').references(() => categories.id),
  accepted_answer_id: uuid('accepted_answer_id').references(() => cms_qa_answers.id),
  upvotes: integer('upvotes').default(0),
  space_id: uuid('space_id').references(() => spaces.id),
  status: contentStatusEnum('status').default('published'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).default(sql`now()`),
});

// Now we can update qa_answers to reference qa_questions
export const qaAnswersRelations = relations(cms_qa_answers, ({ one }) => ({
  question: one(cms_qa_questions, {
    fields: [cms_qa_answers.question_id],
    references: [cms_qa_questions.id],
  }),
}));

export const qaQuestionsRelations = relations(cms_qa_questions, ({ one, many }) => ({
  acceptedAnswer: one(cms_qa_answers, {
    fields: [cms_qa_questions.accepted_answer_id],
    references: [cms_qa_answers.id],
  }),
  answers: many(cms_qa_answers),
}));

// Content Type Tables based on CMS_Field_Structure.csv

// 1. Discussion
export const cms_discussions = pgTable('cms_discussions', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  title: text('title').notNull(),
  body: text('body').notNull(),
  site_id: uuid('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
  author_id: uuid('author_id').references(() => users.id),
  space_id: uuid('space_id').references(() => spaces.id),
  category_id: uuid('category_id').references(() => categories.id),
  featured_image_id: uuid('featured_image_id').references(() => media.id),
  allow_replies: boolean('allow_replies').default(true),
  pinned: boolean('pinned').default(false),
  status: contentStatusEnum('status').default('published'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).default(sql`now()`),
});

// 3. Knowledge Base
export const cms_knowledge_base_articles = pgTable('cms_knowledge_base_articles', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  title: text('title').notNull(),
  body: text('body').notNull(),
  site_id: uuid('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
  author_id: uuid('author_id').references(() => users.id),
  category_id: uuid('category_id').references(() => categories.id),
  space_id: uuid('space_id').references(() => spaces.id),
  last_updated: timestamp('last_updated', { withTimezone: true }).default(sql`now()`),
  status: contentStatusEnum('status').default('published'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).default(sql`now()`),
});

export const cms_related_articles = pgTable('cms_related_articles', {
  article_id: uuid('article_id').notNull().references(() => cms_knowledge_base_articles.id, { onDelete: 'cascade' }),
  related_article_id: uuid('related_article_id').notNull().references(() => cms_knowledge_base_articles.id, { onDelete: 'cascade' }),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.article_id, table.related_article_id] })
  };
});

// 4. Idea & Feedback
export const cms_ideas = pgTable('cms_ideas', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  title: text('idea_title').notNull(),
  description: text('description').notNull(),
  site_id: uuid('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
  submitter_id: uuid('submitter_id').references(() => users.id),
  status: text('status').default('Under Review'),
  votes: integer('votes').default(0),
  space_id: uuid('space_id').references(() => spaces.id),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).default(sql`now()`),
});

// 5. Changelog
export const cms_changelogs = pgTable('cms_changelogs', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  title: text('update_title').notNull(),
  description: text('description').notNull(),
  date: timestamp('date', { withTimezone: true }).notNull(),
  site_id: uuid('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
  author_id: uuid('author_id').references(() => users.id),
  feature_area: text('feature_area'),
  version: text('version'),
  space_id: uuid('space_id').references(() => spaces.id),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).default(sql`now()`),
});

// 6. Product Update
export const cms_product_updates = pgTable('cms_product_updates', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  title: text('title').notNull(),
  description: text('description').notNull(),
  date: timestamp('date', { withTimezone: true }).notNull(),
  site_id: uuid('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
  author_id: uuid('author_id').references(() => users.id),
  release_notes: text('release_notes'),
  feature: text('feature'),
  version: text('version'),
  media_id: uuid('media_id').references(() => media.id),
  space_id: uuid('space_id').references(() => spaces.id),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).default(sql`now()`),
});

// 7. Roadmap
export const cms_roadmap_items = pgTable('cms_roadmap_items', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  feature: text('feature').notNull(),
  status: text('status').notNull(),
  description: text('description').notNull(),
  site_id: uuid('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
  timeline: text('timeline'),
  priority: text('priority'),
  owner_id: uuid('owner_id').references(() => users.id),
  space_id: uuid('space_id').references(() => spaces.id),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).default(sql`now()`),
});

// 8. Announcements
export const cms_announcements = pgTable('cms_announcements', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  title: text('title').notNull(),
  message: text('message').notNull(),
  site_id: uuid('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
  audience: text('audience'),
  date: timestamp('date', { withTimezone: true }).defaultNow(),
  call_to_action: text('call_to_action'),
  banner_image_id: uuid('banner_image_id').references(() => media.id),
  space_id: uuid('space_id').references(() => spaces.id),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).default(sql`now()`),
});

// 9. Wiki
export const cms_wiki_pages = pgTable('cms_wiki_pages', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  title: text('page_title').notNull(),
  content: text('content').notNull(),
  site_id: uuid('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
  parent_page_id: uuid('parent_page_id'), // Self-reference will be set up in relations
  last_updated: timestamp('last_updated', { withTimezone: true }).default(sql`now()`),
  editor_id: uuid('editor_id').references(() => users.id),
  space_id: uuid('space_id').references(() => spaces.id),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).default(sql`now()`),
});

export const wikiPagesRelations = relations(cms_wiki_pages, ({ one, many }) => ({
  parent: one(cms_wiki_pages, {
    fields: [cms_wiki_pages.parent_page_id],
    references: [cms_wiki_pages.id],
  }),
  children: many(cms_wiki_pages),
}));

// 10. Events (already exists, but updating to match CMS structure)
export const cms_events = pgTable('cms_events', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  title: text('event_title').notNull(),
  date_time: timestamp('date_time', { withTimezone: true }).notNull(),
  location: text('location').notNull(),
  description: text('description'),
  site_id: uuid('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
  speaker_id: uuid('speaker_id').references(() => users.id),
  rsvp_limit: integer('rsvp_limit'),
  banner_image_id: uuid('banner_image_id').references(() => media.id),
  space_id: uuid('space_id').references(() => spaces.id),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).default(sql`now()`),
});

// 11. Course
export const cms_courses = pgTable('cms_courses', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  title: text('course_title').notNull(),
  description: text('description').notNull(),
  start_date: timestamp('start_date', { withTimezone: true }).notNull(),
  site_id: uuid('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
  instructor_id: uuid('instructor_id').references(() => users.id),
  duration: text('duration'),
  materials: text('materials'),
  enrollment_limit: integer('enrollment_limit'),
  space_id: uuid('space_id').references(() => spaces.id),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).default(sql`now()`),
});

// 12. Jobs
export const cms_jobs = pgTable('cms_jobs', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  title: text('job_title').notNull(),
  description: text('description').notNull(),
  location: text('location').notNull(),
  site_id: uuid('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
  department: text('department'),
  type: text('type'),
  salary: text('salary'),
  apply_link: text('apply_link'),
  space_id: uuid('space_id').references(() => spaces.id),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).default(sql`now()`),
});

// 13. Speakers
export const cms_speakers = pgTable('cms_speakers', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  title: text('title').notNull(),
  bio: text('bio').notNull(),
  site_id: uuid('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
  linkedin: text('linkedin'),
  image_id: uuid('image_id').references(() => media.id),
  company: text('company'),
  topic: text('topic'),
  space_id: uuid('space_id').references(() => spaces.id),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).default(sql`now()`),
});

// 14. Article
export const cms_articles = pgTable('cms_articles', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  title: text('title').notNull(),
  body: text('body').notNull(),
  site_id: uuid('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
  cover_image_id: uuid('cover_image_id').references(() => media.id),
  author_id: uuid('author_id').references(() => users.id),
  category_id: uuid('category_id').references(() => categories.id),
  estimated_reading_time: integer('estimated_reading_time'),
  space_id: uuid('space_id').references(() => spaces.id),
  status: contentStatusEnum('status').default('published'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).default(sql`now()`),
});

// 15. Poll Voting
export const cms_polls = pgTable('cms_polls', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  question: text('question').notNull(),
  options: jsonb('options').notNull(), // Array of options
  site_id: uuid('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
  allow_multiple: boolean('allow_multiple').default(false),
  deadline: timestamp('deadline', { withTimezone: true }),
  voter_list: jsonb('voter_list').default('[]'), // Array of voter IDs or null if anonymous
  anonymous: boolean('anonymous').default(false),
  space_id: uuid('space_id').references(() => spaces.id),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).default(sql`now()`),
});

// 16. File Library
export const cms_file_library = pgTable('cms_file_library', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  file_name: text('file_name').notNull(),
  file_id: uuid('file_id').notNull().references(() => media.id, { onDelete: 'cascade' }),
  site_id: uuid('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
  category_id: uuid('category_id').references(() => categories.id),
  description: text('description'),
  uploader_id: uuid('uploader_id').references(() => users.id),
  access_level: text('access_level').default('public'),
  space_id: uuid('space_id').references(() => spaces.id),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).default(sql`now()`),
});

// 17. Gallery
export const cms_gallery_items = pgTable('cms_gallery_items', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  title: text('title').notNull(),
  image_id: uuid('image_id').notNull().references(() => media.id, { onDelete: 'cascade' }),
  site_id: uuid('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
  caption: text('caption'),
  category_id: uuid('category_id').references(() => categories.id),
  author_id: uuid('author_id').references(() => users.id),
  space_id: uuid('space_id').references(() => spaces.id),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).default(sql`now()`),
});

// Common tagging table for all content types 
export const cms_content_tags = pgTable('cms_content_tags', {
  content_id: uuid('content_id').notNull(),
  tag_id: uuid('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
  content_type: text('content_type').notNull(), // To identify which content type this tag is for
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.content_id, table.tag_id, table.content_type] })
  };
});

// Type exports
export type Site = InferSelectModel<typeof sites>;
export type User = InferSelectModel<typeof users>;
export type Membership = InferSelectModel<typeof memberships>;
export type Category = InferSelectModel<typeof categories>;
export type Space = InferSelectModel<typeof spaces>;
export type Tag = InferSelectModel<typeof tags>;
export type Media = InferSelectModel<typeof media>;
export type Discussion = InferSelectModel<typeof cms_discussions>;
export type QAQuestion = InferSelectModel<typeof cms_qa_questions>;
export type QAAnswer = InferSelectModel<typeof cms_qa_answers>;
export type KnowledgeBaseArticle = InferSelectModel<typeof cms_knowledge_base_articles>;
export type Idea = InferSelectModel<typeof cms_ideas>;
export type Changelog = InferSelectModel<typeof cms_changelogs>;
export type ProductUpdate = InferSelectModel<typeof cms_product_updates>;
export type RoadmapItem = InferSelectModel<typeof cms_roadmap_items>;
export type Announcement = InferSelectModel<typeof cms_announcements>;
export type WikiPage = InferSelectModel<typeof cms_wiki_pages>;
export type Event = InferSelectModel<typeof cms_events>;
export type Course = InferSelectModel<typeof cms_courses>;
export type Job = InferSelectModel<typeof cms_jobs>;
export type Speaker = InferSelectModel<typeof cms_speakers>;
export type Article = InferSelectModel<typeof cms_articles>;
export type Poll = InferSelectModel<typeof cms_polls>;
export type FileLibraryItem = InferSelectModel<typeof cms_file_library>;
export type GalleryItem = InferSelectModel<typeof cms_gallery_items>;
export type ContentTag = InferSelectModel<typeof cms_content_tags>;