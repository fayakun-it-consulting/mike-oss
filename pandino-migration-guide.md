# Pandino OSGi Migration Guide - Database Abstraction

## Overview

This guide outlines how to migrate existing Supabase-based database operations to use Pandino's component-based architecture with database abstraction.

## Current Architecture

### Supabase Integration
The current implementation uses Supabase JavaScript SDK directly:
- `@supabase/supabase-js` client
- Direct PostgreSQL operations
- Environment-based configuration

### Migration Requirements
- Maintain database compatibility
- Support both SQLite and PostgreSQL
- Follow Pandino OSGi component patterns
- Preserve existing API interfaces

## Database Abstraction Implementation

### 1. Database Service Interface
```typescript
export interface DatabaseService {
  executeQuery(query: DatabaseQuery): Promise<any>;
  executeTransaction(transaction: DatabaseTransaction): Promise<boolean>;
  beginTransaction(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  getMetadata(): Promise<{ type: string; version: string; connected: boolean }>;
}
```

### 2. Configuration Management
```typescript
export class DatabaseConfigurationFactory {
  static fromEnvironment(): DatabaseConfiguration {
    return {
      type: (process.env.DB_TYPE || 'postgresql') as 'sqlite' | 'postgresql',
      url: process.env.DATABASE_URL,
      pooling: {
        enabled: process.env.DB_POOLING !== 'false',
        min: parseInt(process.env.DB_POOL_MIN || '2'),
        max: parseInt(process.env.DB_POOL_MAX || '10')
      }
    };
  }
}
```

## Migration Steps

### Step 1: Replace Database Dependencies
Replace direct Supabase imports with abstraction layer:
```typescript
// Before
import { createServerSupabase } from "./supabase";

// After  
import { Database } from "./database-abstraction";
import { Config } from "./database-config";
```

### Step 2: Update Service Initialization
```typescript
// Initialize database service
const config = Config.fromEnvironment();
const database = Database.createService(config);
```

### Step 3: Modify Query Execution
```typescript
// Before
const { data } = await supabase.from("projects").select("*").eq("id", id);

// After
const query = {
  sql: "SELECT * FROM projects WHERE id = ?",
  params: [id]
};
const result = await database.executeQuery(query);
```

## Component Integration Pattern

### 1. Create Database Component
```typescript
@Component
export class DatabaseComponent {
  @Service
  private database: DatabaseService;
  
  @Post("/projects")
  async createProject(project: Project): Promise<Project> {
    const query = {
      sql: "INSERT INTO projects (name, user_id) VALUES (?, ?)",
      params: [project.name, project.userId]
    };
    await this.database.executeQuery(query);
    return project;
  }
}
```

### 2. Configuration-based Component
```typescript
@Component
export class ProjectService {
  private database: DatabaseService;
  
  constructor(config: DatabaseConfiguration) {
    this.database = Database.createService(config);
  }
  
  async getProjects(userId: string): Promise<Project[]> {
    const query = {
      sql: "SELECT * FROM projects WHERE user_id = ?",
      params: [userId]
    };
    const result = await this.database.executeQuery(query);
    return result.data;
  }
}
```

## Environment Variables

### Required Variables
- `DB_TYPE`: "sqlite" or "postgresql" (default: "postgresql")
- `DATABASE_URL`: Database connection string
- `DB_POOLING`: "true" or "false" (default: "true")
- `DB_POOL_MIN`: Minimum pool size (default: 2)
- `DB_POOL_MAX`: Maximum pool size (default: 10)

## Testing Strategy

### Unit Tests
- Test database abstraction interface
- Verify configuration loading
- Validate transaction handling

### Integration Tests
- Test database service creation
- Verify query execution
- Confirm transaction behavior

## Migration Timeline

### Phase 1: Abstraction Layer
- Create database abstraction services
- Implement SQLite and PostgreSQL services
- Add configuration factory

### Phase 2: Component Integration
- Replace database access in services
- Update API endpoints
- Test transaction behavior

### Phase 3: Migration Validation
- Verify existing functionality
- Test both database types
- Validate performance

## Best Practices

1. **Component Registration**
   - Register database services as OSGi components
   - Use dependency injection for service injection
   - Provide configuration via environment variables

2. **Transaction Management**
   - Use database abstraction for all transaction operations
   - Handle transaction boundaries consistently
   - Implement rollback strategies

3. **Configuration Patterns**
   - Load configuration from environment at startup
   - Validate configuration at component initialization
   - Support runtime configuration changes

## Implementation Notes

- The abstraction layer maintains backward compatibility
- Existing database queries can be gradually migrated
- Component-based architecture enables better service discovery
- Configuration allows switching between database types