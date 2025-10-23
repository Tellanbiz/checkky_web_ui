import { z } from 'zod';
import { create } from 'zustand';
import { getAssignedChecklistsAction } from '@/lib/services/checklist/actions';
import { AssignedChecklist } from '@/lib/services/checklist/models';
import { updateAssignedPriority, deleteAssignedChecklist } from '@/lib/services/checklist/post';

export interface ChecklistFilters {
  searchTerm: string;
  status: string;
  category: string;
  sortBy: string;
}

const checklistFiltersSchema = z.object({
  searchTerm: z.string(),
  status: z.string(),
  category: z.string(),
  sortBy: z.string(),
});

interface ChecklistFilterState {
  // Ongoing checklists filters
  ongoingFilters: ChecklistFilters;
  // Available checklists filters
  availableFilters: ChecklistFilters;
  // Checklists data
  checklists: AssignedChecklist[];

  // Actions
  setOngoingSearchTerm: (term: string) => void;
  setOngoingStatus: (status: string) => void;
  setOngoingCategory: (category: string) => void;
  setOngoingSortBy: (sortBy: string) => void;
  resetOngoingFilters: () => void;

  setAvailableSearchTerm: (term: string) => void;
  setAvailableCategory: (category: string) => void;
  setAvailableSortBy: (sortBy: string) => void;
  resetAvailableFilters: () => void;

  // Checklists actions
  setChecklists: (checklists: AssignedChecklist[]) => void;
  fetchChecklists: () => Promise<void>;
  updatePriority: (id: string, priority: "high" | "mid" | "low") => Promise<void>;
  deleteChecklist: (id: string) => Promise<void>;
}

const defaultFilters: ChecklistFilters = {
  searchTerm: '',
  status: 'all',
  category: 'all',
  sortBy: 'recent',
};

export const useChecklistFilterStore = create<ChecklistFilterState>((set, get) => ({
  ongoingFilters: checklistFiltersSchema.parse(defaultFilters),
  availableFilters: checklistFiltersSchema.parse({ ...defaultFilters, status: '' }),
  checklists: [],

  setOngoingSearchTerm: (term: string) =>
    set((state) => ({
      ongoingFilters: { ...state.ongoingFilters, searchTerm: term },
    })),

  setOngoingStatus: (status: string) =>
    set((state) => ({
      ongoingFilters: { ...state.ongoingFilters, status },
    })),

  setOngoingCategory: (category: string) =>
    set((state) => ({
      ongoingFilters: { ...state.ongoingFilters, category },
    })),

  setOngoingSortBy: (sortBy: string) =>
    set((state) => ({
      ongoingFilters: { ...state.ongoingFilters, sortBy },
    })),

  resetOngoingFilters: () =>
    set(() => ({
      ongoingFilters: checklistFiltersSchema.parse(defaultFilters),
    })),

  setAvailableSearchTerm: (term: string) =>
    set((state) => ({
      availableFilters: { ...state.availableFilters, searchTerm: term },
    })),

  setAvailableCategory: (category: string) =>
    set((state) => ({
      availableFilters: { ...state.availableFilters, category },
    })),

  setAvailableSortBy: (sortBy: string) =>
    set((state) => ({
      availableFilters: { ...state.availableFilters, sortBy },
    })),

  resetAvailableFilters: () =>
    set(() => ({
      availableFilters: checklistFiltersSchema.parse({ ...defaultFilters, status: '' }),
    })),

  setChecklists: (checklists: AssignedChecklist[]) => set({ checklists }),

  fetchChecklists: async () => {
    const result = await getAssignedChecklistsAction();
    if (result.success && result.data) {
      set({ checklists: result.data });
    }
  },

  updatePriority: async (id: string, priority: "high" | "mid" | "low") => {
    const state = get();
    const originalChecklists = state.checklists;
    const updatedChecklists = originalChecklists.map((checklist) =>
      checklist.id === id ? { ...checklist, priority } : checklist
    );
    set({ checklists: updatedChecklists });

    try {
      const result = await updateAssignedPriority(id, priority);
      if (result.error) {
        set({ checklists: originalChecklists });
        throw new Error(result.error);
      }
    } catch (error) {
      set({ checklists: originalChecklists });
      throw error;
    }
  },

  deleteChecklist: async (id: string) => {
    const state = get();
    const originalChecklists = state.checklists;
    const updatedChecklists = originalChecklists.filter((checklist) => checklist.id !== id);
    set({ checklists: updatedChecklists });

    try {
      const result = await deleteAssignedChecklist(id);
      if (result.error) {
        set({ checklists: originalChecklists });
        throw new Error(result.error);
      }
    } catch (error) {
      set({ checklists: originalChecklists });
      throw error;
    }
  },
}));