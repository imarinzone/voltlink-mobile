import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Role = 'driver' | 'b2c' | null;

interface RoleState {
    activeRole: Role;
    setRole: (role: 'driver' | 'b2c') => void;
    switchRole: () => void;
}

export const useRoleStore = create<RoleState>()(
    persist(
        (set, get) => ({
            activeRole: null,
            setRole: (role) => set({ activeRole: role }),
            switchRole: () => {
                const currentRole = get().activeRole;
                if (currentRole === 'driver') {
                    set({ activeRole: 'b2c' });
                } else if (currentRole === 'b2c') {
                    set({ activeRole: 'driver' });
                }
            },
        }),
        {
            name: 'voltlink-role-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
