import React from 'react';
import { Link } from 'react-router-dom';
import { Note } from 'types';
import 'styles/notecard.css';
import { useDispatch } from 'react-redux';
import { removeNote, toggleArchive, toggleFavorite } from 'store/slices/notesSlice';
import { ShareButton } from './ShareButton';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faArchive, faTrashAlt, faBoxOpen, faShare } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';

interface NoteCardProps {
  note: Note;
  highlightText?: string;
}

const highlightFn = (text: string, highlight: string) => {
  if (!highlight?.trim()) {
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
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this note?')) {
      dispatch(removeNote(note.id));
    }
  };

  const handleArchive = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleArchive(note.id));
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavorite(note.id));
  };

  const coverImage = note.images && note.images.length > 0 ? note.images[0] : null;

  const getCategoryColor = () => {
    if (!note.category) return null;
    
    const categoryColors: Record<string, string> = {
      Work: '#3b82f6',
      Personal: '#10b981',
      Ideas: '#f59e0b',
      Tasks: '#ef4444',
      Study: '#8b5cf6',
      Travel: '#06b6d4',
      Finance: '#84cc16',
      Health: '#ec4899',
    };
    
    if (!categoryColors[note.category]) {
      const hash = note.category.split('').reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
      }, 0);
      const h = Math.abs(hash) % 360;
      return `hsl(${h}, 70%, 60%)`;
    }
    
    return categoryColors[note.category];
  };
  
  const categoryColor = getCategoryColor();
  const hasBadges = note.isFavorite || note.isArchived;

  return (
    <motion.div 
      className="note-card-wrapper"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
    >
      <Link to={`/notepad/${note.id}`} className={`note-card ${note.isArchived ? 'archived' : ''}`}>
        {coverImage && (
          <div className="note-cover-image">
            <img src={coverImage} alt="" />
          </div>
        )}

        {note.category && (
          <div 
            className="note-category" 
            style={{ backgroundColor: categoryColor || 'var(--accent-color)' }}
          >
            {note.category}
          </div>
        )}

        <div className="note-content">
          <h3 className="note-title">
            {highlightText 
              ? <span dangerouslySetInnerHTML={{__html: highlightFn(note.title || 'Untitled', highlightText)}} />
              : (note.title || 'Untitled')
            }
          </h3>
          
          <div
            className="note-preview"
            dangerouslySetInnerHTML={{
              __html: highlightText
                ? highlightFn(note.content.substring(0, 120), highlightText)
                : note.content.substring(0, 120) + (note.content.length > 120 ? '...' : '')
            }}
          />
          
          <div className="note-footer">
            <span className="note-date">
              <FontAwesomeIcon icon="calendar" className="icon-calendar" />
              {formatDate(note.createdAt)}
            </span>
            
            {hasBadges && (
              <div className="note-badges">
                {note.isFavorite && (
                  <span className="note-badge favorite">
                    <FontAwesomeIcon icon={faStar} />
                  </span>
                )}
                {note.isArchived && (
                  <span className="note-badge archived">
                    <FontAwesomeIcon icon={faArchive} />
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
      
      <div className="note-actions">
        <motion.button
          className={`action-button favorite ${note.isFavorite ? 'active' : ''}`}
          onClick={handleFavorite}
          aria-label={note.isFavorite ? "Remove from favorites" : "Add to favorites"}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <FontAwesomeIcon icon={note.isFavorite ? faStar : farStar} />
        </motion.button>
        
        <motion.button
          className={`action-button archive ${note.isArchived ? 'active' : ''}`}
          onClick={handleArchive}
          aria-label={note.isArchived ? "Unarchive" : "Archive"}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <FontAwesomeIcon icon={note.isArchived ? faBoxOpen : faArchive} />
        </motion.button>
        
        <ShareButton note={note}>
          <motion.div
            className="action-button share"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <FontAwesomeIcon icon={faShare} />
          </motion.div>
        </ShareButton>
        
        <motion.button
          className="action-button delete"
          onClick={handleDelete}
          aria-label="Delete note"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <FontAwesomeIcon icon={faTrashAlt} />
        </motion.button>
      </div>
    </motion.div>
  );
};