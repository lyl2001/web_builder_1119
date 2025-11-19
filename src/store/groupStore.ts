import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AgentGroup } from '@/types';
import { generateId } from '@/lib/utils';

interface GroupState {
  groups: AgentGroup[];
  createGroup: (group: Omit<AgentGroup, 'id' | 'createdAt' | 'updatedAt'>) => AgentGroup;
  updateGroup: (id: string, updates: Partial<AgentGroup>) => void;
  deleteGroup: (id: string) => void;
  getGroupById: (id: string) => AgentGroup | undefined;
  getGroupsByOwner: (ownerId: string) => AgentGroup[];
  getPublicGroups: () => AgentGroup[];
  toggleVisibility: (id: string) => void;
}

export const useGroupStore = create<GroupState>()(
  persist(
    (set, get) => ({
      groups: [],

      createGroup: (groupData) => {
        const newGroup: AgentGroup = {
          ...groupData,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ groups: [...state.groups, newGroup] }));
        return newGroup;
      },

      updateGroup: (id, updates) =>
        set((state) => ({
          groups: state.groups.map((group) =>
            group.id === id
              ? { ...group, ...updates, updatedAt: new Date() }
              : group
          ),
        })),

      deleteGroup: (id) =>
        set((state) => ({
          groups: state.groups.filter((group) => group.id !== id),
        })),

      getGroupById: (id) => get().groups.find((group) => group.id === id),

      getGroupsByOwner: (ownerId) =>
        get().groups.filter((group) => group.ownerId === ownerId),

      getPublicGroups: () =>
        get().groups.filter((group) => group.visibility === 'public'),

      toggleVisibility: (id) =>
        set((state) => ({
          groups: state.groups.map((group) =>
            group.id === id
              ? {
                  ...group,
                  visibility: group.visibility === 'public' ? 'private' : 'public',
                  updatedAt: new Date(),
                }
              : group
          ),
        })),
    }),
    {
      name: 'group-storage',
    }
  )
);
