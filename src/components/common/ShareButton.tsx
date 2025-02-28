import React, { useState, ReactNode, useRef, useEffect } from 'react';
import { Note } from 'types';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShare, 
  faCopy, 
  faEnvelope, 
  faFileExport, 
  faLink
} from '@fortawesome/free-solid-svg-icons';
import { 
  faWhatsapp, 
  faTelegram 
} from '@fortawesome/free-brands-svg-icons';
import 'styles/shareButton.css';
import ReactDOM from 'react-dom';

interface ShareButtonProps {
  note: Note;
  children?: ReactNode;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ note, children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const targetElement = event.target as Node;
      const buttonElement = children ? divRef.current : buttonRef.current;
      
      if (
        menuRef.current && 
        !menuRef.current.contains(targetElement) && 
        buttonElement && 
        !buttonElement.contains(targetElement)
      ) {
        setIsMenuOpen(false);
      }
    };
    
    if (isMenuOpen) {
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, children]);
  
  useEffect(() => {
    if (isMenuOpen) {
      const calculatePosition = () => {
        const element = children ? divRef.current : buttonRef.current;
        if (!element) return;
        
        const buttonRect = element.getBoundingClientRect();
        
        const menuWidth = 250;
        const menuHeight = 400;
        
        let left = buttonRect.right - menuWidth;
        let top = buttonRect.bottom + 5;
        
        if (top + menuHeight > window.innerHeight) {
          top = Math.max(10, buttonRect.top - menuHeight - 5);
        }
        
        if (left + menuWidth > window.innerWidth) {
          left = window.innerWidth - menuWidth - 10;
        }
        
        if (left < 10) {
          left = 10;
        }
        
        setMenuPosition({ top, left });
      };
      
      calculatePosition();
      
      window.addEventListener('resize', calculatePosition);
      return () => {
        window.removeEventListener('resize', calculatePosition);
      };
    }
  }, [isMenuOpen, children]);

  const copyToClipboard = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const content = `${note.title}\n\n${note.content}`;
      await navigator.clipboard.writeText(content);
      
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      setCopySuccess('Failed to copy');
      setTimeout(() => setCopySuccess(null), 2000);
    }
  };
  
  const copyLinkToClipboard = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const link = `${window.location.origin}/notepad/${note.id}`;
      await navigator.clipboard.writeText(link);
      
      setCopySuccess('Link copied!');
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      setCopySuccess('Failed to copy link');
      setTimeout(() => setCopySuccess(null), 2000);
    }
  };

  const shareViaEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const subject = encodeURIComponent(note.title);
    const body = encodeURIComponent(`${note.content}\n\n${window.location.origin}/notepad/${note.id}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setIsMenuOpen(false);
  };
  
  const shareViaWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const text = encodeURIComponent(`${note.title}\n\n${window.location.origin}/notepad/${note.id}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    setIsMenuOpen(false);
  };
  
  const shareViaTelegram = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const text = encodeURIComponent(`${note.title}\n\n${window.location.origin}/notepad/${note.id}`);
    window.open(`https://t.me/share/url?url=${window.location.origin}/notepad/${note.id}&text=${text}`, '_blank');
    setIsMenuOpen(false);
  };
  
  const exportAsTxt = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const content = `${note.title}\n\n${note.content}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title || 'note'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsMenuOpen(false);
  };

  const handleToggleMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const menuVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: -10,
      transition: { 
        duration: 0.15 
      } 
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      let portalContainer = document.getElementById('share-menu-portal');
      if (!portalContainer) {
        portalContainer = document.createElement('div');
        portalContainer.id = 'share-menu-portal';
        document.body.appendChild(portalContainer);
      }
    }
  }, []);

  return (
    <div className="share-container">
      {children ? (
        <div onClick={handleToggleMenu} ref={divRef}>
          {children}
        </div>
      ) : (
        <motion.button
          className="share-button"
          onClick={handleToggleMenu}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Share note"
          ref={buttonRef}
        >
          <FontAwesomeIcon icon={faShare} />
        </motion.button>
      )}
      
      {isMenuOpen && ReactDOM.createPortal(
        <div 
          className="share-menu-wrapper"
          ref={menuRef}
          onClick={(e) => e.stopPropagation()} 
        >
          <motion.div 
            className="share-menu"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: 'fixed',
              top: menuPosition.top,
              left: menuPosition.left,
              zIndex: 10000,
            }}
          >
            <div className="share-menu-header">
              <h3>Share Note</h3>
              <button 
                className="close-button" 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(false);
                }}
                aria-label="Close share menu"
              >
                &times;
              </button>
            </div>
            
            <div className="share-menu-content">
              <button 
                className="share-option-button"
                onClick={copyToClipboard}
              >
                <div className="share-option-icon copy">
                  <FontAwesomeIcon icon={faCopy} />
                </div>
                <span>Copy content</span>
              </button>
              
              <button 
                className="share-option-button"
                onClick={copyLinkToClipboard}
              >
                <div className="share-option-icon link">
                  <FontAwesomeIcon icon={faLink} />
                </div>
                <span>Copy link</span>
              </button>
              
              <button 
                className="share-option-button"
                onClick={shareViaEmail}
              >
                <div className="share-option-icon email">
                  <FontAwesomeIcon icon={faEnvelope} />
                </div>
                <span>Email</span>
              </button>
              
              <button 
                className="share-option-button"
                onClick={shareViaWhatsApp}
              >
                <div className="share-option-icon whatsapp">
                  <FontAwesomeIcon icon={faWhatsapp} />
                </div>
                <span>WhatsApp</span>
              </button>
              
              <button 
                className="share-option-button"
                onClick={shareViaTelegram}
              >
                <div className="share-option-icon telegram">
                  <FontAwesomeIcon icon={faTelegram} />
                </div>
                <span>Telegram</span>
              </button>
              
              <button 
                className="share-option-button"
                onClick={exportAsTxt}
              >
                <div className="share-option-icon export">
                  <FontAwesomeIcon icon={faFileExport} />
                </div>
                <span>Export as TXT</span>
              </button>
            </div>
            
            {copySuccess && (
              <div className="copy-feedback">
                {copySuccess}
              </div>
            )}
          </motion.div>
        </div>,
        document.getElementById('share-menu-portal') || document.body
      )}
    </div>
  );
};