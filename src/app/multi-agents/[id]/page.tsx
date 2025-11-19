'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMultiAgentStore } from '@/store/multiAgentStore';
import { ConversationView } from '@/components/Conversation';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Settings } from 'lucide-react';
import { MultiAgent } from '@/types';

export default function MultiAgentPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { multiAgents } = useMultiAgentStore();
  const [multiAgent, setMultiAgent] = useState<MultiAgent | null>(null);

  useEffect(() => {
    const found = multiAgents.find((ma) => ma.id === id);
    setMultiAgent(found || null);
  }, [id, multiAgents]);

  if (!multiAgent) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
            多智能体未找到
          </p>
          <Button
            onClick={() => router.push('/multi-agents')}
            className="mt-4"
            variant="outline"
          >
            返回多智能体列表
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
              onClick={() => router.push('/multi-agents')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{multiAgent.name}</h1>
              <p className="text-sm text-gray-500">{multiAgent.description}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        <ConversationView
          resourceId={multiAgent.id}
          resourceType="multi-agent"
          resourceName={multiAgent.name}
        />
      </main>
    </div>
  );
}
