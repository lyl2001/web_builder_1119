import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Agent, Visibility } from '@/types';
import { generateId } from '@/lib/utils';

interface AgentState {
  agents: Agent[];
  createAgent: (agent: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>) => Agent;
  updateAgent: (id: string, updates: Partial<Agent>) => void;
  deleteAgent: (id: string) => void;
  getAgentById: (id: string) => Agent | undefined;
  getAgentsByOwner: (ownerId: string) => Agent[];
  getPublicAgents: () => Agent[];
  toggleVisibility: (id: string) => void;
}

export const useAgentStore = create<AgentState>()(
  persist(
    (set, get) => ({
      agents: [],

      createAgent: (agentData) => {
        const newAgent: Agent = {
          ...agentData,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ agents: [...state.agents, newAgent] }));
        return newAgent;
      },

      updateAgent: (id, updates) =>
        set((state) => ({
          agents: state.agents.map((agent) =>
            agent.id === id
              ? { ...agent, ...updates, updatedAt: new Date() }
              : agent
          ),
        })),

      deleteAgent: (id) =>
        set((state) => ({
          agents: state.agents.filter((agent) => agent.id !== id),
        })),

      getAgentById: (id) => get().agents.find((agent) => agent.id === id),

      getAgentsByOwner: (ownerId) =>
        get().agents.filter((agent) => agent.ownerId === ownerId),

      getPublicAgents: () =>
        get().agents.filter((agent) => agent.visibility === 'public'),

      toggleVisibility: (id) =>
        set((state) => ({
          agents: state.agents.map((agent) =>
            agent.id === id
              ? {
                  ...agent,
                  visibility: agent.visibility === 'public' ? 'private' : 'public',
                  updatedAt: new Date(),
                }
              : agent
          ),
        })),
    }),
    {
      name: 'agent-storage',
    }
  )
);
