'use client';

import React, { useState, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ThemeProvider } from '@/components/Layout/ThemeProvider';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const { currentUser, login, register } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push('/dashboard');
    }
  }, [currentUser, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      register(username, email);
    } else {
      login(username, email);
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">
              {isRegister ? '注册账号' : '登录'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="用户名"
                type="text"
                placeholder="请输入用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <Input
                label="邮箱"
                type="email"
                placeholder="请输入邮箱"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" className="w-full">
                {isRegister ? '注册' : '登录'}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-sm text-primary hover:underline"
              >
                {isRegister ? '已有账号？去登录' : '没有账号？去注册'}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ThemeProvider>
  );
}
