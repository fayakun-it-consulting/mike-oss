/**
 * PocketBase database adapter for frontend
 * This provides database access using PocketBase instead of Supabase
 */

// Mock implementation for development without actual PocketBase dependency
export class PocketBaseAdapter {
  private client: any = null;
  private isInitialized: boolean = false;

  constructor() {
    // For development, we'll create mock functionality
    console.log('Initializing PocketBase adapter for development');
  }

  async initialize(): Promise<void> {
    // In development, we'll use mock data instead of actual PocketBase
    this.isInitialized = true;
    console.log('PocketBase adapter initialized');
  }

  async getClient(): Promise<any> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Return mock client that simulates PocketBase behavior
    return {
      from: (tableName: string) => {
        return {
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
        };
      }
    };
  }

  async testConnection(): Promise<boolean> {
    console.log('Testing PocketBase connection (mock)');
    return true;
  }
}

// Export for easy usage
export const pocketbaseAdapter = new PocketBaseAdapter();