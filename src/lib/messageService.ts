import { Message, ResourceType } from '@/types';

export interface SendMessageParams {
  conversationId: string;
  message: string;
  resourceId: string;
  resourceType: ResourceType;
}

export interface SendMessageResponse {
  message: string;
  conversationId: string;
}

export class MessageService {
  private static instance: MessageService;

  private constructor() {}

  static getInstance(): MessageService {
    if (!MessageService.instance) {
      MessageService.instance = new MessageService();
    }
    return MessageService.instance;
  }

  async sendMessage(params: SendMessageParams): Promise<SendMessageResponse> {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async streamMessage(
    params: SendMessageParams,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Response body is not readable');
      }

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value);
        onChunk(chunk);
      }
    } catch (error) {
      console.error('Error streaming message:', error);
      throw error;
    }
  }
}

export const messageService = MessageService.getInstance();
