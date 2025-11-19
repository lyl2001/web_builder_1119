'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGroupStore } from '@/store/groupStore';
import { ConversationView } from '@/components/Conversation';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Settings } from 'lucide-react';
import { Group } from '@/types';

export default function GroupPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { groups } = useGroupStore();
  const [group, setGroup] = useState<Group | null>(null);

  useEffect(() => {
    const found = groups.find((g) => g.id === id);
    setGroup(found || null);
  }, [id, groups]);

  if (!group) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
            群组未找到
          </p>
          <Button
            onClick={() => router.push('/groups')}
            className="mt-4"
            variant="outline"
          >
            返回群组列表
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="border-b bg-white dark:bg-gray-900 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/groups')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{group.name}</h1>
              <p className="text-sm text-gray-500">{group.description}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        <ConversationView
          resourceId={group.id}
          resourceType="group"
          resourceName={group.name}
        />
      </main>
    </div>
  );
}
