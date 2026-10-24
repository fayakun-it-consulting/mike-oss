# Mike

Open-source release containing the Mike frontend and backend.

## Contents

- `frontend/` - Next.js application
- `backend/` - Express API, Supabase access, document processing, and migrations
- `backend/migrations/000_one_shot_schema.sql` - one-shot Supabase schema for fresh databases

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

## License

AGPL-3.0-only. See `LICENSE`.
# Database Backend Configuration

This project supports multiple database backends for flexibility in development and deployment:

## Available Backends

1. **SQLite** - For local development (default)
2. **PocketBase** - Single binary solution for development
3. **Supabase** - Production database solution

## Configuration

Set the `NEXT_PUBLIC_DATABASE_BACKEND` environment variable to choose your backend:

```bash
# For SQLite (development) - default
NEXT_PUBLIC_DATABASE_BACKEND=sqlite

# For PocketBase (single binary)
NEXT_PUBLIC_DATABASE_BACKEND=pocketbase
NEXT_PUBLIC_DATABASE_URL=http://localhost:8090

# For Supabase (production)
NEXT_PUBLIC_DATABASE_BACKEND=supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-anon-key
SUPABASE_SECRET_KEY=your-service-role-key
```

## How It Works

The system uses a flexible adapter pattern that:
- Automatically selects the appropriate backend based on configuration
- Provides the same interface to all frontend components
- Maintains compatibility across different database backends
- Allows easy switching between development and production configurations

## Development Setup

For local development with SQLite:
1. No additional setup needed - SQLite is enabled by default
2. All authentication and database operations work locally

For PocketBase development:
1. Install PocketBase: https://pocketbase.io/docs/
2. Run PocketBase server: `./pocketbase serve`
3. Set `NEXT_PUBLIC_DATABASE_BACKEND=pocketbase` in your `.env.local`

## Production Deployment

For production with Supabase:
1. Create a Supabase project
2. Configure your Supabase credentials
3. Set `NEXT_PUBLIC_DATABASE_BACKEND=supabase`
4. Deploy your frontend to Next.js with Supabase integration

The system maintains full compatibility across all backends, so your frontend code remains unchanged regardless of which backend you choose.