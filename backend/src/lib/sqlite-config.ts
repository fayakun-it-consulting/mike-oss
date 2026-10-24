/**
 * SQLite-specific configuration helper for Pandino OSGi migration
 */

import { DatabaseConfiguration } from "./database-config";

/**
 * Create a default SQLite configuration for development
 */
export function createDefaultSqliteConfig(): DatabaseConfiguration {
  return {
    type: 'sqlite',
    url: 'file::memory:?cache=shared',
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
 * Create SQLite configuration for file-based database
 */
export function createFileSqliteConfig(filePath: string): DatabaseConfiguration {
  return {
    type: 'sqlite',
    url: `file:${filePath}`,
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
 * Create SQLite configuration with specific options
 */
export function createSqliteConfig(options?: {
  url?: string;
  enablePooling?: boolean;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
}): DatabaseConfiguration {
  const config: DatabaseConfiguration = {
    type: 'sqlite',
    url: options?.url || 'file::memory:?cache=shared',
    pooling: {
      enabled: options?.enablePooling !== false,
      min: 0,
      max: 0
    },
    logging: {
      enabled: true,
      level: options?.logLevel || 'info'
    }
  };
  
  return config;
}

// Export for easy consumption
export const SqliteConfig = {
  default: createDefaultSqliteConfig,
  file: createFileSqliteConfig,
  create: createSqliteConfig
};