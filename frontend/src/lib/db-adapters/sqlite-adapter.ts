/**
 * SQLite Implementation for database adapter
 * Used for local development
 */

export class SQLiteAdapter {
  private currentUser: any = null;
  private profiles: Map<string, any> = new Map();

  constructor() {
    // Initialize with sample data for development
    this.initSampleData();
  }

  private initSampleData() {
    const sampleUser = {
      id: 'user-123',
      email: 'test@example.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const sampleProfile = {
      user_id: sampleUser.id,
      display_name: 'Test User',
      organisation: 'Test Org',
      message_credits_used: 0,
      credits_reset_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      credits_remaining: 999999,
      tier: 'Free',
      tabular_model: 'gemini-3-flash-preview',
      claude_api_key: null,
      gemini_api_key: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.currentUser = sampleUser;
    this.profiles.set(sampleUser.id, sampleProfile);
  }

  async getSession() {
    return {
      data: {
        session: this.currentUser ? {
          user: this.currentUser,
          access_token: 'dev-token',
          refresh_token: 'dev-refresh-token'
        } : null
      },
      error: null
    };
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return {
      data: { subscription: { unsubscribe: () => {} } },
      error: null
    };
  }

  async signOut() {
    this.currentUser = null;
    return { error: null };
  }

  async signIn(email: string, password: string) {
    if (email === 'test@example.com' && password === 'password') {
      const user = {
        id: 'user-123',
        email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      this.currentUser = user;
      return {
        data: {
          user,
          session: {
            user,
            access_token: 'dev-token',
            refresh_token: 'dev-refresh-token'
          }
        },
        error: null
      };
    }
    
    return {
      data: { user: null, session: null },
      error: 'Invalid credentials'
    };
  }

  async signUp(email: string, password: string) {
    if (email && password) {
      const user = {
        id: `user-${Date.now()}`,
        email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      this.currentUser = user;
      
      const profile = {
        user_id: user.id,
        display_name: null,
        organisation: null,
        message_credits_used: 0,
        credits_reset_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        credits_remaining: 999999,
        tier: 'Free',
        tabular_model: 'gemini-3-flash-preview',
        claude_api_key: null,
        gemini_api_key: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      this.profiles.set(user.id, profile);
      
      return {
        data: {
          user,
          session: {
            user,
            access_token: 'dev-token',
            refresh_token: 'dev-refresh-token'
          }
        },
        error: null
      };
    }
    
    return {
      data: { user: null, session: null },
      error: 'Invalid signup data'
    };
  }

  from(tableName: string) {
    return {
      select: (columns: string = '*') => ({
        eq: (column: string, value: any) => ({
          single: async () => {
            if (tableName === 'user_profiles' && this.currentUser) {
              const profile = this.profiles.get(this.currentUser.id);
              return {
                data: profile,
                error: null
              };
            }
            return {
              data: null,
              error: null
            };
          },
          data: []
        }),
        data: []
      }),
      update: (updates: any) => ({
        eq: (column: string, value: any) => ({
          then: async (callback: (result: any) => void) => {
            if (this.currentUser) {
              const existing = this.profiles.get(this.currentUser.id);
              if (existing) {
                const updatedProfile = {
                  ...existing,
                  ...updates,
                  updated_at: new Date().toISOString()
                };
                this.profiles.set(this.currentUser.id, updatedProfile);
                callback({
                  data: updatedProfile,
                  error: null
                });
                return;
              }
            }
            callback({
              data: null,
              error: null
            });
          },
          data: null
        }),
        data: null
      }),
      insert: (data: any) => ({
        then: async (callback: (result: any) => void) => {
          callback({
            data: data,
            error: null
          });
        },
        data: null
      }),
      delete: () => ({
        eq: (column: string, value: any) => ({
          then: async (callback: (result: any) => void) => {
            callback({
              data: null,
              error: null
            });
          },
          data: null
        }),
        data: null
      })
    };
  }
}