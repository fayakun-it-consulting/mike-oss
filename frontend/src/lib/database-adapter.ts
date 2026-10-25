/**
 * Database adapter factory that prioritizes PocketBase as default
 * This allows switching between database implementations
 */

import { PocketBaseAdapter } from './db-adapters/pocketbase-adapter';
import { SupabaseAdapter } from './db-adapters/supabase-adapter';
import { SupabaseAuthAdapter } from './db-adapters/supabase-auth-adapter';
import { PocketBaseAuthAdapter } from './db-adapters/pocketbase-auth-adapter';
import { getDatabaseType } from './database-config';

// Configuration for database selection
export class DatabaseAdapter {
  static getAdapter(): any {
    const dbType = getDatabaseType();
    
    if (dbType === 'pocketbase') {
      return new PocketBaseAdapter();
    } else if (dbType === 'supabase' || dbType === 'postgresql') {
      return new SupabaseAdapter();
    } else {
      // Default to PocketBase for development
      return new PocketBaseAdapter();
    }
  }
  
  static getAuthAdapter(): any {
    const dbType = getDatabaseType();
    
    if (dbType === 'pocketbase') {
      return new PocketBaseAuthAdapter();
    } else if (dbType === 'supabase' || dbType === 'postgresql') {
      return new SupabaseAuthAdapter();
    } else {
      // Default to PocketBase for development
      return new PocketBaseAuthAdapter();
    }
  }
}

// Export for easy consumption
export const databaseAdapter = DatabaseAdapter.getAdapter();
export const authAdapter = DatabaseAdapter.getAuthAdapter();