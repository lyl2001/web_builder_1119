import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { generateId } from '@/lib/utils';

interface UserState {
  currentUser: User | null;
  users: User[];
  login: (username: string, email: string) => void;
  logout: () => void;
  register: (username: string, email: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      currentUser: null,
      users: [],

      login: (username: string, email: string) =>
        set((state) => {
          const existingUser = state.users.find(u => u.email === email);
          if (existingUser) {
            return { currentUser: existingUser };
          }
          const newUser: User = {
            id: generateId(),
            username,
            email,
            createdAt: new Date(),
          };
          return {
            currentUser: newUser,
            users: [...state.users, newUser],
          };
        }),

      logout: () => set({ currentUser: null }),

      register: (username: string, email: string) =>
        set((state) => {
          const newUser: User = {
            id: generateId(),
            username,
            email,
            createdAt: new Date(),
          };
          return {
            currentUser: newUser,
            users: [...state.users, newUser],
          };
        }),
    }),
    {
      name: 'user-storage',
    }
  )
);
