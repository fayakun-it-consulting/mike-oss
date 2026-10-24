/**
 * Supabase database adapter for frontend
 * This provides database access using Supabase
 */

import { createClient } from '@supabase/supabase-js';

export class SupabaseAdapter {
  private client: any = null;
  private isInitialized: boolean = false;

  constructor() {
    console.log('Initializing Supabase adapter');
  }

  async initialize(): Promise<void> {
    try {
      // In development, we'll create a mock for cases where Supabase is needed
      // But we'll log that this is a fallback
      this.isInitialized = true;
      console.log('Supabase adapter initialized (fallback mode)');
    } catch (error) {
      console.error('Error initializing Supabase adapter:', error);
    }
  }

  async getClient(): Promise<any> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // If we're in development and want to use PocketBase instead, we'll return mock
    const dbType = process.env.DB_TYPE || 'supabase';
    
    if (dbType !== 'supabase') {
      console.log('Using PocketBase instead of Supabase in development');
      return null; // Return null to indicate we want to use PocketBase
    }

    // Otherwise, create actual Supabase client
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '';
      
      if (!supabaseUrl) {
        // In development, we don't need to create a real client
        console.log('Supabase URL not configured, returning mock client');
        return {
          from: (tableName: string) => ({
            select: (query: string) => ({
              eq: (column: string, value: any) => ({
                single: async () => {
                  return {
                    data: null,
                    error: null
                  };
                }
              }),
              data: []
            }),
            insert: (data: any) => ({
              then: async (callback: any) => {
                callback({
                  data: data,
                  error: null
                });
              },
              data: null
            }),
            update: (data: any) => ({
              eq: (column: string, value: any) => ({
                then: async (callback: any) => {
                  callback({
                    data: data,
                    error: null
                  });
                }
              }),
              data: null
            })
          });
        };
      }
      
      return createClient(supabaseUrl, supabaseAnonKey);
    } catch (e) {
      console.error('Supabase client not available', e);
      return null;
    }
  }
}