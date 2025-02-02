import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store';

export const selectNotes = (state: RootState) => state.notes.notes;

export const selectArchivedNotes = createSelector(
  [selectNotes],
  (notes) => notes.filter(note => note.isArchived)
);