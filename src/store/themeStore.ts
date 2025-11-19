import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ThemeType } from '@/types';
import { applyTheme } from '@/lib/themes';

interface ThemeState {
  theme: ThemeType;
  mode: 'light' | 'dark';
  setTheme: (theme: ThemeType) => void;
  setMode: (mode: 'light' | 'dark') => void;
  toggleMode: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'modern',
      mode: 'light',

      setTheme: (theme: ThemeType) => {
        set({ theme });
        applyTheme(theme, get().mode);
      },

      setMode: (mode: 'light' | 'dark') => {
        set({ mode });
        applyTheme(get().theme, mode);
      },

      toggleMode: () => {
        const newMode = get().mode === 'light' ? 'dark' : 'light';
        set({ mode: newMode });
        applyTheme(get().theme, newMode);
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);
