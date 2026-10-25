import { NextRequest } from 'next/server';
import { authAdapter } from './auth-adapter';

/**
 * Extract and validate user from JWT token
 * Returns user info if valid, null if invalid or missing
 * This function uses the database-agnostic auth adapter
 *
 * @param request NextRequest with Authorization header
 * @returns User object with email and id, or null
 */
export async function getUserFromRequest(request: NextRequest): Promise<{
  email: string;
  id: string;
} | null> {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);

    if (!token) {
      return null;
    }

    // Use the database-agnostic auth adapter to validate the token
    return await authAdapter.getUserFromToken(token);
  } catch (error) {
    console.error('[Auth] Error validating token:', error);
    return null;
  }
}
