import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { v4 as uuidv4 } from 'uuid';
import { AddButton } from 'components/common/AddButton';
import 'styles/home.css';
import { addNote } from 'store/slices/notesSlice';
import { useNavigate } from 'react-router';
import { NoteCard } from 'components/common/NoteCard';

export const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const notes = useSelector((state: RootState) => state.notes.notes);
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const createANote = (): string => {
    const newNote = {
      id: uuidv4(),
      title: 'New Note',
      content: '',
      createdAt: new Date().toISOString(),
      images: []
    };
    dispatch(addNote(newNote));
    navigate(`/notepad/${newNote.id}`);
    return newNote.id
  }


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

      {notes.length > 0 && filteredNotes.map(note => (
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