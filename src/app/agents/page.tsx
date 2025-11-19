'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { useAgentStore } from '@/store/agentStore';
import { Header } from '@/components/Layout/Header';
import { ThemeProvider } from '@/components/Layout/ThemeProvider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Agent } from '@/types';

export default function AgentsPage() {
  const router = useRouter();
  const { currentUser } = useUserStore();
  const { agents, getAgentsByOwner, getPublicAgents, deleteAgent, toggleVisibility } =
    useAgentStore();
  const [filter, setFilter] = useState<'my' | 'public'>('my');

  useEffect(() => {
    if (!currentUser) {
      router.push('/');
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  const displayAgents =
    filter === 'my' ? getAgentsByOwner(currentUser.id) : getPublicAgents();

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('确定要删除这个智能体吗？')) {
      deleteAgent(id);
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
            <h1 className="text-3xl font-bold text-foreground">智能体</h1>
            <Button onClick={() => router.push('/agents/new')}>创建智能体</Button>
          </div>

          <div className="flex space-x-2 mb-6">
            <Button
              variant={filter === 'my' ? 'default' : 'outline'}
              onClick={() => setFilter('my')}
            >
              我的智能体
            </Button>
            <Button
              variant={filter === 'public' ? 'default' : 'outline'}
              onClick={() => setFilter('public')}
            >
              公共智能体
            </Button>
          </div>

          {displayAgents.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center text-muted-foreground">
                {filter === 'my'
                  ? '还没有智能体，立即创建一个吧！'
                  : '暂无公共智能体'}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayAgents.map((agent) => (
                <Card
                  key={agent.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/agents/${agent.id}`)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {agent.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span>模型: {agent.model.modelName}</span>
                      <span>{agent.visibility === 'public' ? '公开' : '私有'}</span>
                    </div>
                    {agent.ownerId === currentUser.id && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => handleToggleVisibility(agent.id, e)}
                          className="flex-1"
                        >
                          {agent.visibility === 'public' ? '设为私有' : '设为公开'}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => handleDelete(agent.id, e)}
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
