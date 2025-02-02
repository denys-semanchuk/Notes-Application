import React from 'react';
import { AddButton } from 'components/common/AddButton';
import 'styles/home.css';
import { NoteCard } from 'components/common/NoteCard';
import { SortNotes } from 'components/common/SortNotes';
import { useNotesManagement } from 'hooks/useNotesManagement';

export const Home = () => {
  const { sortedAndFilteredNotes, notes, createANote, setSearchQuery, searchQuery } = useNotesManagement()


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