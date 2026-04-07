import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface AuthUser {
    id: number;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
}

interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    sessionExpiry: number | null;
    login: (user: AuthUser) => void;
    logout: () => void;
    checkSession: () => boolean;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            sessionExpiry: null,
            login: (user) => set({
                user,
                isAuthenticated: true,
                sessionExpiry: Date.now() + SESSION_DURATION_MS,
            }),
            logout: () => set({
                user: null,
                isAuthenticated: false,
                sessionExpiry: null,
            }),
            checkSession: () => {
                const { sessionExpiry } = get();
                if (!sessionExpiry || Date.now() > sessionExpiry) {
                    set({ user: null, isAuthenticated: false, sessionExpiry: null });
                    return false;
                }
                return true;
            },
        }),
        {
            name: 'voltlink-auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
