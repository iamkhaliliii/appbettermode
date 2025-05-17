# App-bettermode

Modern Content Management and Community Platform for managing multiple sites

## Project Structure

This project consists of several important components:

### Main Components

- **`client/`** - React frontend code
- **`server/`** - TypeScript source code for the API (these files should be edited)
- **`api/`** - Compiled JavaScript code from `server/` for deployment on Vercel (do not edit)

### Other Directories

- **`docs/`** - Project documentation
- **`scripts/`** - Helper scripts for development and deployment

### Important Note About Server and API Folders

- The `server` folder contains TypeScript source code that developers work on
- The `api` folder contains compiled JavaScript code that is generated from `server` code using `npm run build`
- Never directly edit files in the `api` folder
- If you need to change the API, always modify the code in the `server` folder

## Getting Started

To set up the project in the development environment:

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev
```

To access the application:
- Frontend: http://localhost:4000
- API: http://localhost:4000/api/v1

## Documentation

For more information, please refer to the following documentation:

- [Development Guide](./docs/development.md) - Guide for getting started with development
- [Architecture](./docs/architecture.md) - Information about the project architecture
- [API Documentation](./docs/api.md) - Details about API endpoints
- [Project Structure](./docs/project-structure.md) - Explanation of the project structure

## License

All rights reserved.
