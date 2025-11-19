'use client';

import { useEffect, useState } from 'react';
import { useConversationStore } from '@/store/conversationStore';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Message, ResourceType } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface ConversationViewProps {
  resourceId: string;
  resourceType: ResourceType;
  resourceName: string;
}

export function ConversationView({
  resourceId,
  resourceType,
  resourceName,
}: ConversationViewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    conversations,
    currentConversationId,
    addConversation,
    setCurrentConversation,
    addMessage,
    getMessages,
  } = useConversationStore();

  // 初始化或获取对话
  useEffect(() => {
    const conversationId = `${resourceType}-${resourceId}`;

    if (!conversations[conversationId]) {
      // 创建新对话
      addConversation({
        id: conversationId,
        resourceId,
        resourceType,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    setCurrentConversation(conversationId);
  }, [resourceId, resourceType, conversations, addConversation, setCurrentConversation]);

  const handleSendMessage = async (content: string) => {
    if (!currentConversationId) return;

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    // 添加用户消息
    addMessage(currentConversationId, userMessage);
    setIsLoading(true);

    try {
      // 调用API发送消息
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: currentConversationId,
          message: content,
          resourceId,
          resourceType,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();

      // 添加AI响应
      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: data.message || '抱歉，我现在无法回答。',
        timestamp: new Date(),
      };

      addMessage(currentConversationId, assistantMessage);
    } catch (error) {
      console.error('Error sending message:', error);

      // 添加错误消息
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: '抱歉，发送消息时出现错误。请稍后重试。',
        timestamp: new Date(),
      };

      addMessage(currentConversationId, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const messages = currentConversationId ? getMessages(currentConversationId) : [];

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4 bg-white dark:bg-gray-900">
        <h2 className="text-lg font-semibold">{resourceName}</h2>
        <p className="text-sm text-gray-500">
          {resourceType === 'agent' && '智能体对话'}
          {resourceType === 'multi-agent' && '多智能体对话'}
          {resourceType === 'group' && '群组对话'}
          {resourceType === 'workflow' && '工作流对话'}
        </p>
      </div>
      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages} />
      </div>
      <MessageInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </div>
  );
}
