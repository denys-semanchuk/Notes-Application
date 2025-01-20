import React from 'react';
import { Link } from 'react-router-dom';
import { Note } from 'types';
import  'styles/notecard.css';
interface NoteCardProps {
  note: Note;
}

export const NoteCard = ({ note }: NoteCardProps) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Link to={`/notepad/${note.id}`} className="note-card">
      <h3 className="note-title">{note.title || 'Untitled'}</h3>
      <p className="note-preview">{note.content.slice(0, 100) || 'Empty note...'}</p>
      <span className="note-date">{formatDate(note.createdAt)}</span>
    </Link>
  );
};