/**
 * Database configuration for Pandino OSGi migration
 * This file provides configuration for switching between SQLite and PostgreSQL.
 */

export interface DatabaseConfiguration {
  type: 'sqlite' | 'postgresql';
  url?: string;
  connectionOptions?: {
    [key: string]: any;
  };
  pooling?: {
    enabled: boolean;
    min?: number;
    max?: number;
    idleTimeout?: number;
  };
  logging?: {
    enabled: boolean;
    level?: 'debug' | 'info' | 'warn' | 'error';
  };
}

export class DatabaseConfigurationFactory {
  /**
   * Create configuration from environment variables
   */
  static fromEnvironment(): DatabaseConfiguration {
    return {
      type: (process.env.DB_TYPE || 'sqlite') as 'sqlite' | 'postgresql',
      url: process.env.DATABASE_URL,
      pooling: {
        enabled: process.env.DB_POOLING !== 'false',
        min: parseInt(process.env.DB_POOL_MIN || '2'),
        max: parseInt(process.env.DB_POOL_MAX || '10'),
        idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT || '30000')
      },
      logging: {
        enabled: process.env.DB_LOGGING !== 'false',
        level: process.env.DB_LOG_LEVEL as any || 'info'
      }
    };
  }
  
  /**
   * Create default configuration
   */
  static default(): DatabaseConfiguration {
    return {
      type: 'sqlite', // Changed to SQLite as default
      pooling: {
        enabled: false
      },
      logging: {
        enabled: true,
        level: 'info'
      }
    };
  }
  
  /**
   * Create SQLite configuration
   */
  static sqlite(url: string): DatabaseConfiguration {
    return {
      type: 'sqlite',
      url,
      pooling: {
        enabled: false
      },
      logging: {
        enabled: true,
        level: 'info'
      }
    };
  }
  
  /**
   * Create PostgreSQL configuration
   */
  static postgresql(url: string): DatabaseConfiguration {
    return {
      type: 'postgresql',
      url,
      pooling: {
        enabled: true,
        min: 2,
        max: 10
      },
      logging: {
        enabled: true,
        level: 'info'
      }
    };
  }
}

// Export configuration for use in Pandino components
export const Config = DatabaseConfigurationFactory;