'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { useAgentStore } from '@/store/agentStore';
import { useMultiAgentStore } from '@/store/multiAgentStore';
import { useWorkflowStore } from '@/store/workflowStore';
import { useGroupStore } from '@/store/groupStore';
import { Header } from '@/components/Layout/Header';
import { ThemeProvider } from '@/components/Layout/ThemeProvider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const router = useRouter();
  const { currentUser } = useUserStore();
  const { getAgentsByOwner } = useAgentStore();
  const { getMultiAgentsByOwner } = useMultiAgentStore();
  const { getWorkflowsByOwner } = useWorkflowStore();
  const { getGroupsByOwner } = useGroupStore();

  useEffect(() => {
    if (!currentUser) {
      router.push('/');
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  const myAgents = getAgentsByOwner(currentUser.id);
  const myMultiAgents = getMultiAgentsByOwner(currentUser.id);
  const myWorkflows = getWorkflowsByOwner(currentUser.id);
  const myGroups = getGroupsByOwner(currentUser.id);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 text-foreground">我的资产</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">智能体</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary mb-2">
                  {myAgents.length}
                </div>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => router.push('/agents/new')}
                >
                  创建智能体
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">多智能体</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary mb-2">
                  {myMultiAgents.length}
                </div>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => router.push('/multi-agents/new')}
                >
                  创建多智能体
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Workflow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary mb-2">
                  {myWorkflows.length}
                </div>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => router.push('/workflows/new')}
                >
                  创建Workflow
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">群组</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary mb-2">
                  {myGroups.length}
                </div>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => router.push('/groups/new')}
                >
                  创建群组
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-foreground">我的智能体</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/agents')}
                >
                  查看全部
                </Button>
              </div>
              {myAgents.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    还没有智能体，立即创建一个吧！
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myAgents.slice(0, 3).map((agent) => (
                    <Card
                      key={agent.id}
                      className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => router.push(`/agents/${agent.id}`)}
                    >
                      <CardHeader>
                        <CardTitle className="text-base">{agent.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {agent.description}
                        </p>
                        <div className="mt-2 text-xs text-muted-foreground">
                          {agent.visibility === 'public' ? '公开' : '私有'}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
