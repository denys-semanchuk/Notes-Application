import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store';

export const selectNotes = (state: RootState) => state.notes.notes;

export const selectArchivedNotes = createSelector(
  [selectNotes],
  (notes) => notes.filter(note => note.isArchived)
);

export const selectFavoriteNotes = createSelector(
  [selectNotes],
  (notes) => notes.filter(note => note.isFavorite && !note.isArchived)
);

export const selectSortBy = (state: RootState) => state.notes.sortBy;
export const selectSortDirection = (state: RootState) => state.notes.sortDirection;
export const selectSearchQuery = (_: RootState, searchQuery: string) => searchQuery;

export const selectActiveNotes = createSelector(
  [selectNotes],
  (notes) => notes.filter(note => !note.isArchived)
);

export const selectFilteredNotes = createSelector(
  [selectActiveNotes, selectSearchQuery],
  (notes, searchQuery) => notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  )
);

export const selectSortedAndFilteredNotes = createSelector(
  [selectFilteredNotes, selectSortBy, selectSortDirection],
  (notes, sortBy, sortDirection) => 
    [...notes].sort((a, b) => {
      if (sortBy === 'date') {
        return sortDirection === 'asc'
          ? new Date(a.updatedAt!).getTime() - new Date(b.updatedAt!).getTime()
          : new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime();
      }
      return sortDirection === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    })
);