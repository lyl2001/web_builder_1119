'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { useWorkflowStore } from '@/store/workflowStore';
import { Header } from '@/components/Layout/Header';
import { ThemeProvider } from '@/components/Layout/ThemeProvider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function WorkflowsPage() {
  const router = useRouter();
  const { currentUser } = useUserStore();
  const {
    workflows,
    getWorkflowsByOwner,
    getPublicWorkflows,
    deleteWorkflow,
    toggleVisibility,
  } = useWorkflowStore();
  const [filter, setFilter] = useState<'my' | 'public'>('my');

  useEffect(() => {
    if (!currentUser) {
      router.push('/');
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  const displayWorkflows =
    filter === 'my' ? getWorkflowsByOwner(currentUser.id) : getPublicWorkflows();

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('确定要删除这个工作流吗？')) {
      deleteWorkflow(id);
    }
  };

  const handleToggleVisibility = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleVisibility(id);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-foreground">智能体 Workflow</h1>
            <Button onClick={() => router.push('/workflows/new')}>
              创建 Workflow
            </Button>
          </div>

          <div className="flex space-x-2 mb-6">
            <Button
              variant={filter === 'my' ? 'default' : 'outline'}
              onClick={() => setFilter('my')}
            >
              我的 Workflow
            </Button>
            <Button
              variant={filter === 'public' ? 'default' : 'outline'}
              onClick={() => setFilter('public')}
            >
              公共 Workflow
            </Button>
          </div>

          {displayWorkflows.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center text-muted-foreground">
                {filter === 'my'
                  ? '还没有工作流，立即创建一个吧！'
                  : '暂无公共工作流'}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayWorkflows.map((workflow) => (
                <Card
                  key={workflow.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/workflows/${workflow.id}`)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{workflow.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {workflow.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span>{workflow.steps.length} 个步骤</span>
                      <span>
                        {workflow.visibility === 'public' ? '公开' : '私有'}
                      </span>
                    </div>
                    {workflow.ownerId === currentUser.id && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => handleToggleVisibility(workflow.id, e)}
                          className="flex-1"
                        >
                          {workflow.visibility === 'public' ? '设为私有' : '设为公开'}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => handleDelete(workflow.id, e)}
                        >
                          删除
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </ThemeProvider>
  );
}
