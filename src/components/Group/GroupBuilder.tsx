'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { useGroupStore } from '@/store/groupStore';
import { useAgentStore } from '@/store/agentStore';
import { useMultiAgentStore } from '@/store/multiAgentStore';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { AgentGroup, GroupMember } from '@/types';

interface GroupBuilderProps {
  group?: AgentGroup;
  onSave?: (group: AgentGroup) => void;
}

export const GroupBuilder: React.FC<GroupBuilderProps> = ({ group, onSave }) => {
  const router = useRouter();
  const { currentUser } = useUserStore();
  const { createGroup, updateGroup } = useGroupStore();
  const { agents, getAgentsByOwner, getPublicAgents } = useAgentStore();
  const {
    multiAgents,
    getMultiAgentsByOwner,
    getPublicMultiAgents,
  } = useMultiAgentStore();

  const [name, setName] = useState(group?.name || '');
  const [description, setDescription] = useState(group?.description || '');
  const [members, setMembers] = useState<GroupMember[]>(group?.members || []);
  const [maxRounds, setMaxRounds] = useState(group?.maxRounds || 10);
  const [stopEnabled, setStopEnabled] = useState(
    group?.stopConditions?.enabled ?? true
  );
  const [minQualityScore, setMinQualityScore] = useState(
    group?.stopConditions?.minQualityScore || 0.3
  );
  const [repetitionThreshold, setRepetitionThreshold] = useState(
    group?.stopConditions?.repetitionThreshold || 0.8
  );
  const [visibility, setVisibility] = useState(group?.visibility || 'private');

  if (!currentUser) return null;

  const myAgents = getAgentsByOwner(currentUser.id);
  const publicAgents = getPublicAgents();
  const myMultiAgents = getMultiAgentsByOwner(currentUser.id);
  const publicMultiAgents = getPublicMultiAgents();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const groupData = {
      name,
      description,
      members,
      maxRounds,
      stopConditions: {
        enabled: stopEnabled,
        minQualityScore,
        repetitionThreshold,
      },
      ownerId: currentUser.id,
      visibility,
      tags: [],
    };

    if (group) {
      updateGroup(group.id, groupData);
      onSave?.(group);
    } else {
      const newGroup = createGroup(groupData);
      router.push(`/groups/${newGroup.id}`);
    }
  };

  const toggleMember = (id: string, type: 'agent' | 'multiAgent') => {
    const existingIndex = members.findIndex((m) => m.id === id);

    if (existingIndex >= 0) {
      setMembers(members.filter((_, i) => i !== existingIndex));
    } else {
      setMembers([...members, { id, type, enabled: true }]);
    }
  };

  const toggleMemberEnabled = (id: string) => {
    setMembers(
      members.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m))
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="群组名称"
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
          <CardTitle>成员管理</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-3 text-foreground">
              智能体成员
            </h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {[...myAgents, ...publicAgents].map((agent) => (
                <label
                  key={agent.id}
                  className="flex items-start space-x-2 p-2 border border-border rounded cursor-pointer hover:bg-accent/10"
                >
                  <input
                    type="checkbox"
                    checked={members.some((m) => m.id === agent.id)}
                    onChange={() => toggleMember(agent.id, 'agent')}
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
          </div>

          <div>
            <h4 className="text-sm font-medium mb-3 text-foreground">
              多智能体成员
            </h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {[...myMultiAgents, ...publicMultiAgents].map((multiAgent) => (
                <label
                  key={multiAgent.id}
                  className="flex items-start space-x-2 p-2 border border-border rounded cursor-pointer hover:bg-accent/10"
                >
                  <input
                    type="checkbox"
                    checked={members.some((m) => m.id === multiAgent.id)}
                    onChange={() => toggleMember(multiAgent.id, 'multiAgent')}
                    className="mt-1 w-4 h-4 rounded border-input"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">
                      {multiAgent.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {multiAgent.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {members.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 text-foreground">
                已选择的成员 ({members.length})
              </h4>
              <div className="space-y-1">
                {members.map((member) => {
                  const item =
                    member.type === 'agent'
                      ? [...myAgents, ...publicAgents].find(
                          (a) => a.id === member.id
                        )
                      : [...myMultiAgents, ...publicMultiAgents].find(
                          (a) => a.id === member.id
                        );

                  return (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-2 bg-accent/5 rounded text-sm"
                    >
                      <span className="text-foreground">{item?.name}</span>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <span className="text-xs text-muted-foreground">启用</span>
                        <input
                          type="checkbox"
                          checked={member.enabled}
                          onChange={() => toggleMemberEnabled(member.id)}
                          className="w-4 h-4 rounded border-input"
                        />
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>停止条件</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={stopEnabled}
              onChange={(e) => setStopEnabled(e.target.checked)}
              className="w-4 h-4 rounded border-input"
            />
            <span className="text-sm text-foreground">
              启用智能停止（检测无价值回复并自动结束）
            </span>
          </label>

          {stopEnabled && (
            <>
              <Input
                label="最小质量分数"
                type="number"
                step="0.1"
                min="0"
                max="1"
                value={minQualityScore}
                onChange={(e) => setMinQualityScore(parseFloat(e.target.value))}
              />
              <Input
                label="重复内容阈值"
                type="number"
                step="0.1"
                min="0"
                max="1"
                value={repetitionThreshold}
                onChange={(e) =>
                  setRepetitionThreshold(parseFloat(e.target.value))
                }
              />
            </>
          )}

          <Input
            label="最大对话轮数"
            type="number"
            min="1"
            max="100"
            value={maxRounds}
            onChange={(e) => setMaxRounds(parseInt(e.target.value))}
          />
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
        <Button type="submit" className="flex-1" disabled={members.length === 0}>
          {group ? '保存更新' : '创建群组'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          取消
        </Button>
      </div>
    </form>
  );
};
