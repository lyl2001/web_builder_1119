import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MultiAgent } from '@/types';
import { generateId } from '@/lib/utils';

interface MultiAgentState {
  multiAgents: MultiAgent[];
  createMultiAgent: (multiAgent: Omit<MultiAgent, 'id' | 'createdAt' | 'updatedAt'>) => MultiAgent;
  updateMultiAgent: (id: string, updates: Partial<MultiAgent>) => void;
  deleteMultiAgent: (id: string) => void;
  getMultiAgentById: (id: string) => MultiAgent | undefined;
  getMultiAgentsByOwner: (ownerId: string) => MultiAgent[];
  getPublicMultiAgents: () => MultiAgent[];
  toggleVisibility: (id: string) => void;
}

export const useMultiAgentStore = create<MultiAgentState>()(
  persist(
    (set, get) => ({
      multiAgents: [],

      createMultiAgent: (multiAgentData) => {
        const newMultiAgent: MultiAgent = {
          ...multiAgentData,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ multiAgents: [...state.multiAgents, newMultiAgent] }));
        return newMultiAgent;
      },

      updateMultiAgent: (id, updates) =>
        set((state) => ({
          multiAgents: state.multiAgents.map((ma) =>
            ma.id === id
              ? { ...ma, ...updates, updatedAt: new Date() }
              : ma
          ),
        })),

      deleteMultiAgent: (id) =>
        set((state) => ({
          multiAgents: state.multiAgents.filter((ma) => ma.id !== id),
        })),

      getMultiAgentById: (id) => get().multiAgents.find((ma) => ma.id === id),

      getMultiAgentsByOwner: (ownerId) =>
        get().multiAgents.filter((ma) => ma.ownerId === ownerId),

      getPublicMultiAgents: () =>
        get().multiAgents.filter((ma) => ma.visibility === 'public'),

      toggleVisibility: (id) =>
        set((state) => ({
          multiAgents: state.multiAgents.map((ma) =>
            ma.id === id
              ? {
                  ...ma,
                  visibility: ma.visibility === 'public' ? 'private' : 'public',
                  updatedAt: new Date(),
                }
              : ma
          ),
        })),
    }),
    {
      name: 'multi-agent-storage',
    }
  )
);
