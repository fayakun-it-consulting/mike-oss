# PocketBase Integration Guide

## Overview

This document provides instructions for setting up PocketBase as an alternative database option for the Mike project, alongside SQLite.

## PocketBase Setup

### Prerequisites
- Docker installed
- Docker Compose support

### Running PocketBase

```bash
# Start PocketBase with Docker
docker run -d \
  --name pocketbase \
  -p 8090:8090 \
  -v $(pwd)/pocketbase-data:/pocketbase \
  adrianmusante/pocketbase:latest

# Or with Docker Compose
docker-compose -f docker-compose-dev.yml up -d
```

### PocketBase Configuration

The PocketBase instance will:
- Run on port 8090
- Store data in `pocketbase-data` directory
- Provide admin interface on port 8091

## Integration with Mike Project

### Environment Variables

Set these in your development environment:
```bash
export DB_TYPE=pocketbase
export DATABASE_URL=http://localhost:8090
```

### Database Access

PocketBase provides a REST API for database access:
- HTTP API: `http://localhost:8090/api/`
- Admin Interface: `http://localhost:8091`

## Implementation Notes

### Backend Integration

In your backend, you can now use PocketBase instead of Supabase:
```typescript
// Configuration for PocketBase
const config = {
  type: 'pocketbase',
  url: 'http://localhost:8090',
  connection: {
    api: '/api'
  }
};

// Create PocketBase service
const pocketbaseService = DatabaseServiceFactory.create(config);
```

### Frontend Integration

Update frontend to use PocketBase API:
```typescript
// Use PocketBase API instead of Supabase
const pocketbaseClient = new PocketBase('http://localhost:8090');
```

## Development Workflow

### Start Development Environment

```bash
# Start PocketBase
docker run -d \
  --name pocketbase \
  -p 8090:8090 \
  -v $(pwd)/pocketbase-data:/pocketbase \
  adrianmusante/pocketbase:latest

# Start application (assuming you have Docker setup)
docker-compose -f docker-compose-dev.yml up -d
```

### Database Management

PocketBase provides:
- Admin dashboard at `http://localhost:8091`
- REST API at `http://localhost:8090/api`
- SQLite-based storage with JSON APIs

## Benefits

- **Database Abstraction**: Works alongside existing SQLite support
- **Development Speed**: Quick setup for development
- **Admin Interface**: Built-in admin dashboard
- **API Access**: RESTful access patterns

## Troubleshooting

### Common Issues

1. **Port Conflicts**: Ensure ports 8090, 8091 are available
2. **Volume Permissions**: Make sure `pocketbase-data` directory has proper permissions
3. **Network Issues**: Ensure Docker networks are configured correctly

### Debugging

```bash
# Check PocketBase status
docker logs pocketbase

# Verify volumes
ls -la pocketbase-data/

# Test API access
curl http://localhost:8090/api/health
```

## Cleanup

To stop and remove PocketBase:
```bash
docker stop pocketbase
docker rm pocketbase
rm -rf pocketbase-data
```

## Next Steps

1. Test PocketBase integration
2. Update database service factory to support PocketBase
3. Add PocketBase configuration to environment variables
4. Verify API endpoints work with the frontend