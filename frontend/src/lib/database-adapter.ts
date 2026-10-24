/**
 * Flexible database adapter for SQLite, PocketBase, or Supabase
 * This configuration allows switching between different backend implementations
 * based on environment variables.
 */

import { SQLiteAdapter } from './db-adapters/sqlite-adapter';
import { PocketBaseAdapter } from './db-adapters/pocketbase-adapter';
import { SupabaseAdapter } from './db-adapters/supabase-adapter';

// Configuration interface
interface DatabaseConfig {
  backend: 'sqlite' | 'pocketbase' | 'supabase';
  url?: string;
  apiKey?: string;
}

// Get configuration from environment
export const getDatabaseConfig = (): DatabaseConfig => {
  const backend = process.env.NEXT_PUBLIC_DATABASE_BACKEND || 'sqlite';
  
  return {
    backend: backend as 'sqlite' | 'pocketbase' | 'supabase',
    url: process.env.NEXT_PUBLIC_DATABASE_URL,
    apiKey: process.env.NEXT_PUBLIC_DATABASE_API_KEY
  };
};

// Base interface for database operations
export interface DatabaseAdapter {
  // Auth methods
  getSession(): Promise<any>;
  onAuthStateChange(callback: (event: string, session: any) => void): any;
  signOut(): Promise<any>;
  signIn(email: string, password: string): Promise<any>;
  signUp(email: string, password: string): Promise<any>;

  // Database operations
  from(tableName: string): any;
}

// Factory to create the appropriate adapter based on config
export const createDatabaseAdapter = (): DatabaseAdapter => {
  const config = getDatabaseConfig();
  
  switch (config.backend) {
    case 'sqlite':
      return new SQLiteAdapter();
    case 'pocketbase':
      return new PocketBaseAdapter();
    case 'supabase':
      return new SupabaseAdapter();
    default:
      return new SQLiteAdapter(); // Default to SQLite
  }
};

// Export the adapter for use throughout the application
export const databaseAdapter = createDatabaseAdapter();