import { pgTable, uuid, text, timestamp, primaryKey, pgEnum, boolean, uniqueIndex, jsonb, integer } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
// Enum for membership roles
export const memberRoleEnum = pgEnum('member_role', ['member', 'admin', 'editor']);
// Enum for content status - updated to include all required statuses
export const contentStatusEnum = pgEnum('content_status', ['draft', 'published', 'archived', 'scheduled', 'pending_review']);
// Enum for site plan
export const sitePlanEnum = pgEnum('site_plan', ['lite', 'pro']);
// First create a new enum for space visibility
export const spaceVisibilityEnum = pgEnum('space_visibility', ['public', 'private', 'paid']);
// Common tables
export const sites = pgTable('sites', {
    id: uuid('id').primaryKey().default(sql `gen_random_uuid()`),
    name: text('name').notNull(),
    subdomain: text('subdomain'),
    owner_id: uuid('owner_id'), // Will reference users.id
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).default(sql `now()`),
    status: text('status').default('active'),
    plan: sitePlanEnum('plan').default('lite'),
    logo_url: text('logo_url'),
    brand_color: text('brand_color'),
    content_types: jsonb('content_types').default('[]'),
    space_ids: jsonb('space_ids').default('[]'), // Store space IDs related to this site
});
export const users = pgTable('users', {
    id: uuid('id').primaryKey().default(sql `gen_random_uuid()`),
    email: text('email'),
    full_name: text('full_name'),
    username: text('username').notNull(),
    password: text('password').notNull(),
    avatar_url: text('avatar_url'),
    bio: text('bio'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).default(sql `now()`),
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
    id: uuid('id').primaryKey().default(sql `gen_random_uuid()`),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    description: text('description'),
    creator_id: uuid('creator_id').references(() => users.id),
    site_id: uuid('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp('updated_at', { withTimezone: true }).default(sql `now()`),
    hidden: boolean('hidden').default(false),
    visibility: spaceVisibilityEnum('visibility').default('public').notNull(),
    cms_type: text('cms_type'), // Optional field to specify CMS type for this space
});
export const tags = pgTable('tags', {
    id: uuid('id').primaryKey().default(sql `gen_random_uuid()`),
    name: text('name').notNull(),
    site_id: uuid('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
    color: text('color'),
    icon: text('icon'),
    content_id: uuid('content_id'),
    content_type: text('content_type'),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp('updated_at', { withTimezone: true }).default(sql `now()`),
}, (table) => {
    return {
        name_unique_idx: uniqueIndex('tags_name_site_id_idx').on(table.name, table.site_id),
    };
});
// New posts table for common fields across all CMS content types
export const posts = pgTable('posts', {
    id: uuid('id').primaryKey().default(sql `gen_random_uuid()`),
    title: text('title').notNull(),
    content: jsonb('content').notNull(),
    content_format: text('content_format').default('richtext').notNull(),
    status: contentStatusEnum('status').default('draft'),
    author_id: uuid('author_id').references(() => users.id),
    space_id: uuid('space_id').references(() => spaces.id),
    published_at: timestamp('published_at', { withTimezone: true }),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp('updated_at', { withTimezone: true }).default(sql `now()`),
    cms_type: text('cms_type').notNull(), // The type of CMS content this post relates to
    site_id: uuid('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
    locked: boolean('locked').default(false),
    hidden: boolean('hidden').default(false),
    cover_image_id: uuid('cover_image_id'),
    pinned: boolean('pinned').default(false),
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
// Define answer table first to avoid circular references
export const cms_qa_answers = pgTable('cms_qa_answers', {
    id: uuid('id').primaryKey().default(sql `gen_random_uuid()`),
    question_id: uuid('question_id').notNull(), // Will be referred by qa_questions
    body: text('body').notNull(),
    author_id: uuid('author_id').references(() => users.id),
    upvotes: integer('upvotes').default(0),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp('updated_at', { withTimezone: true }).default(sql `now()`),
});
// Then define questions with reference to answers
export const cms_qa_questions = pgTable('cms_qa_questions', {
    id: uuid('id').primaryKey().default(sql `gen_random_uuid()`),
    post_id: uuid('post_id').references(() => posts.id), // Reference to common post data
    question: text('question').notNull(),
    details: text('details').notNull(),
    accepted_answer_id: uuid('accepted_answer_id').references(() => cms_qa_answers.id),
    upvotes: integer('upvotes').default(0),
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
    post: one(posts, {
        fields: [cms_qa_questions.post_id],
        references: [posts.id],
    }),
}));
// Content Type Tables based on CMS_Field_Structure.csv - updated to use posts table
// 1. Discussion
export const cms_discussions = pgTable('cms_discussions', {
    id: uuid('id').primaryKey().default(sql `gen_random_uuid()`),
    post_id: uuid('post_id').references(() => posts.id), // Reference to common post data
    featured_image_id: uuid('featured_image_id'),
    allow_replies: boolean('allow_replies').default(true),
    pinned: boolean('pinned').default(false),
});
// 3. Knowledge Base
export const cms_knowledge_base_articles = pgTable('cms_knowledge_base_articles', {
    id: uuid('id').primaryKey().default(sql `gen_random_uuid()`),
    post_id: uuid('post_id').references(() => posts.id), // Reference to common post data
    last_updated: timestamp('last_updated', { withTimezone: true }).default(sql `now()`),
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
    id: uuid('id').primaryKey().default(sql `gen_random_uuid()`),
    post_id: uuid('post_id').references(() => posts.id), // Reference to common post data
    status: text('status').default('Under Review'), // Keep specific status for ideas
    votes: integer('votes').default(0),
});
// 5. Changelog
export const cms_changelogs = pgTable('cms_changelogs', {
    id: uuid('id').primaryKey().default(sql `gen_random_uuid()`),
    post_id: uuid('post_id').references(() => posts.id), // Reference to common post data
    date: timestamp('date', { withTimezone: true }).notNull(),
    feature_area: text('feature_area'),
    version: text('version'),
});
// 6. Product Update
export const cms_product_updates = pgTable('cms_product_updates', {
    id: uuid('id').primaryKey().default(sql `gen_random_uuid()`),
    post_id: uuid('post_id').references(() => posts.id), // Reference to common post data
    date: timestamp('date', { withTimezone: true }).notNull(),
    release_notes: text('release_notes'),
    feature: text('feature'),
    version: text('version'),
    media_id: uuid('media_id'),
});
// 7. Roadmap
export const cms_roadmap_items = pgTable('cms_roadmap_items', {
    id: uuid('id').primaryKey().default(sql `gen_random_uuid()`),
    post_id: uuid('post_id').references(() => posts.id), // Reference to common post data
    status: text('status').notNull(), // Specific status field for roadmap items
    timeline: text('timeline'),
    priority: text('priority'),
    owner_id: uuid('owner_id').references(() => users.id),
});
// 8. Announcements
export const cms_announcements = pgTable('cms_announcements', {
    id: uuid('id').primaryKey().default(sql `gen_random_uuid()`),
    post_id: uuid('post_id').references(() => posts.id), // Reference to common post data
    audience: text('audience'),
    date: timestamp('date', { withTimezone: true }).defaultNow(),
    call_to_action: text('call_to_action'),
    banner_image_id: uuid('banner_image_id'),
});
// 9. Wiki
export const cms_wiki_pages = pgTable('cms_wiki_pages', {
    id: uuid('id').primaryKey().default(sql `gen_random_uuid()`),
    post_id: uuid('post_id').references(() => posts.id), // Reference to common post data
    parent_page_id: uuid('parent_page_id'), // Self-reference will be set up in relations
    last_updated: timestamp('last_updated', { withTimezone: true }).default(sql `now()`),
    editor_id: uuid('editor_id').references(() => users.id),
});
export const wikiPagesRelations = relations(cms_wiki_pages, ({ one, many }) => ({
    parent: one(cms_wiki_pages, {
        fields: [cms_wiki_pages.parent_page_id],
        references: [cms_wiki_pages.id],
    }),
    children: many(cms_wiki_pages),
    post: one(posts, {
        fields: [cms_wiki_pages.post_id],
        references: [posts.id],
    }),
}));
// 10. Events
export const cms_events = pgTable('cms_events', {
    id: uuid('id').primaryKey().default(sql `gen_random_uuid()`),
    post_id: uuid('post_id').references(() => posts.id), // Reference to common post data
    date_time: timestamp('date_time', { withTimezone: true }).notNull(),
    location: text('location').notNull(),
    speaker_id: uuid('speaker_id').references(() => users.id),
    rsvp_limit: integer('rsvp_limit'),
    banner_image_id: uuid('banner_image_id'),
});
// 11. Course
export const cms_courses = pgTable('cms_courses', {
    id: uuid('id').primaryKey().default(sql `gen_random_uuid()`),
    post_id: uuid('post_id').references(() => posts.id), // Reference to common post data
    start_date: timestamp('start_date', { withTimezone: true }).notNull(),
    instructor_id: uuid('instructor_id').references(() => users.id),
    duration: text('duration'),
    materials: text('materials'),
    enrollment_limit: integer('enrollment_limit'),
});
// 12. Jobs
export const cms_jobs = pgTable('cms_jobs', {
    id: uuid('id').primaryKey().default(sql `gen_random_uuid()`),
    post_id: uuid('post_id').references(() => posts.id), // Reference to common post data
    location: text('location').notNull(),
    department: text('department'),
    type: text('type'),
    salary: text('salary'),
    apply_link: text('apply_link'),
});
// 13. Speakers
export const cms_speakers = pgTable('cms_speakers', {
    id: uuid('id').primaryKey().default(sql `gen_random_uuid()`),
    post_id: uuid('post_id').references(() => posts.id), // Reference to common post data
    name: text('name').notNull(),
    title: text('title').notNull(),
    linkedin: text('linkedin'),
    image_id: uuid('image_id'),
    company: text('company'),
    topic: text('topic'),
});
// 14. Article
export const cms_articles = pgTable('cms_articles', {
    id: uuid('id').primaryKey().default(sql `gen_random_uuid()`),
    post_id: uuid('post_id').references(() => posts.id), // Reference to common post data
    cover_image_id: uuid('cover_image_id'),
    estimated_reading_time: integer('estimated_reading_time'),
});
// 15. Poll Voting
export const cms_polls = pgTable('cms_polls', {
    id: uuid('id').primaryKey().default(sql `gen_random_uuid()`),
    post_id: uuid('post_id').references(() => posts.id), // Reference to common post data
    options: jsonb('options').notNull(), // Array of options
    allow_multiple: boolean('allow_multiple').default(false),
    deadline: timestamp('deadline', { withTimezone: true }),
    voter_list: jsonb('voter_list').default('[]'), // Array of voter IDs or null if anonymous
    anonymous: boolean('anonymous').default(false),
});
// 16. File Library
export const cms_file_library = pgTable('cms_file_library', {
    id: uuid('id').primaryKey().default(sql `gen_random_uuid()`),
    post_id: uuid('post_id').references(() => posts.id), // Reference to common post data
    file_name: text('file_name').notNull(),
    file_id: uuid('file_id').notNull(),
    description: text('description'),
    uploader_id: uuid('uploader_id').references(() => users.id),
    access_level: text('access_level').default('public'),
});
// 17. Gallery
export const cms_gallery_items = pgTable('cms_gallery_items', {
    id: uuid('id').primaryKey().default(sql `gen_random_uuid()`),
    post_id: uuid('post_id').references(() => posts.id), // Reference to common post data
    image_id: uuid('image_id').notNull(),
    caption: text('caption'),
});
