import React from 'react';
import { AddButton } from 'components/common/AddButton';
import 'styles/home.css';
import { NoteCard } from 'components/common/NoteCard';
import { SortNotes } from 'components/common/SortNotes';
import { useNotesManagement } from 'hooks/useNotesManagement';
import { Tabs } from 'components/common/NotesTabs';
import { Outlet, useLocation } from 'react-router';

export const Home = () => {
  const { sortedAndFilteredNotes, notes, createANote, setSearchQuery, searchQuery } = useNotesManagement();
  const location = useLocation();
  const isMainRoute = location.pathname === '/';

  // Filter for active notes only on main route
  const activeNotes = sortedAndFilteredNotes.filter(note => !note.isArchived);

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
      <Tabs />

      {notes.length === 0 && (
        <div className="home-container">
          <AddButton onClick={createANote} />
        </div>
      )}

      <SortNotes />
      
      {!isMainRoute ? (
        <Outlet />
      ) : (
        activeNotes.length > 0 && activeNotes.map(note => (
          <div key={note.id}>
            <NoteCard note={note} />
            <div className='add-button-container'>
              <AddButton onClick={createANote} />
            </div>
          </div>
        ))
      )}
    </>
  );
};