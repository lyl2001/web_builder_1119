'use client';

import React from 'react';
import { useUserStore } from '@/store/userStore';
import { useThemeStore } from '@/store/themeStore';
import { Button } from '@/components/ui/Button';
import { ThemeType } from '@/types';
import { themes } from '@/lib/themes';

export const Header: React.FC = () => {
  const { currentUser, logout } = useUserStore();
  const { theme, mode, setTheme, toggleMode } = useThemeStore();

  const themeOptions: { value: ThemeType; label: string }[] = [
    { value: 'cool', label: '酷炫' },
    { value: 'modern', label: '明亮现代' },
    { value: 'classic', label: '经典' },
    { value: 'anime', label: '二次元粉色' },
  ];

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold text-primary">Agent Builder</h1>
            {currentUser && (
              <nav className="flex space-x-4">
                <a
                  href="/dashboard"
                  className="text-foreground hover:text-primary transition-colors"
                >
                  Dashboard
                </a>
                <a
                  href="/agents"
                  className="text-foreground hover:text-primary transition-colors"
                >
                  智能体
                </a>
                <a
                  href="/multi-agents"
                  className="text-foreground hover:text-primary transition-colors"
                >
                  多智能体
                </a>
                <a
                  href="/workflows"
                  className="text-foreground hover:text-primary transition-colors"
                >
                  Workflow
                </a>
                <a
                  href="/groups"
                  className="text-foreground hover:text-primary transition-colors"
                >
                  群组
                </a>
              </nav>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-muted-foreground">主题:</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as ThemeType)}
                className="h-8 rounded-md border border-input bg-background px-2 text-sm"
              >
                {themeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <Button size="sm" variant="outline" onClick={toggleMode}>
              {mode === 'light' ? '🌙' : '☀️'}
            </Button>

            {currentUser ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-foreground">
                  {currentUser.username}
                </span>
                <Button size="sm" variant="outline" onClick={logout}>
                  退出
                </Button>
              </div>
            ) : (
              <Button size="sm" onClick={() => (window.location.href = '/')}>
                登录
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
