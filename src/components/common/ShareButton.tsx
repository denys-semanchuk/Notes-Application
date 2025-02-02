import React, { useState } from 'react';
import { Note } from 'types';
import { ReactComponent as ArrowIcon } from "assets/arrowIcon.svg";
import 'styles/shareButton.css';

interface ShareButtonProps {
  note: Note;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ note }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const copyToClipboard = async () => {
    try {
      const content = `${note.title}\n\n${note.content}`;
      await navigator.clipboard.writeText(content);
      alert('Copied to clipboard!');
    } catch (err) {
      alert('Failed to copy');
    }
    setIsMenuOpen(false);
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(note.title);
    const body = encodeURIComponent(note.content);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setIsMenuOpen(false);
  };

  return (
    <div className="share-container">
      <button
        className="share-button"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Share note"
      >
        <ArrowIcon />
      </button>
      {isMenuOpen && (
        <div className="share-menu">
          <button onClick={copyToClipboard}>
            📋 Copy to clipboard
          </button>
          <button onClick={shareViaEmail}>
            📧 Share via email
          </button>
        </div>
      )}
    </div>
  );
};