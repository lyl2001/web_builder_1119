'use client';

import React, { useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore';
import { applyTheme } from '@/lib/themes';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { theme, mode } = useThemeStore();

  useEffect(() => {
    applyTheme(theme, mode);

    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, mode]);

  return <>{children}</>;
};
