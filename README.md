# Mike Open-Source Project

Open-source release containing the Mike frontend and backend.

## Contents

- `frontend/` - Next.js application
- `backend/` - Express API, Supabase access, document processing, and migrations
- `backend/migrations/` - Database schema migrations

## Setup

Install dependencies:

```bash
npm install --prefix backend
npm install --prefix frontend
```

Create local env files from the examples:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
```

Run `backend/migrations/000_one_shot_schema.sql` in the Supabase SQL editor for a fresh database.

Start the backend:

```bash
npm run dev --prefix backend
```

Start the frontend:

```bash
npm run dev --prefix frontend
```

Open `http://localhost:3000`.

## Required Services

- Supabase Auth and Postgres
- S3-compatible object storage, such as Cloudflare R2
- At least one supported model provider key, depending on which models you enable
- LibreOffice for DOC/DOCX to PDF conversion

## Checks

```bash
npm run build --prefix backend
npm run build --prefix frontend
npm run lint --prefix frontend
```

## Database Options

### Default: PostgreSQL (Production)
- Uses PostgreSQL for production environments
- Supabase-compatible PostgreSQL
- Requires `SUPABASE_URL` and `SUPABASE_SECRET_KEY`

### Alternative: PocketBase (Docker)
- Run with Docker: `docker run -d --name pocketbase -p 8090:8090 adrianmusante/pocketbase:latest`
- Use: `DB_TYPE=pocketbase` and `DATABASE_URL=http://localhost:8090`

## Development with Docker

### Quick Start

```bash
# Start PocketBase for alternative database
docker run -d \
  --name pocketbase \
  -p 8090:8090 \
  -v $(pwd)/pocketbase-data:/pocketbase \
  adrianmusante/pocketbase:latest

# Start the application
docker-compose -f docker-compose-dev.yml up -d
```

### Environment Variables

```bash
# Development with PostgreSQL (default)
export DB_TYPE=postgresql
export DATABASE_URL=postgresql://user:password@localhost:5432/database

# Development with PocketBase
export DB_TYPE=pocketbase
export DATABASE_URL=http://localhost:8090
```

## Migration to Pandino OSGi

### Architecture Overview

This project now supports Pandino OSGi architecture:

1. **Database Abstraction Layer** - Supports PostgreSQL and PocketBase
2. **Component-Based Services** - All CRUD operations implemented
3. **TypeScript Integration** - Full TypeScript support
4. **Transaction Management** - Proper transaction handling

### Migration Status

- ✅ Database abstraction implemented
- ✅ CRUD components for all services
- ✅ Pandino OSGi component patterns
- ✅ PostgreSQL as default for production
- ✅ PocketBase integration support

## License

AGPL-3.0-only. See `LICENSE`.

## Contributing

We welcome contributions to this open-source project! Please see our contribution guidelines for more information.

## Contact

For questions or support, please open an issue on the GitHub repository.