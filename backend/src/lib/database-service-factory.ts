/**
 * Database service factory for Pandino OSGi components
 * This factory creates appropriate database services based on configuration.
 */

import { DatabaseService } from "./database-abstraction";
import { DatabaseConfig } from "./database-config";
import { PostgreSqlDatabaseConnection } from "./postgresql-connection";
import { PocketBaseDatabaseConnection } from "./pocketbase-connection";

export class DatabaseServiceFactory {
  /**
   * Create a database service based on configuration
   */
  static create(config: DatabaseConfig): DatabaseService {
    switch (config.type) {
      case 'postgresql':
        return new PostgreSqlDatabaseConnection(config);
      case 'pocketbase':
        return new PocketBaseDatabaseConnection(config);
      default:
        throw new Error(`Unsupported database type: ${config.type}`);
    }
  }

  /**
   * Create a database service from environment variables
   * Defaults to PostgreSQL for production
   */
  static createFromEnvironment(): DatabaseService {
    const type = process.env.DB_TYPE as 'postgresql' | 'pocketbase' || 'postgresql';
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
    const type = 'postgresql'; // Default to PostgreSQL
    const url = process.env.DATABASE_URL;
    
    const config: DatabaseConfig = {
      type,
      url
    };
    
    return this.create(config);
  }
}

// Export for easy consumption in Pandino components
export const DatabaseService = DatabaseServiceFactory;