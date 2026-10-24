/**
 * Database adapter factory that prioritizes PocketBase as default
 * This allows switching between database implementations
 */

import { PocketBaseAdapter } from './db-adapters/pocketbase-adapter';
import { SupabaseAdapter } from './db-adapters/supabase-adapter';

// Configuration for database selection
export class DatabaseAdapter {
  static getAdapter(): any {
    const dbType = process.env.DB_TYPE || 'pocketbase'; // Changed default to pocketbase
    
    if (dbType === 'pocketbase') {
      return new PocketBaseAdapter();
    } else if (dbType === 'supabase' || dbType === 'postgresql') {
      return new SupabaseAdapter();
    } else {
      // Default to PocketBase for development
      return new PocketBaseAdapter();
    }
  }
}

// Export for easy consumption
export const databaseAdapter = DatabaseAdapter.getAdapter();