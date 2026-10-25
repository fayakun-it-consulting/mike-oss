/**
 * PocketBase authentication adapter
 */
import PocketBase from 'pocketbase';
import { AdapterSession, AuthAdapter } from "../auth-adapter";

export class PocketBaseAuthAdapter implements AuthAdapter {
  async getAuthHeader(): Promise<Record<string, string>> {

    const pb = new PocketBase('http://127.0.0.1:8090');

    if (!pb.authStore.token) return {};
    return { Authorization: `Bearer ${pb.authStore.token}` };
  }
  
  async getUserFromToken(token: string): Promise<{
    email: string;
    id: string;
  } | null> {
    try{
      // For PocketBase, token validation would typically be done on the backend
      // This frontend method returns null since backend validation is expected
      const pb = new PocketBase('http://127.0.0.1:8090');

      if (pb.authStore.isValid) {
        console.log(`[Auth] User authenticated: ${pb.authStore.record}`);
        return {
          email: pb.authStore.record?.username,
          id: pb.authStore.record!.id
        };
      } 
      return null;
    } catch (error) {
      console.error('[Auth] Error validating token:', error);
      return null;
    }
  }

  async getToken(): Promise<string | null> {
    // For PocketBase, token validation would typically be done on the backend
      // This frontend method returns null since backend validation is expected
      const pb = new PocketBase('http://127.0.0.1:8090');
      return pb.authStore.token || null; // Returns string | null

  }

  async getCurrentSession(): Promise<AdapterSession | null> {

    // For PocketBase, token validation would typically be done on the backend
      // This frontend method returns null since backend validation is expected
    const pb = new PocketBase('http://127.0.0.1:8090');
    
    // 1. Verify if the client-side store contains a non-expired token and user record
    const isValid = pb.authStore.isValid;
    const record = pb.authStore.record;

    if (!isValid || !record) {
      return null;
    }

    // 2. Format the PocketBase AuthRecord parameters into your common application shape
    return {
      user: {
        id: record.id,
        email: record.email || "",
      },
      accessToken: pb.authStore.token,
    };
  }

  async onAuthStateChange(callback:any) {

    // For PocketBase, token validation would typically be done on the backend
      // This frontend method returns null since backend validation is expected
    const pb = new PocketBase('http://127.0.0.1:8090');
    // pb.authStore.onChange returns a function that, when executed, stops the listener
    const unsubscribe = pb.authStore.onChange((token, record) => {
      // If either the token or record is cleared, the user is signed out
      if (!token || !record) {
        callback(null);
        return;
      }

      // Map PocketBase auth record schema to matches your custom app User schema
      callback({
        user: {
          id: record.id,
          email: record.email || "", 
        },
        accessToken: token,
      });
    });

    // Pass the native unbind execution straight to the standard execution stack
    return unsubscribe;
  }

  async signOut(): Promise<void> {
    // For PocketBase, token validation would typically be done on the backend
      // This frontend method returns null since backend validation is expected
    const pb = new PocketBase('http://127.0.0.1:8090');
    // Synchronously clears the cookie
    // /local storage token store container
    pb.authStore.clear();
    
    // We return a resolved promise to remain compliant with our asynchronous interface
    return Promise.resolve();
  }
      
}