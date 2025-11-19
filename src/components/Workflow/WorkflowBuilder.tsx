'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { useWorkflowStore } from '@/store/workflowStore';
import { useAgentStore } from '@/store/agentStore';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { AgentWorkflow, WorkflowStep } from '@/types';
import { generateId } from '@/lib/utils';

interface WorkflowBuilderProps {
  workflow?: AgentWorkflow;
  onSave?: (workflow: AgentWorkflow) => void;
}

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({
  workflow,
  onSave,
}) => {
  const router = useRouter();
  const { currentUser } = useUserStore();
  const { createWorkflow, updateWorkflow } = useWorkflowStore();
  const { agents, getAgentsByOwner, getPublicAgents } = useAgentStore();

  const [name, setName] = useState(workflow?.name || '');
  const [description, setDescription] = useState(workflow?.description || '');
  const [steps, setSteps] = useState<WorkflowStep[]>(workflow?.steps || []);
  const [visibility, setVisibility] = useState(workflow?.visibility || 'private');

  if (!currentUser) return null;

  const myAgents = getAgentsByOwner(currentUser.id);
  const publicAgents = getPublicAgents();
  const availableAgents = [...myAgents, ...publicAgents];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const workflowData = {
      name,
      description,
      steps: steps.map((step, index) => ({ ...step, order: index })),
      ownerId: currentUser.id,
      visibility,
      tags: [],
    };

    if (workflow) {
      updateWorkflow(workflow.id, workflowData);
      onSave?.(workflow);
    } else {
      const newWorkflow = createWorkflow(workflowData);
      router.push(`/workflows/${newWorkflow.id}`);
    }
  };

  const addStep = () => {
    setSteps([
      ...steps,
      {
        id: generateId(),
        name: `步骤 ${steps.length + 1}`,
        agentIds: [],
        concurrent: false,
        order: steps.length,
      },
    ]);
  };

  const updateStep = (index: number, updates: Partial<WorkflowStep>) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], ...updates };
    setSteps(updated);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === steps.length - 1)
    ) {
      return;
    }

    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
    setSteps(newSteps);
  };

  const toggleAgent = (stepIndex: number, agentId: string) => {
    const step = steps[stepIndex];
    const agentIds = step.agentIds.includes(agentId)
      ? step.agentIds.filter((id) => id !== agentId)
      : [...step.agentIds, agentId];

    updateStep(stepIndex, { agentIds });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="工作流名称"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Textarea
            label="描述"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>工作流步骤</CardTitle>
            <Button type="button" size="sm" onClick={addStep}>
              添加步骤
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {steps.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              暂无步骤，点击添加步骤开始构建工作流
            </div>
          ) : (
            steps.map((step, index) => (
              <div
                key={step.id}
                className="border border-border rounded-lg p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-primary">
                      步骤 {index + 1}
                    </span>
                    <div className="flex space-x-1">
                      <button
                        type="button"
                        onClick={() => moveStep(index, 'up')}
                        disabled={index === 0}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveStep(index, 'down')}
                        disabled={index === steps.length - 1}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => removeStep(index)}
                  >
                    删除
                  </Button>
                </div>

                <Input
                  placeholder="步骤名称"
                  value={step.name}
                  onChange={(e) => updateStep(index, { name: e.target.value })}
                  required
                />

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={step.concurrent}
                    onChange={(e) =>
                      updateStep(index, { concurrent: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-input"
                  />
                  <span className="text-sm text-foreground">
                    并发执行（步骤内的智能体同时运行）
                  </span>
                </label>

                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    选择智能体
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {availableAgents.map((agent) => (
                      <label
                        key={agent.id}
                        className="flex items-start space-x-2 p-2 border border-border rounded cursor-pointer hover:bg-accent/10"
                      >
                        <input
                          type="checkbox"
                          checked={step.agentIds.includes(agent.id)}
                          onChange={() => toggleAgent(index, agent.id)}
                          className="mt-1 w-4 h-4 rounded border-input"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-foreground">
                            {agent.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {agent.description}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {step.agentIds.length > 0 && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      已选择 {step.agentIds.length} 个智能体
                    </div>
                  )}
                </div>

                <Input
                  label="执行条件（可选）"
                  placeholder="例如: previous.success === true"
                  value={step.condition || ''}
                  onChange={(e) => updateStep(index, { condition: e.target.value })}
                />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>发布设置</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            label="可见性"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as 'public' | 'private')}
            options={[
              { value: 'private', label: '私有' },
              { value: 'public', label: '公开' },
            ]}
          />
        </CardContent>
      </Card>

      <div className="flex space-x-4">
        <Button type="submit" className="flex-1" disabled={steps.length === 0}>
          {workflow ? '保存更新' : '创建工作流'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          取消
        </Button>
      </div>
    </form>
  );
};
