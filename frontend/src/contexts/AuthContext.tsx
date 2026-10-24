"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { databaseAdapter } from "@/lib/database-adapter";

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
            const { data, error } = await databaseAdapter.getSession();

            if (data?.session?.user) {
                setUser({
                    id: data.session.user.id,
                    email: data.session.user.email || "",
                });
                if (data.session.access_token) {
                    ensureProfile(data.session.access_token);
                }
            }
            setAuthLoading(false);
        };

        checkUser();

        const { data: { subscription } } = databaseAdapter.onAuthStateChange(
            async (_event, session) => {
                if (session?.user) {
                    setUser({
                        id: session.user.id,
                        email: session.user.email || "",
                    });
                    if (session.access_token) {
                        ensureProfile(session.access_token);
                    }
                } else {
                    setUser(null);
                }
                setAuthLoading(false);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        await databaseAdapter.signOut();
        setUser(null);
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