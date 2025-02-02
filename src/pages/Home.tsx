import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { v4 as uuidv4 } from 'uuid';
import { AddButton } from 'components/common/AddButton';
import 'styles/home.css';
import { addNote } from 'store/slices/notesSlice';
import { useNavigate } from 'react-router';
import { NoteCard } from 'components/common/NoteCard';
import { SortNotes } from 'components/common/SortNotes';
import { Note } from 'types';

export const Home = () => {
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



  return (
    <>
      {notes.length > 0 && (
        <div className="search-container">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      )}

      {notes.length === 0 && (
        <div className="home-container">
          <AddButton onClick={createANote} />
        </div>
      )}

      <SortNotes />
      {sortedAndFilteredNotes.length > 0 && sortedAndFilteredNotes.map(note => (
        <div key={note.id}>
          <NoteCard note={note} />
          <div className='add-button-container'>
            <AddButton onClick={createANote} />
          </div>
        </div>
      ))}
    </>
  )
}