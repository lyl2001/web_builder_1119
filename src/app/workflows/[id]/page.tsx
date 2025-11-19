'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useWorkflowStore } from '@/store/workflowStore';
import { ConversationView } from '@/components/Conversation';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Settings } from 'lucide-react';
import { Workflow } from '@/types';

export default function WorkflowPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { workflows } = useWorkflowStore();
  const [workflow, setWorkflow] = useState<Workflow | null>(null);

  useEffect(() => {
    const found = workflows.find((w) => w.id === id);
    setWorkflow(found || null);
  }, [id, workflows]);

  if (!workflow) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
            工作流未找到
          </p>
          <Button
            onClick={() => router.push('/workflows')}
            className="mt-4"
            variant="outline"
          >
            返回工作流列表
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
              onClick={() => router.push('/workflows')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{workflow.name}</h1>
              <p className="text-sm text-gray-500">{workflow.description}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        <ConversationView
          resourceId={workflow.id}
          resourceType="workflow"
          resourceName={workflow.name}
        />
      </main>
    </div>
  );
}
