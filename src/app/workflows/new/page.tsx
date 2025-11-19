'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { Header } from '@/components/Layout/Header';
import { ThemeProvider } from '@/components/Layout/ThemeProvider';
import { WorkflowBuilder } from '@/components/Workflow/WorkflowBuilder';

export default function NewWorkflowPage() {
  const router = useRouter();
  const { currentUser } = useUserStore();

  useEffect(() => {
    if (!currentUser) {
      router.push('/');
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8 text-foreground">
            创建智能体 Workflow
          </h1>
          <WorkflowBuilder />
        </main>
      </div>
    </ThemeProvider>
  );
}
