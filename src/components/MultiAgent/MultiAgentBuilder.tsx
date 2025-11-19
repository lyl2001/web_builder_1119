'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { useMultiAgentStore } from '@/store/multiAgentStore';
import { useAgentStore } from '@/store/agentStore';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { MultiAgent } from '@/types';

interface MultiAgentBuilderProps {
  multiAgent?: MultiAgent;
  onSave?: (multiAgent: MultiAgent) => void;
}

export const MultiAgentBuilder: React.FC<MultiAgentBuilderProps> = ({
  multiAgent,
  onSave,
}) => {
  const router = useRouter();
  const { currentUser } = useUserStore();
  const { createMultiAgent, updateMultiAgent } = useMultiAgentStore();
  const { agents, getAgentsByOwner, getPublicAgents } = useAgentStore();

  const [name, setName] = useState(multiAgent?.name || '');
  const [description, setDescription] = useState(multiAgent?.description || '');
  const [selectedAgents, setSelectedAgents] = useState<string[]>(
    multiAgent?.config.agents || []
  );
  const [autoReply, setAutoReply] = useState(multiAgent?.config.autoReply ?? true);
  const [mentionEnabled, setMentionEnabled] = useState(
    multiAgent?.config.mentionEnabled ?? true
  );
  const [visibility, setVisibility] = useState(multiAgent?.visibility || 'private');

  if (!currentUser) return null;

  const myAgents = getAgentsByOwner(currentUser.id);
  const publicAgents = getPublicAgents();
  const availableAgents = [...myAgents, ...publicAgents];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const multiAgentData = {
      name,
      description,
      config: {
        autoReply,
        mentionEnabled,
        agents: selectedAgents,
      },
      ownerId: currentUser.id,
      visibility,
      tags: [],
    };

    if (multiAgent) {
      updateMultiAgent(multiAgent.id, multiAgentData);
      onSave?.(multiAgent);
    } else {
      const newMultiAgent = createMultiAgent(multiAgentData);
      router.push(`/multi-agents/${newMultiAgent.id}`);
    }
  };

  const toggleAgent = (agentId: string) => {
    if (selectedAgents.includes(agentId)) {
      setSelectedAgents(selectedAgents.filter((id) => id !== agentId));
    } else {
      setSelectedAgents([...selectedAgents, agentId]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="多智能体名称"
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
          <CardTitle>配置选项</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoReply}
              onChange={(e) => setAutoReply(e.target.checked)}
              className="w-4 h-4 rounded border-input"
            />
            <span className="text-sm text-foreground">
              启用自动回复（智能体自动判断并回复相关消息）
            </span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={mentionEnabled}
              onChange={(e) => setMentionEnabled(e.target.checked)}
              className="w-4 h-4 rounded border-input"
            />
            <span className="text-sm text-foreground">
              启用 Mention 功能（使用 @智能体名称 指定回复）
            </span>
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>选择智能体</CardTitle>
        </CardHeader>
        <CardContent>
          {availableAgents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>暂无可用智能体，请先创建智能体</p>
              <Button
                type="button"
                size="sm"
                className="mt-4"
                onClick={() => router.push('/agents/new')}
              >
                创建智能体
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {availableAgents.map((agent) => (
                <label
                  key={agent.id}
                  className="flex items-start space-x-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-accent/10 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedAgents.includes(agent.id)}
                    onChange={() => toggleAgent(agent.id)}
                    className="mt-1 w-4 h-4 rounded border-input"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-foreground">{agent.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {agent.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
          {selectedAgents.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground">
              已选择 {selectedAgents.length} 个智能体
            </div>
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
        <Button
          type="submit"
          className="flex-1"
          disabled={selectedAgents.length === 0}
        >
          {multiAgent ? '保存更新' : '创建多智能体'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          取消
        </Button>
      </div>
    </form>
  );
};
