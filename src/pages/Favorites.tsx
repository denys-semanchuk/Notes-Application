import React from 'react';
import { useSelector } from 'react-redux';
import { NoteCard } from 'components/common/NoteCard';
import { selectFavoriteNotes } from 'store/selectors/noteSelectors';

export const Favorites = () => {
  const favoriteNotes = useSelector(selectFavoriteNotes);

  return (
    <div className="favorites-container">
      <h1>Favorite Notes</h1>
      {favoriteNotes.map(note => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
};