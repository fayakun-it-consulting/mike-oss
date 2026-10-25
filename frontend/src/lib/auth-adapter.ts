/**
 * Authentication adapter interface for database-agnostic authentication
 */

export interface AdapterSession {
  user: {
    id: string;
    email: string;
  } | null;
  accessToken: string;
}

export interface AuthAdapter {
  /**
   * Get authentication headers for API requests
   * @returns Promise resolving to authentication headers object
   */
  getAuthHeader(): Promise<Record<string, string>>;
  
  /**
   * Validate user from token
   * @returns Promise resolving to user info or null
   */
  getUserFromToken(token: string): Promise<{
    email: string;
    id: string;
  } | null>;

  getCurrentSession(): Promise<AdapterSession | null>;

  /**
   * Clears active session states, tokens, and storage contexts.
   */
  signOut(): Promise<void>;
    
  getToken(): Promise< string  | null>;
  
  onAuthStateChange(callback: (session: AdapterSession | null) => void):;
  
};

// Export for easy consumption
export const authAdapter: AuthAdapter = {
  async getAuthHeader(): Promise<Record<string, string>> {
    // Default implementation - this will be overridden by specific adapters
    return {};
  },
  
  async getUserFromToken(token: string): Promise<{
    email: string;
    id: string;
  } | null> {
    // Default implementation
    return null;
  },

  async getCurrentSession(): Promise<AdapterSession | null>{
    return null;
  },

  async getToken(): Promise< string  | null>{
    return null;
  },

  /**
   * Clears active session states, tokens, and storage contexts.
   */
  async signOut(): Promise<void>{
  },

  async onAuthStateChange(callback: (session: AdapterSession | null) => void){
    return null;
  }

};