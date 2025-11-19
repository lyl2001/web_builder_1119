import { create } from 'zustand';
import { Message, Conversation } from '@/types';

interface ConversationState {
  conversations: Record<string, Conversation>;
  currentConversationId: string | null;
  addConversation: (conversation: Conversation) => void;
  removeConversation: (id: string) => void;
  setCurrentConversation: (id: string | null) => void;
  getCurrentConversation: () => Conversation | null;
  addMessage: (conversationId: string, message: Message) => void;
  updateMessage: (conversationId: string, messageId: string, updates: Partial<Message>) => void;
  getMessages: (conversationId: string) => Message[];
  clearConversation: (conversationId: string) => void;
}

export const useConversationStore = create<ConversationState>((set, get) => ({
  conversations: {},
  currentConversationId: null,

  addConversation: (conversation) =>
    set((state) => ({
      conversations: {
        ...state.conversations,
        [conversation.id]: conversation,
      },
    })),

  removeConversation: (id) =>
    set((state) => {
      const { [id]: removed, ...rest } = state.conversations;
      return {
        conversations: rest,
        currentConversationId: state.currentConversationId === id ? null : state.currentConversationId,
      };
    }),

  setCurrentConversation: (id) =>
    set({ currentConversationId: id }),

  getCurrentConversation: () => {
    const state = get();
    if (!state.currentConversationId) return null;
    return state.conversations[state.currentConversationId] || null;
  },

  addMessage: (conversationId, message) =>
    set((state) => {
      const conversation = state.conversations[conversationId];
      if (!conversation) return state;

      return {
        conversations: {
          ...state.conversations,
          [conversationId]: {
            ...conversation,
            messages: [...conversation.messages, message],
            updatedAt: new Date(),
          },
        },
      };
    }),

  updateMessage: (conversationId, messageId, updates) =>
    set((state) => {
      const conversation = state.conversations[conversationId];
      if (!conversation) return state;

      return {
        conversations: {
          ...state.conversations,
          [conversationId]: {
            ...conversation,
            messages: conversation.messages.map((msg) =>
              msg.id === messageId ? { ...msg, ...updates } : msg
            ),
            updatedAt: new Date(),
          },
        },
      };
    }),

  getMessages: (conversationId) => {
    const state = get();
    const conversation = state.conversations[conversationId];
    return conversation?.messages || [];
  },

  clearConversation: (conversationId) =>
    set((state) => {
      const conversation = state.conversations[conversationId];
      if (!conversation) return state;

      return {
        conversations: {
          ...state.conversations,
          [conversationId]: {
            ...conversation,
            messages: [],
            updatedAt: new Date(),
          },
        },
      };
    }),
}));
