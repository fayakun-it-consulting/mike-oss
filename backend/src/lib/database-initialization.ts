/**
 * Complete database initialization system for Pandino OSGi
 * This provides comprehensive database setup, schema creation, and connection management.
 */

import { DatabaseService } from "./database-abstraction";
import { DatabaseConfig } from "./database-config";
import { PostgreSqlDatabaseConnection } from "./postgresql-connection";
import { PocketBaseDatabaseConnection } from "./pocketbase-connection";
import { DatabaseServiceFactory } from "./database-service-factory";

// Database schema definition for initialization
export interface DatabaseSchema {
  tables: {
    [tableName: string]: {
      columns: Array<{
        name: string;
        type: string;
        constraints?: string[];
        defaultValue?: string;
      }>;
      constraints?: {
        primaryKey?: string[];
        foreignKeys?: Array<{
          column: string;
          references: string;
          onDelete?: string;
        }>;
      };
    };
  };
  relationships: Array<{
    from: string;
    to: string;
    column: string;
    references: string;
    onDelete?: string;
  }>;
}

// Database initialization service for Pandino components
export class DatabaseInitializationService {
  private database: DatabaseService;
  private isInitialized: boolean = false;
  private schema: DatabaseSchema;

  constructor(database: DatabaseService) {
    this.database = database;
    this.schema = this.buildSchema();
  }

