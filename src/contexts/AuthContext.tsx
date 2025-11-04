"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    sendEmailVerification,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    User
} from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { DBUser } from "@/types/user";
import axios from "axios";
import { CheckUserExists } from "@/utils/user";

type AuthContextType = {
    user: User | null;
    dbUser: DBUser | null;
    needsCompleteSetup: boolean;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [dbUser, setDbUser] = useState<DBUser | null>(null);
    const [needsCompleteSetup, setNeedsCompleteSetup] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                const token = await currentUser.getIdTokenResult();
                setToken(token.token);

                const dbUser = await CheckUserExists(token.token);
                if (dbUser) {
                    setDbUser(dbUser);
                    setNeedsCompleteSetup(false);
                } else {
                    setDbUser(null);
                    setNeedsCompleteSetup(true);
                }
            } else {
                setDbUser(null);
                setNeedsCompleteSetup(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const register = async (
        name: string,
        email: string,
        password: string
    ): Promise<void> => {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            await updateProfile(userCredential.user, { displayName: name });
            await sendEmailVerification(userCredential.user);
        } catch (error) {
            console.error("Registration failed:", error);
            throw error;
        }
    };

    // Login function
    const login = async (email: string, password: string): Promise<void> => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    // Login with Google
    const loginWithGoogle = async (): Promise<void> => {
        try {
            await signInWithPopup(auth, new GoogleAuthProvider());
        } catch (error) {
            console.error("Google login failed:", error);
            throw error;
        }
    };


    // Logout function
    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout failed:", error);
            throw error;
        }
    };

    // Reset password
    const resetPassword = async (email: string) => {
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (error) {
            console.error("Password reset failed:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                dbUser,
                needsCompleteSetup,
                token,
                login,
                loginWithGoogle,
                logout,
                register,
                resetPassword,
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