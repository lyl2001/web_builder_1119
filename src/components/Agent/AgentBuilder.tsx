'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { useAgentStore } from '@/store/agentStore';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Agent, ModelProvider, KnowledgeBase, Tool, OutputWidget } from '@/types';
import { generateId } from '@/lib/utils';

interface AgentBuilderProps {
  agent?: Agent;
  onSave?: (agent: Agent) => void;
}

export const AgentBuilder: React.FC<AgentBuilderProps> = ({ agent, onSave }) => {
  const router = useRouter();
  const { currentUser } = useUserStore();
  const { createAgent, updateAgent } = useAgentStore();

  const [name, setName] = useState(agent?.name || '');
  const [description, setDescription] = useState(agent?.description || '');
  const [prompt, setPrompt] = useState(agent?.prompt || '');
  const [provider, setProvider] = useState<ModelProvider>(
    agent?.model.provider || 'openai'
  );
  const [modelName, setModelName] = useState(agent?.model.modelName || 'gpt-4');
  const [temperature, setTemperature] = useState(agent?.model.temperature || 0.7);
  const [maxTokens, setMaxTokens] = useState(agent?.model.maxTokens || 2000);
  const [visibility, setVisibility] = useState(agent?.visibility || 'private');
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBase[]>(
    agent?.knowledgeBase || []
  );
  const [tools, setTools] = useState<Tool[]>(agent?.tools || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const agentData = {
      name,
      description,
      prompt,
      model: {
        provider,
        modelName,
        temperature,
        maxTokens,
      },
      knowledgeBase,
      tools,
      ownerId: currentUser.id,
      visibility,
      tags: [],
    };

    if (agent) {
      updateAgent(agent.id, agentData);
      onSave?.(agent);
    } else {
      const newAgent = createAgent(agentData);
      router.push(`/agents/${newAgent.id}`);
    }
  };

  const modelOptions = {
    openai: ['gpt-4', 'gpt-3.5-turbo'],
    anthropic: ['claude-3-opus', 'claude-3-sonnet'],
    google: ['gemini-pro', 'gemini-ultra'],
    local: ['llama-2', 'mistral'],
  };

  const addKnowledgeBase = () => {
    setKnowledgeBase([
      ...knowledgeBase,
      {
        id: generateId(),
        name: '',
        type: 'text',
        content: '',
      },
    ]);
  };

  const updateKnowledgeBaseItem = (
    index: number,
    field: keyof KnowledgeBase,
    value: any
  ) => {
    const updated = [...knowledgeBase];
    updated[index] = { ...updated[index], [field]: value };
    setKnowledgeBase(updated);
  };

  const removeKnowledgeBase = (index: number) => {
    setKnowledgeBase(knowledgeBase.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="智能体名称"
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
          <Textarea
            label="系统提示词"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={6}
            required
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>模型配置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            label="模型提供商"
            value={provider}
            onChange={(e) => setProvider(e.target.value as ModelProvider)}
            options={[
              { value: 'openai', label: 'OpenAI' },
              { value: 'anthropic', label: 'Anthropic' },
              { value: 'google', label: 'Google' },
              { value: 'local', label: 'Local' },
            ]}
          />
          <Select
            label="模型"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            options={modelOptions[provider].map((m) => ({ value: m, label: m }))}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Temperature"
              type="number"
              step="0.1"
              min="0"
              max="2"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
            />
            <Input
              label="Max Tokens"
              type="number"
              step="100"
              min="100"
              max="100000"
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>知识库</CardTitle>
            <Button type="button" size="sm" onClick={addKnowledgeBase}>
              添加知识
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {knowledgeBase.map((kb, index) => (
            <div key={kb.id} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Input
                  placeholder="知识库名称"
                  value={kb.name}
                  onChange={(e) => updateKnowledgeBaseItem(index, 'name', e.target.value)}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => removeKnowledgeBase(index)}
                  className="ml-2"
                >
                  删除
                </Button>
              </div>
              <Select
                options={[
                  { value: 'text', label: '文本' },
                  { value: 'file', label: '文件' },
                  { value: 'url', label: 'URL' },
                ]}
                value={kb.type}
                onChange={(e) => updateKnowledgeBaseItem(index, 'type', e.target.value)}
              />
              <Textarea
                placeholder="内容"
                value={kb.content}
                onChange={(e) => updateKnowledgeBaseItem(index, 'content', e.target.value)}
                rows={3}
              />
            </div>
          ))}
          {knowledgeBase.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              暂无知识库
            </p>
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
        <Button type="submit" className="flex-1">
          {agent ? '保存更新' : '创建智能体'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          取消
        </Button>
      </div>
    </form>
  );
};
