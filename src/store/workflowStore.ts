import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AgentWorkflow } from '@/types';
import { generateId } from '@/lib/utils';

interface WorkflowState {
  workflows: AgentWorkflow[];
  createWorkflow: (workflow: Omit<AgentWorkflow, 'id' | 'createdAt' | 'updatedAt'>) => AgentWorkflow;
  updateWorkflow: (id: string, updates: Partial<AgentWorkflow>) => void;
  deleteWorkflow: (id: string) => void;
  getWorkflowById: (id: string) => AgentWorkflow | undefined;
  getWorkflowsByOwner: (ownerId: string) => AgentWorkflow[];
  getPublicWorkflows: () => AgentWorkflow[];
  toggleVisibility: (id: string) => void;
}

export const useWorkflowStore = create<WorkflowState>()(
  persist(
    (set, get) => ({
      workflows: [],

      createWorkflow: (workflowData) => {
        const newWorkflow: AgentWorkflow = {
          ...workflowData,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ workflows: [...state.workflows, newWorkflow] }));
        return newWorkflow;
      },

      updateWorkflow: (id, updates) =>
        set((state) => ({
          workflows: state.workflows.map((wf) =>
            wf.id === id
              ? { ...wf, ...updates, updatedAt: new Date() }
              : wf
          ),
        })),

      deleteWorkflow: (id) =>
        set((state) => ({
          workflows: state.workflows.filter((wf) => wf.id !== id),
        })),

      getWorkflowById: (id) => get().workflows.find((wf) => wf.id === id),

      getWorkflowsByOwner: (ownerId) =>
        get().workflows.filter((wf) => wf.ownerId === ownerId),

      getPublicWorkflows: () =>
        get().workflows.filter((wf) => wf.visibility === 'public'),

      toggleVisibility: (id) =>
        set((state) => ({
          workflows: state.workflows.map((wf) =>
            wf.id === id
              ? {
                  ...wf,
                  visibility: wf.visibility === 'public' ? 'private' : 'public',
                  updatedAt: new Date(),
                }
              : wf
          ),
        })),
    }),
    {
      name: 'workflow-storage',
    }
  )
);
