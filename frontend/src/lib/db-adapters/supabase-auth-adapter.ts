/**
 * Supabase authentication adapter
 */

import { supabase } from "../supabase";
import { AdapterSession, AuthAdapter } from "../auth-adapter";

export class SupabaseAuthAdapter implements AuthAdapter {
  async getAuthHeader(): Promise<Record<string, string>> {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.access_token) return {};
    return { Authorization: `Bearer ${session.access_token}` };
  }
  
  async getUserFromToken(token: string): Promise<{
    email: string;
    id: string;
  } | null> {
    try {
      return this.getUser();
    } catch (error) {
      console.error('[Auth] Error validating token:', error);
      return null;
    }
  }

  async getUser(): Promise<{
    email: string;
    id: string;
  } | null> {
    try{
      // Validate with Supabase
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
      );

      
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        console.error('No active session found:', error?.message);
        return null;
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser(data.session?.access_token);

      if (error || !user) {
        console.warn('[Auth] Invalid or expired token:', userError?.message);
        return null;
      }

      if (!user.email) {
        console.warn('[Auth] User has no email');
        return null;
      }

      console.log(`[Auth] User authenticated: ${user.email}`);
      return {
        email: user.email,
        id: user.id
      };
      return null;
    } catch (error) {
      console.error('[Auth] Error validating token:', error);
      return null;
    }
  }

  async getToken(): Promise<string | null> {
    // Validate with Supabase
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
    );

    const { data: { session } } = await supabase.auth.getSession();

    return session?.access_token || null; // Returns string | null
    
  }

  async getCurrentSession(): Promise<AdapterSession | null> {
    // 1. Fetch the session layer natively from Supabase's client instance
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session || !session.user) {
      return null;
    }

    // 2. Format the response to perfectly match the unified AdapterSession layout
    return {
      user: {
        id: session.user.id,
        email: session.user.email || "",
      },
      accessToken: session.access_token,
    };
  }

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Supabase sign out error:", error.message);
      throw error;
    }
  }

  async onAuthStateChange(callback: any) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Handle cleanup on logout or empty sessions
      if (!session || !session.user) {
        callback(null);
        return;
      }

      // Format the data cleanly for the React hook context
      callback({
        user: {
          id: session.user.id,
          email: session.user.email || "",
        },
        accessToken: session.access_token,
      });
    });

    // Return the native teardown function directly back to useEffect's cleanup return
    return () => {
      subscription.unsubscribe();
    };
  }

}