/**
 * Database configuration for Pandino OSGi migration
 * This file provides configuration for switching between PostgreSQL and PocketBase.
 */

export interface DatabaseConfiguration {
  type: 'postgresql' | 'pocketbase';
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
      type: (process.env.DB_TYPE || 'postgresql') as 'postgresql' | 'pocketbase',
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
      type: 'postgresql', // Changed to PostgreSQL as default
      pooling: {
        enabled: true
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
  
  /**
   * Create PocketBase configuration
   */
  static pocketbase(url: string): DatabaseConfiguration {
    return {
      type: 'pocketbase',
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
}

// Export configuration for use in Pandino components
export const Config = DatabaseConfigurationFactory;