/**
 * Database configuration helper functions
 */

/**
 * Get the current database backend type
 * @returns Database backend type ('supabase', 'pocketbase', etc.)
 */
export function getDatabaseType(): string {
  // Check frontend environment variable first
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_DATABASE_BACKEND || 'pocketbase';
  }
  
  // For server-side, check backend environment variable
  return process.env.DATABASE_BACKEND || process.env.NEXT_PUBLIC_DATABASE_BACKEND || 'pocketbase';
}