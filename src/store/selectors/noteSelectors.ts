import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store';

export const selectNotes = (state: RootState) => state.notes.notes;

// Basic selectors
export const selectArchivedNotes = createSelector(
  selectNotes,
  (notes) => notes.filter(note => note.isArchived)
);

export const selectFavoriteNotes = createSelector(
  selectNotes,
  (notes) => notes.filter(note => note.isFavorite && !note.isArchived)
);

export const selectActiveNotes = createSelector(
  selectNotes,
  (notes) => notes.filter(note => !note.isArchived)
);

export const selectSortBy = (state: RootState) => state.notes.sortBy;
export const selectSortDirection = (state: RootState) => state.notes.sortDirection;

// For global search
export const selectGlobalSearchQuery = (state: RootState, searchQuery: string) => searchQuery;

// For global search filtering - used by useNotesManagement
export const selectGlobalSearchFilteredNotes = createSelector(
  selectActiveNotes,
  selectGlobalSearchQuery,
  (notes, searchQuery) => {
    if (!searchQuery || searchQuery.trim() === '') {
      return notes;
    }
    
    const query = searchQuery.toLowerCase();
    return notes.filter(note => 
      note.title.toLowerCase().includes(query) || 
      note.content.toLowerCase().includes(query)
    );
  }
);

// Used in Categories component - doesn't need a parameter
export const selectFilteredNotes = createSelector(
  selectNotes,
  (state: RootState) => state.categories?.selectedCategory,
  (state: RootState) => state.categories?.searchTerm,
  (notes, selectedCategory, searchTerm) => {
    // Start with non-archived notes
    let filtered = notes.filter(note => !note.isArchived);
    
    // Apply category filter if one is selected
    if (selectedCategory) {
      filtered = filtered.filter(note => note.category === selectedCategory);
    }
    
    // Apply search term if provided
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(term) || 
        note.content.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  }
);

// For sorting - used by useNotesManagement
export const selectSortedAndFilteredNotes = createSelector(
  selectGlobalSearchFilteredNotes,
  selectSortBy,
  selectSortDirection,
  (notes, sortBy, sortDirection) => 
    [...notes].sort((a, b) => {
      if (sortBy === 'date') {
        return sortDirection === 'asc'
          ? new Date(a.updatedAt || a.createdAt).getTime() - new Date(b.updatedAt || b.createdAt).getTime()
          : new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
      }
      return sortDirection === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    })
);