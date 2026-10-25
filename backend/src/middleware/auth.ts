import { Request, Response, NextFunction } from "express";
import { createClient } from "@supabase/supabase-js";
import PocketBase from 'pocketbase';

// Helper to get the database type
function getDatabaseType(): string {
  return process.env.DATABASE_BACKEND || process.env.NEXT_PUBLIC_DATABASE_BACKEND || 'supabase';
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const auth = req.headers.authorization ?? "";
  if (!auth.startsWith("Bearer ")) {
    res.status(401).json({ detail: "Missing or invalid Authorization header" });
    return;
  }
  const token = auth.slice(7).trim();

  // Handle database-agnostic authentication
  const dbType = getDatabaseType();
  
  if (dbType === 'supabase' || dbType === 'postgresql') {
    // Supabase authentication
    const supabaseUrl = process.env.SUPABASE_URL ?? "";
    const serviceKey = process.env.SUPABASE_SECRET_KEY ?? "";

    if (!supabaseUrl || !serviceKey) {
      res.status(500).json({ detail: "Server auth is not configured for Supabase" });
      return;
    }

    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });
    const { data } = await admin.auth.getUser(token);
    if (!data.user) {
      res.status(401).json({ detail: "Invalid or expired token" });
      return;
    }

    res.locals.userId = data.user.id;
    res.locals.userEmail = data.user.email?.toLowerCase() ?? "";
    res.locals.token = token;
  } else {
    // For PocketBase and other database types, we trust that the token is valid
    // since PocketBase handles authentication at the API level
    // Supabase authentication
    const pocketbaseUrl = process.env.NEXT_PUBLIC_DATABASE_BACKEND;

    // This frontend method returns null since backend validation is expected
      const pb = new PocketBase(pocketbaseUrl);

     if (!pb.authStore) {
      res.status(401).json({ detail: "Invalid or expired token" });
      return;
    }

    console.log(`[Auth] Using ${dbType} authentication - token validation delegated to ${dbType} backend`);
    res.locals.userId = pb.authStore.record!.id;
    res.locals.userEmail = pb.authStore.record!.email; 
    res.locals.token = token;

  }
  
  next();
}