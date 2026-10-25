"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { databaseAdapter } from "@/lib/database-adapter";
import { authAdapter } from "@/lib/auth-adapter";

interface User {
    id: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    authLoading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const ensureProfile = async (accessToken: string) => {
            const apiBase =
                process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";
            await fetch(`${apiBase}/user/profile`, {
                method: "POST",
                headers: { Authorization: `Bearer ${accessToken}` },
            }).catch((e) => {
                console.log(e);
            });
        };

        const checkUser = async () => {
            try {
                const session = await authAdapter.getCurrentSession();

                if (session && session.user) {
                    setUser({
                        id: session.user.id,
                        email: session.user.email || "",
                    });
                    
                    // Explicitly type-cast or enforce that this resolves to string | null
                    const token: string | null = await authAdapter.getToken();
                    
                    // Only execute if token is a valid string, protecting against null values
                    if (token) {
                        await ensureProfile(token);
                    }
                }
            } catch (e) {
                console.error("Initial auth check failed:", e);
            } finally {
                setAuthLoading(false);
            }
        };

        checkUser();

        const unsubscribe = authAdapter.onAuthStateChange((session) => {
        if (session?.user) {
            setUser(session.user);
            } else {
            setUser(null);
            }
            setAuthLoading(false);
        });

        // This cleans up memory safely regardless of Supabase or PocketBase being active
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    const signOut = async () => {
        try {
            // Call our unified authAdapter layer instead of separate database tools
            await authAdapter.signOut();
        } catch (e) {
            console.error("Failed to sign out user session:", e);
        } finally {
            // Explicitly reset local React state values regardless of structural errors
            setUser(null);
        }
    };


    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                authLoading,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}