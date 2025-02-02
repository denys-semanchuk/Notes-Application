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