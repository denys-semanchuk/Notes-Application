import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { RootState } from "store";
import { selectSortedAndFilteredNotes } from "store/selectors/noteSelectors";
import { addNote } from "store/slices/notesSlice";
import { Note } from "types";
import { v4 as uuidv4 } from 'uuid';

export const useNotesManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { notes } = useSelector((state: RootState) => state.notes);
  const sortedAndFilteredNotes = useSelector((state: RootState) => 
    selectSortedAndFilteredNotes(state, searchQuery)
  );


  const createANote = (): string => {
    const newNote: Note = {
      id: uuidv4(),
      title: 'New Note',
      content: '',
      createdAt: new Date().toISOString(),
      images: [],
      isArchived: false,
      isFavorite: false,
      category: null
    };
    dispatch(addNote(newNote));
    navigate(`/notepad/${newNote.id}`);
    return newNote.id
  }

  return {sortedAndFilteredNotes, notes, createANote,setSearchQuery, searchQuery}
}