'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { useMultiAgentStore } from '@/store/multiAgentStore';
import { Header } from '@/components/Layout/Header';
import { ThemeProvider } from '@/components/Layout/ThemeProvider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function MultiAgentsPage() {
  const router = useRouter();
  const { currentUser } = useUserStore();
  const {
    multiAgents,
    getMultiAgentsByOwner,
    getPublicMultiAgents,
    deleteMultiAgent,
    toggleVisibility,
  } = useMultiAgentStore();
  const [filter, setFilter] = useState<'my' | 'public'>('my');

  useEffect(() => {
    if (!currentUser) {
      router.push('/');
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  const displayMultiAgents =
    filter === 'my' ? getMultiAgentsByOwner(currentUser.id) : getPublicMultiAgents();

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('确定要删除这个多智能体吗？')) {
      deleteMultiAgent(id);
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
            <h1 className="text-3xl font-bold text-foreground">多智能体</h1>
            <Button onClick={() => router.push('/multi-agents/new')}>
              创建多智能体
            </Button>
          </div>

          <div className="flex space-x-2 mb-6">
            <Button
              variant={filter === 'my' ? 'default' : 'outline'}
              onClick={() => setFilter('my')}
            >
              我的多智能体
            </Button>
            <Button
              variant={filter === 'public' ? 'default' : 'outline'}
              onClick={() => setFilter('public')}
            >
              公共多智能体
            </Button>
          </div>

          {displayMultiAgents.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center text-muted-foreground">
                {filter === 'my'
                  ? '还没有多智能体，立即创建一个吧！'
                  : '暂无公共多智能体'}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayMultiAgents.map((multiAgent) => (
                <Card
                  key={multiAgent.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/multi-agents/${multiAgent.id}`)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{multiAgent.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {multiAgent.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span>{multiAgent.config.agents.length} 个智能体</span>
                      <span>
                        {multiAgent.visibility === 'public' ? '公开' : '私有'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {multiAgent.config.autoReply && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          自动回复
                        </span>
                      )}
                      {multiAgent.config.mentionEnabled && (
                        <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                          支持@
                        </span>
                      )}
                    </div>
                    {multiAgent.ownerId === currentUser.id && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => handleToggleVisibility(multiAgent.id, e)}
                          className="flex-1"
                        >
                          {multiAgent.visibility === 'public' ? '设为私有' : '设为公开'}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => handleDelete(multiAgent.id, e)}
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
