import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Note } from "types";
export type SortType = "date" | "title";
export type SortDirection = "asc" | "desc";

interface NotesState {
  notes: Note[];
  loading: boolean;
  error: string | null;
  sortBy: SortType;
  sortDirection: SortDirection;
}

const initialState: NotesState = {
  notes: [],
  loading: false,
  error: null,
  sortBy: "date",
  sortDirection: "desc",
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    addNote: (state, action: PayloadAction<Note>) => {
      state.notes.push(action.payload);
    },
    removeNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter((note) => note.id !== action.payload);
    },
    updateNote: (state, action: PayloadAction<Note>) => {
      const index = state.notes.findIndex(
        (note) => note.id === action.payload.id
      );
      if (index !== -1) {
        state.notes[index] = action.payload;
      }
    },
    setSortBy: (
      state,
      action: PayloadAction<{ type: SortType; direction: SortDirection }>
    ) => {
      state.sortBy = action.payload.type;
      state.sortDirection = action.payload.direction;
    },
    toggleArchive: (state, action: PayloadAction<string>) => {
      const note = state.notes.find((note) => note.id === action.payload);
      if (note) {
        note.isArchived = !note.isArchived;
        note.updatedAt = new Date().toISOString();
      }
    },
  },
});

export const { addNote, removeNote, updateNote, setSortBy, toggleArchive } =
  notesSlice.actions;
export default notesSlice.reducer;
