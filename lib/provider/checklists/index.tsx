'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useChecklistFilterStore, ChecklistFilters } from './ongoing-checklist';

export { useChecklistFilterStore };

// Keep context for backward compatibility or if needed
interface ChecklistFilterContextType {
  // Ongoing checklists filters
  ongoingFilters: ChecklistFilters;
  // Available checklists filters
  availableFilters: ChecklistFilters;

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
}

const ChecklistFilterContext = createContext<ChecklistFilterContextType | undefined>(undefined);

export function ChecklistFilterProvider({ children }: { children: ReactNode }) {
  const store = useChecklistFilterStore();

  const value: ChecklistFilterContextType = {
    ongoingFilters: store.ongoingFilters,
    availableFilters: store.availableFilters,

    setOngoingSearchTerm: store.setOngoingSearchTerm,
    setOngoingStatus: store.setOngoingStatus,
    setOngoingCategory: store.setOngoingCategory,
    setOngoingSortBy: store.setOngoingSortBy,
    resetOngoingFilters: store.resetOngoingFilters,

    setAvailableSearchTerm: store.setAvailableSearchTerm,
    setAvailableCategory: store.setAvailableCategory,
    setAvailableSortBy: store.setAvailableSortBy,
    resetAvailableFilters: store.resetAvailableFilters,
  };

  return React.createElement(ChecklistFilterContext.Provider, { value }, children);
}

export function useChecklistFilters() {
  const context = useContext(ChecklistFilterContext);
  if (context === undefined) {
    throw new Error('useChecklistFilters must be used within a ChecklistFilterProvider');
  }
  return context;
}

// Selectors for easy access
export const useOngoingFilters = () => {
  const { ongoingFilters } = useChecklistFilterStore();
  return ongoingFilters;
};

export const useAvailableFilters = () => {
  const { availableFilters } = useChecklistFilterStore();
  return availableFilters;
};

// Action selectors
export const useOngoingFilterActions = () => {
  const {
    setOngoingSearchTerm,
    setOngoingStatus,
    setOngoingCategory,
    setOngoingSortBy,
    resetOngoingFilters,
  } = useChecklistFilterStore();

  return {
    setSearchTerm: setOngoingSearchTerm,
    setStatus: setOngoingStatus,
    setCategory: setOngoingCategory,
    setSortBy: setOngoingSortBy,
    reset: resetOngoingFilters,
  };
};

export const useAvailableFilterActions = () => {
  const {
    setAvailableSearchTerm,
    setAvailableCategory,
    setAvailableSortBy,
    resetAvailableFilters,
  } = useChecklistFilterStore();

  return {
    setSearchTerm: setAvailableSearchTerm,
    setCategory: setAvailableCategory,
    setSortBy: setAvailableSortBy,
    reset: resetAvailableFilters,
  };
};;
