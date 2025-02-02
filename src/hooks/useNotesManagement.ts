import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { RootState } from "store";
import { addNote } from "store/slices/notesSlice";
import { Note } from "types";
import { v4 as uuidv4 } from 'uuid';

export const useNotesManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { notes, sortBy, sortDirection } = useSelector((state: RootState) => state.notes);


  const createANote = (): string => {
    const newNote: Note = {
      id: uuidv4(),
      title: 'New Note',
      content: '',
      createdAt: new Date().toISOString(),
      images: [],
      isArchived: false
    };
    dispatch(addNote(newNote));
    navigate(`/notepad/${newNote.id}`);
    return newNote.id
  }

  const activeNotes = useSelector((state: RootState) =>
    state.notes.notes.filter(note => !note.isArchived)
  );
  const filteredNotes = activeNotes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedAndFilteredNotes = [...filteredNotes].sort((a, b) => {
    if (sortBy === 'date') {
      return sortDirection === 'asc'
        ? new Date(a.updatedAt!).getTime() - new Date(b.updatedAt!).getTime()
        : new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime();
    } else {
      return sortDirection === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }
  });

  return {sortedAndFilteredNotes, notes, createANote,setSearchQuery, searchQuery}
}