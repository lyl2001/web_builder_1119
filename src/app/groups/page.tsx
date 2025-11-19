'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { useGroupStore } from '@/store/groupStore';
import { Header } from '@/components/Layout/Header';
import { ThemeProvider } from '@/components/Layout/ThemeProvider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function GroupsPage() {
  const router = useRouter();
  const { currentUser } = useUserStore();
  const { groups, getGroupsByOwner, getPublicGroups, deleteGroup, toggleVisibility } =
    useGroupStore();
  const [filter, setFilter] = useState<'my' | 'public'>('my');

  useEffect(() => {
    if (!currentUser) {
      router.push('/');
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  const displayGroups =
    filter === 'my' ? getGroupsByOwner(currentUser.id) : getPublicGroups();

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('确定要删除这个群组吗？')) {
      deleteGroup(id);
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
            <h1 className="text-3xl font-bold text-foreground">智能体群组</h1>
            <Button onClick={() => router.push('/groups/new')}>创建群组</Button>
          </div>

          <div className="flex space-x-2 mb-6">
            <Button
              variant={filter === 'my' ? 'default' : 'outline'}
              onClick={() => setFilter('my')}
            >
              我的群组
            </Button>
            <Button
              variant={filter === 'public' ? 'default' : 'outline'}
              onClick={() => setFilter('public')}
            >
              公共群组
            </Button>
          </div>

          {displayGroups.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center text-muted-foreground">
                {filter === 'my' ? '还没有群组，立即创建一个吧！' : '暂无公共群组'}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayGroups.map((group) => (
                <Card
                  key={group.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/groups/${group.id}`)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {group.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span>{group.members.length} 个成员</span>
                      <span>{group.visibility === 'public' ? '公开' : '私有'}</span>
                    </div>
                    {group.stopConditions?.enabled && (
                      <div className="mb-3 text-xs">
                        <span className="bg-accent/10 text-accent px-2 py-1 rounded">
                          智能终止
                        </span>
                      </div>
                    )}
                    {group.ownerId === currentUser.id && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => handleToggleVisibility(group.id, e)}
                          className="flex-1"
                        >
                          {group.visibility === 'public' ? '设为私有' : '设为公开'}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => handleDelete(group.id, e)}
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
