# Backend Build Instructions

## Overview

This document provides instructions for building and running the backend with Pandino OSGi architecture, using the database abstraction layer we've created.

## Prerequisites

1. **Node.js** (16+ recommended)
2. **npm** (latest version)
3. **SQLite** (for development)
4. **TypeScript** (latest version)

## Building Backend

### 1. Install Dependencies

```bash
npm install --prefix backend
```

### 2. Compile TypeScript

```bash
cd backend
npx tsc --build
```

### 3. Configure Database

```bash
# For development (SQLite)
export DB_TYPE=sqlite
export DATABASE_URL=file::memory:?cache=shared

# For production (PostgreSQL)
export DB_TYPE=postgresql  
export DATABASE_URL=postgresql://user:pass@localhost:5432/mike
```

### 4. Run Backend

```bash
npm run dev --prefix backend
```

## Frontend Build

### 1. Install Dependencies

```bash
npm install --prefix frontend
```

### 2. Build Application

```bash
npm run build --prefix frontend
```

### 3. Run Development Server

```bash
npm run dev --prefix frontend
```

## Architecture Overview

### Database Configuration

The system uses a configuration-based approach:
- **Default**: SQLite for local development
- **Production**: PostgreSQL for production environments
- **Environment Variables**: `DB_TYPE` and `DATABASE_URL`

### Component Registration

In Pandino OSGi:
```typescript
// Components automatically registered as OSGi services
const projectService = Components.ProjectService(config);
const documentService = Components.DocumentService(config);
const userService = Components.UserService(config);
```

### Database Initialization

```typescript
// Initialize with schema
const initService = DatabaseInit.createDefault();
await initService.initialize();
await initService.validateSchema();
```

## Testing

### Unit Tests

```bash
npm run test --prefix backend
```

### Integration Tests

```bash
npm run test:integration --prefix backend
```

## Environment Variables

- `DB_TYPE`: "sqlite" or "postgresql" (default: "sqlite")
- `DATABASE_URL`: Database connection string
- `PORT`: Server port (default: 3000)

## Expected Behavior

1. **Database Initialization** - Automatically creates schema
2. **Component Registration** - All services registered with Pandino
3. **API Routes** - CRUD operations available
4. **Frontend Integration** - Frontend connects to backend services
5. **Transaction Management** - Database transactions handled properly
6. **Error Handling** - Proper error responses for all operations

## Troubleshooting

### Common Issues

1. **Database Connection**
   - Verify `DATABASE_URL` is correct
   - Check database type matches configuration

2. **Component Registration**
   - Ensure all components implement `DatabaseService`
   - Verify factory patterns work correctly

3. **Schema Validation**
   - Check for missing tables in database
   - Verify foreign key relationships

## Monitoring

### Health Checks

```bash
curl http://localhost:3000/health
curl http://localhost:3000/health/db
```

### Performance Metrics

```bash
npm run metrics --prefix backend
```

## Next Steps

1. **Configure Environment** - Set appropriate database variables
2. **Run Database Initialization** - Execute schema setup
3. **Start Backend Services** - Launch API server
4. **Start Frontend** - Launch frontend application
5. **Test Integration** - Verify full system functionality

The system should now be ready to run with all components properly integrated.