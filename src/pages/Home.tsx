import React from 'react';
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
  const notes = useSelector((state: RootState) => state.notes.notes);

  const createANote = (): string => {
    const newNote = {
      id: uuidv4(),
      title: 'New Note',
      content: '',
      createdAt: new Date().toISOString(),
    };
    dispatch(addNote(newNote));
    navigate(`/notepad/${newNote.id}`);
    return newNote.id
  }


  return (
    <>{notes.length > 0 ||
      <div className="home-container">
        <AddButton onClick={createANote} />
      </div>}
      {notes.length > 0 && notes.map(note => (
        <NoteCard key={note.id} note={note} />
      ))}
    </>
  )
}