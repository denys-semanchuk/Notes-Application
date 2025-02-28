import React from 'react';
import { Link } from 'react-router-dom';
import { Note } from 'types';
import 'styles/notecard.css';
import { useDispatch } from 'react-redux';
import { removeNote, toggleArchive, toggleFavorite } from 'store/slices/notesSlice';
import { ShareButton } from './ShareButton';
interface NoteCardProps {
  note: Note;
  highlightText?: string;
}
const highlightFn = (text: string, highlight: string) => {
  if (!highlight.trim()) {
    return text;
  }

  const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<span class="highlight">$1</span>');
};
export const NoteCard = ({ note, highlightText }: NoteCardProps) => {
  const dispatch = useDispatch();
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(removeNote(note.id));
  };

  const handleArchive = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(toggleArchive(note.id));
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(toggleFavorite(note.id));
  };


  return (
    <div className='link-wrapper'>
      <div
        className="note-preview"
        dangerouslySetInnerHTML={{
          __html: highlightText
            ? highlightFn(note.content.substring(0, 100), highlightText)
            : note.content.substring(0, 100) + '...'
        }}
      />
      <div className="note-actions">
        <ShareButton note={note} />
        <button
          onClick={handleFavorite}
          className={`favorite-button ${note.isFavorite ? 'active' : ''}`}
          aria-label={note.isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {note.isFavorite ? "⭐" : "☆"}
        </button>
        <button
          onClick={handleArchive}
          className="archive-button"
          aria-label={note.isArchived ? "Unarchive" : "Archive"}
        >
          {note.isArchived ? "📤" : "📥"}
        </button>
      </div>
      <Link to={`/notepad/${note.id}`} className="note-card">
        <div className="note-header">
          <h3 className="note-title">{note.title || 'Untitled'}</h3>
          <button
            className="delete-button"
            onClick={handleDelete}
            aria-label="Delete note"
          >
            ✕
          </button>
        </div>
        <p className="note-preview">{note.content.slice(0, 100) || 'Empty note...'}</p>
        <span className="note-date">{formatDate(note.createdAt)}</span>
      </Link>
    </div>
  );
};