/**
 * This script initializes the default CMS types in the database.
 * Run this script after creating the database schema.
 */
import { db } from './index.js';
import { cms_types } from './schema.js';
/**
 * Add default CMS types to the database
 */
export async function addDefaultCmsTypes() {
    try {
        console.log('Adding default CMS types...');
        // Check if CMS types already exist
        const existingTypes = await db.select().from(cms_types);
        if (existingTypes.length > 0) {
            console.log(`Found ${existingTypes.length} existing CMS types. Skipping initialization.`);
            return { success: true, message: 'CMS types already exist' };
        }
        // Define the default CMS types
        const defaultCmsTypes = [
            {
                name: 'Discussion',
                description: 'General discussions and conversations',
                color: '#3b82f6', // blue-500
                icon_name: 'message-square',
                favorite: true,
                type: 'official',
                fields: [
                    {
                        key: 'title',
                        label: 'Title',
                        type: 'text',
                        placeholder: 'Discussion title'
                    },
                    {
                        key: 'content',
                        label: 'Content',
                        type: 'richtext',
                        placeholder: 'Discussion content'
                    }
                ]
            },
            {
                name: 'QA',
                description: 'Questions and answers',
                color: '#8b5cf6', // violet-500
                icon_name: 'help-circle',
                favorite: true,
                type: 'official',
                fields: [
                    {
                        key: 'question',
                        label: 'Question',
                        type: 'text',
                        placeholder: 'Ask a question'
                    },
                    {
                        key: 'details',
                        label: 'Details',
                        type: 'richtext',
                        placeholder: 'Provide more details about your question'
                    }
                ]
            },
            {
                name: 'Wishlist',
                description: 'Feature requests and ideas',
                color: '#eab308', // yellow-500
                icon_name: 'star',
                favorite: true,
                type: 'official',
                fields: [
                    {
                        key: 'title',
                        label: 'Title',
                        type: 'text',
                        placeholder: 'Feature request title'
                    },
                    {
                        key: 'description',
                        label: 'Description',
                        type: 'richtext',
                        placeholder: 'Describe the feature you want'
                    }
                ]
            },
            {
                name: 'Knowledge',
                description: 'Knowledge base articles and documentation',
                color: '#ef4444', // red-500
                icon_name: 'book-open',
                favorite: true,
                type: 'official',
                fields: [
                    {
                        key: 'title',
                        label: 'Title',
                        type: 'text',
                        placeholder: 'Article title'
                    },
                    {
                        key: 'content',
                        label: 'Content',
                        type: 'richtext',
                        placeholder: 'Article content'
                    }
                ]
            },
            {
                name: 'Event',
                description: 'Event announcements and calendar items',
                color: '#22c55e', // green-500
                icon_name: 'calendar',
                favorite: false,
                type: 'official',
                fields: [
                    {
                        key: 'title',
                        label: 'Title',
                        type: 'text',
                        placeholder: 'Event title'
                    },
                    {
                        key: 'description',
                        label: 'Description',
                        type: 'richtext',
                        placeholder: 'Event description'
                    },
                    {
                        key: 'start_date',
                        label: 'Start Date',
                        type: 'datetime',
                        placeholder: 'Event start date'
                    },
                    {
                        key: 'end_date',
                        label: 'End Date',
                        type: 'datetime',
                        placeholder: 'Event end date'
                    }
                ]
            },
            {
                name: 'Blog',
                description: 'Blog posts and articles',
                color: '#ec4899', // pink-500
                icon_name: 'file-text',
                favorite: false,
                type: 'official',
                fields: [
                    {
                        key: 'title',
                        label: 'Title',
                        type: 'text',
                        placeholder: 'Blog post title'
                    },
                    {
                        key: 'content',
                        label: 'Content',
                        type: 'richtext',
                        placeholder: 'Blog post content'
                    }
                ]
            },
            {
                name: 'Landing',
                description: 'Landing pages',
                color: '#6366f1', // indigo-500
                icon_name: 'layout',
                favorite: false,
                type: 'official',
                fields: [
                    {
                        key: 'title',
                        label: 'Title',
                        type: 'text',
                        placeholder: 'Page title'
                    },
                    {
                        key: 'content',
                        label: 'Content',
                        type: 'richtext',
                        placeholder: 'Page content'
                    }
                ]
            },
            {
                name: 'Jobs',
                description: 'Job listings and career opportunities',
                color: '#06b6d4', // cyan-500
                icon_name: 'briefcase',
                favorite: false,
                type: 'official',
                fields: [
                    {
                        key: 'title',
                        label: 'Job Title',
                        type: 'text',
                        placeholder: 'Job title'
                    },
                    {
                        key: 'description',
                        label: 'Description',
                        type: 'richtext',
                        placeholder: 'Job description'
                    },
                    {
                        key: 'location',
                        label: 'Location',
                        type: 'text',
                        placeholder: 'Job location'
                    }
                ]
            }
        ];
        // Insert the default CMS types
        const insertResults = await db.insert(cms_types).values(defaultCmsTypes).returning();
        console.log(`Successfully added ${insertResults.length} default CMS types`);
        return { success: true, message: `Added ${insertResults.length} default CMS types` };
    }
    catch (error) {
        console.error('Error adding default CMS types:', error);
        return { success: false, message: 'Error adding default CMS types', error };
    }
}
// If this file is called directly, run the function
if (process.argv[1].endsWith('init-cms-types.ts')) {
    (async () => {
        try {
            const result = await addDefaultCmsTypes();
            console.log(result);
            process.exit(0);
        }
        catch (error) {
            console.error('Failed to initialize CMS types:', error);
            process.exit(1);
        }
    })();
}
