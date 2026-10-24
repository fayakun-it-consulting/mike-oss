/**
 * Database service factory for Pandino OSGi components
 * This factory creates appropriate database services based on configuration.
 */

import { DatabaseService } from "./database-abstraction";
import { DatabaseConfig } from "./database-config";
import { SqliteDatabaseConnection } from "./sqlite-connection";
import { PostgreSqlDatabaseConnection } from "./postgresql-connection";

export class DatabaseServiceFactory {
  /**
   * Create a database service based on configuration
   */
  static create(config: DatabaseConfig): DatabaseService {
    switch (config.type) {
      case 'sqlite':
        return new SqliteDatabaseConnection(config);
      case 'postgresql':
        return new PostgreSqlDatabaseConnection(config);
      default:
        throw new Error(`Unsupported database type: ${config.type}`);
    }
  }

  /**
   * Create a database service from environment variables
   * Defaults to SQLite for development
   */
  static createFromEnvironment(): DatabaseService {
    const type = process.env.DB_TYPE as 'sqlite' | 'postgresql' || 'sqlite';
    const url = process.env.DATABASE_URL;
    
    const config: DatabaseConfig = {
      type,
      url
    };
    
    return this.create(config);
  }

  /**
   * Create a database service with default configuration
   */
  static createDefault(): DatabaseService {
    const type = 'sqlite'; // Default to SQLite
    const url = process.env.DATABASE_URL || 'file::memory:?cache=shared';
    
    const config: DatabaseConfig = {
      type,
      url
    };
    
    return this.create(config);
  }
}

// Export for easy consumption in Pandino components
export const DatabaseService = DatabaseServiceFactory;