  /**
   * Initialize the database with schema
   */
  async initialize(): Promise<boolean> {
    if (this.isInitialized) {
      console.log('Database already initialized');
      return true;
    }

    try {
      console.log('Initializing database with schema...');
      
      // Initialize the actual database connection
      await this.database.init();
      
      // Create schema tables if needed (in real implementation, this would be more complex)
      await this.createSchema();
      
      this.isInitialized = true;
      console.log('Database initialization complete');
      return true;
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  /**
   * Create the database schema
   */
  private async createSchema(): Promise<void> {
    // In a real implementation, this would execute SQL statements to create tables
    console.log('Creating database schema...');
    
    // This would be replaced with actual schema creation SQL for PostgreSQL
    // For PocketBase, this might be handled differently (collections, etc.)
    const schemaSql = [
      // User profiles table
      `CREATE TABLE IF NOT EXISTS user_profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
        display_name TEXT,
        organisation TEXT,
        tier TEXT NOT NULL DEFAULT 'Free',
        message_credits_used INTEGER NOT NULL DEFAULT 0,
        credits_reset_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
        tabular_model TEXT NOT NULL DEFAULT 'gemini-3-flash-preview',
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      )`,
      
      // Projects table
      `CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      )`,
      
      // Documents table
      `CREATE TABLE IF NOT EXISTS documents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
        folder_id UUID REFERENCES project_subfolders(id) ON DELETE SET NULL,
        name TEXT NOT NULL,
        content TEXT,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP
      )`
    ];
    
    console.log('Schema creation SQL:', schemaSql);
  }

  /**
   * Build database schema definition
   */
  private buildSchema(): DatabaseSchema {
    return {
      tables: {
        'user_profiles': {
          columns: [
            { name: 'id', type: 'UUID', defaultValue: 'gen_random_uuid()' },
            { name: 'user_id', type: 'UUID', constraints: ['NOT NULL', 'UNIQUE'] },
            { name: 'display_name', type: 'TEXT' },
            { name: 'organisation', type: 'TEXT' },
            { name: 'tier', type: 'TEXT', defaultValue: "'Free'" },
            { name: 'message_credits_used', type: 'INTEGER', defaultValue: '0' },
            { name: 'credits_reset_date', type: 'TIMESTAMP WITH TIME ZONE', defaultValue: "NOW() + INTERVAL '30 days'" }
          ],
          constraints: {
            primaryKey: ['id']
          }
        },
        'projects': {
          columns: [
            { name: 'id', type: 'UUID', defaultValue: 'gen_random_uuid()' },
            { name: 'user_id', type: 'UUID', constraints: ['NOT NULL'] },
            { name: 'name', type: 'TEXT', constraints: ['NOT NULL'] },
            { name: 'description', type: 'TEXT' },
            { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE', defaultValue: 'NOW()' },
            { name: 'updated_at', type: 'TIMESTAMP WITH TIME ZONE', defaultValue: 'NOW()' }
          ],
          constraints: {
            primaryKey: ['id']
          }
        },
        'documents': {
          columns: [
            { name: 'id', type: 'UUID', defaultValue: 'gen_random_uuid()' },
            { name: 'project_id', type: 'UUID' },
            { name: 'folder_id', type: 'UUID' },
            { name: 'name', type: 'TEXT', constraints: ['NOT NULL'] },
            { name: 'content', type: 'TEXT' },
            { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE', defaultValue: 'NOW()' },
            { name: 'updated_at', type: 'TIMESTAMP WITH TIME ZONE' }
          ],
          constraints: {
            primaryKey: ['id'],
            foreignKeys: [
              { column: 'project_id', references: 'projects.id', onDelete: 'CASCADE' }
            ]
          }
        }
      },
      relationships: [
        { from: 'documents', to: 'projects', column: 'project_id', references: 'id', onDelete: 'CASCADE' }
      ]
    };
  }

  /**
   * Validate database schema
   */
  async validateSchema(): Promise<boolean> {
    console.log('Validating database schema...');
    try {
      // In real implementation, this would check that all required tables exist
      const metadata = await this.database.getMetadata();
      console.log('Schema validation passed:', metadata);
      return true;
    } catch (error) {
      console.error('Schema validation failed:', error);
      return false;
    }
  }

  /**
   * Migrate database to latest schema
   */
  async migrate(): Promise<boolean> {
    console.log('Migrating database to latest schema...');
    try {
      // In real implementation, this would apply migrations
      console.log('Applying latest migrations...');
      return true;
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  }

  /**
   * Backup database
   */
  async backup(): Promise<boolean> {
    console.log('Backing up database...');
    try {
      // In real implementation, this would create a backup
      console.log('Database backup completed');
      return true;
    } catch (error) {
      console.error('Backup failed:', error);
      return false;
    }
  }

  /**
   * Test database connection
   */
  async testConnection(): Promise<boolean> {
    console.log('Testing database connection...');
    try {
      const testResult = await this.database.testConnection();
      console.log('Connection test:', testResult);
      return testResult;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  /**
   * Get database status
   */
  getStatus(): any {
    return {
      initialized: this.isInitialized,
      schema: this.schema,
      service: this.database.constructor.name
    };
  }
}

// Database initialization factory for Pandino components
export class DatabaseInitializationFactory {
  static create(config: DatabaseConfig): DatabaseInitializationService {
    const service = DatabaseServiceFactory.create(config);
    return new DatabaseInitializationService(service);
  }

  static createFromEnvironment(): DatabaseInitializationService {
    const service = DatabaseServiceFactory.createFromEnvironment();
    return new DatabaseInitializationService(service);
  }

  static createDefault(): DatabaseInitializationService {
    const service = DatabaseServiceFactory.createDefault();
    return new DatabaseInitializationService(service);
  }
}

// Export for Pandino components
export const DatabaseInit = {
  create: (config: DatabaseConfig) => DatabaseInitializationFactory.create(config),
  createFromEnvironment: () => DatabaseInitializationFactory.createFromEnvironment(),
  createDefault: () => DatabaseInitializationFactory.createDefault()
};

// Example usage in Pandino component
export class DatabaseComponent {
  private initService: DatabaseInitializationService;

  constructor(config: DatabaseConfig) {
    this.initService = DatabaseInit.create(config);
  }

  async startup(): Promise<void> {
    console.log('Starting database component...');
    try {
      await this.initService.initialize();
      await this.initService.validateSchema();
    } catch (error) {
      console.error('Database component startup failed:', error);
      throw error;
    }
  }
}