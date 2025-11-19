'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAgentStore } from '@/store/agentStore';
import { ConversationView } from '@/components/Conversation';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Settings } from 'lucide-react';
import { Agent } from '@/types';

export default function AgentPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { agents } = useAgentStore();
  const [agent, setAgent] = useState<Agent | null>(null);

  useEffect(() => {
    const foundAgent = agents.find((a) => a.id === id);
    setAgent(foundAgent || null);
  }, [id, agents]);

  if (!agent) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
            智能体未找到
          </p>
          <Button
            onClick={() => router.push('/agents')}
            className="mt-4"
            variant="outline"
          >
            返回智能体列表
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
              onClick={() => router.push('/agents')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{agent.name}</h1>
              <p className="text-sm text-gray-500">{agent.description}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        <ConversationView
          resourceId={agent.id}
          resourceType="agent"
          resourceName={agent.name}
        />
      </main>
    </div>
  );
}
