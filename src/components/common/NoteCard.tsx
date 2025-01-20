import React from 'react';
import { Link } from 'react-router-dom';
import { Note } from 'types';
import 'styles/notecard.css';
import { useDispatch } from 'react-redux';
import { removeNote } from 'store/slices/notesSlice';
interface NoteCardProps {
  note: Note;
}

export const NoteCard = ({ note }: NoteCardProps) => {
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

  return (
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
  );
};