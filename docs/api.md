# API Documentation

This document provides details about the available API endpoints, their parameters, and responses.

## Base URL

- Local development: `http://localhost:4000/api`
- Production: `https://your-vercel-deployment.vercel.app/api`

## Authentication

Authentication is not implemented in the current version and will be added in future updates.

## API Versioning

All API endpoints are prefixed with their version number (e.g., `/api/v1/sites`).

## Available Endpoints

### Sites

#### Get All Sites

```
GET /api/v1/sites
```

**Response:**
```json
{
  "sites": [
    {
      "id": "1",
      "name": "Example Site",
      "subdomain": "example",
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    },
    ...
  ]
}
```

#### Create a New Site

```
POST /api/v1/sites
```

**Request Body:**
```json
{
  "name": "New Site",
  "subdomain": "newsite"
}
```

**Response:**
```json
{
  "id": "2",
  "name": "New Site",
  "subdomain": "newsite",
  "createdAt": "2023-01-02T00:00:00Z",
  "updatedAt": "2023-01-02T00:00:00Z"
}
```

#### Get Site by ID or Subdomain

```
GET /api/v1/sites/:identifier
```

Where `:identifier` can be either a site ID or a subdomain.

**Response:**
```json
{
  "id": "1",
  "name": "Example Site",
  "subdomain": "example",
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-01T00:00:00Z"
}
```

### Health Check

```
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2023-01-01T00:00:00Z",
  "version": "1.0.0"
}
```

## Error Handling

All API errors follow a standard format:

```json
{
  "message": "Error message",
  "errors": {
    "fieldErrors": {
      "field1": ["Error related to field1"],
      "field2": ["Error related to field2"]
    }
  }
}
```

### Common HTTP Status Codes

- `200 OK`: The request was successful
- `201 Created`: A new resource was successfully created
- `400 Bad Request`: The request was invalid (missing required fields, validation errors, etc.)
- `404 Not Found`: The requested resource was not found
- `500 Internal Server Error`: An unexpected error occurred on the server

## Rate Limiting

Currently, there are no rate limits implemented. This feature may be added in future versions. 