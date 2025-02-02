import { NoteCard } from 'components/common/NoteCard';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import 'styles/pages/archives.css'
export const Archive = () => {
  const archivedNotes = useSelector((state: RootState) => 
    state.notes.notes.filter(note => note.isArchived)
  );

  return (
    <div className="container">
      <h1>Archived Notes</h1>
      {archivedNotes.map(note => (
        <NoteCard key={note.id} note={note} />
      ))}
      {archivedNotes.length < 1 && (
        <p className='archive-text'>There's no any archived notes</p>
      )}
    </div>
  );
};