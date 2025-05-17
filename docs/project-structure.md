# Project Structure

This document explains the project's directory structure and the purpose of each component.

## Root Directory

The App-bettermode project has the following main directories:

```
App-bettermode/
├── api/                    # Compiled JavaScript files for deployment on Vercel
├── client/                 # Frontend React application
├── docs/                   # Project documentation
├── scripts/                # Utility scripts for development and deployment
├── server/                 # Backend TypeScript source code
└── [config files]          # Various configuration files
```

## `api/` Directory

The `api/` directory contains JavaScript files compiled from TypeScript files in the `server/` directory. These files are used for deployment on Vercel.

**Important:** Never modify the files in this directory directly. Always make changes to the TypeScript files in the `server/` directory and then compile them with `npm run build`.

## `client/` Directory

The `client/` directory contains the React frontend application built with Vite.

```
client/
└── src/
    ├── components/         # React components
    │   ├── dashboard/      # Dashboard-specific components
    │   ├── layout/         # Layout components
    │   └── ui/             # Reusable UI components
    ├── config/             # Configuration files
    ├── hooks/              # Custom React hooks
    ├── lib/                # Helper functions and API client
    ├── pages/              # Page components
    │   ├── dashboard/      # Dashboard pages
    │   ├── site/           # Site-specific pages
    │   └── sites/          # Sites overview pages
    ├── public/             # Static assets
    └── types/              # TypeScript type definitions
```

## `docs/` Directory

The `docs/` directory contains project documentation:

```
docs/
├── README.md              # Documentation overview
├── architecture.md        # System architecture documentation
├── development.md         # Development guide
├── api.md                 # API documentation
└── project-structure.md   # This file
```

## `scripts/` Directory

The `scripts/` directory contains utility scripts for development, deployment, and other tasks.

## `server/` Directory

The `server/` directory contains the TypeScript source code for the backend API:

```
server/
├── db/                    # Database connection and models
├── routes/                # API route handlers
├── utils/                 # Utility functions
├── index.ts               # Main application entry point
└── [other configuration]  # TypeScript configuration, etc.
```

## Configuration Files

The root directory contains various configuration files:

- `package.json` - Project dependencies and scripts
- `vercel.json` - Vercel deployment configuration
- `tsconfig.json` - TypeScript configuration
- `.env` - Environment variables (not tracked in git)
- `.gitignore` - Git ignore rules
- `drizzle.config.ts` - Drizzle ORM configuration

## Relationship Between `server/` and `api/` Directories

- The `server/` directory contains the TypeScript source code that developers write and edit
- When building for production (`npm run build`), these files are compiled to JavaScript
- The resulting JavaScript files are placed in the `api/` directory
- The files in the `api/` directory are then used for deployment on Vercel

This separation ensures type safety during development while providing optimized JavaScript for production. 