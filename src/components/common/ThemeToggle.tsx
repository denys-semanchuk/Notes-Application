import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import 'styles/themeToggle.css';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      className={`theme-toggle ${className || ''} ${theme}`}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="toggle-track">

        <motion.div
          className="toggle-thumb"
          animate={{
            x: theme === 'light' ? '2px' : 'calc(100% - 22px)',
            backgroundColor: theme === 'light' ? '#ffffff' : '#6366F1'
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
          whileHover={{
            scale: 1.1,
            boxShadow: theme === 'light'
              ? '0 0 15px rgba(245, 158, 11, 0.5)'
              : '0 0 15px rgba(99, 102, 241, 0.5)'
          }}
        >
          <motion.div
            className="thumb-face"
            animate={{
              rotate: theme === 'light' ? 0 : 360
            }}
            transition={{
              duration: 1,
              ease: "easeInOut"
            }}
          >
            {theme === 'light' ? <FontAwesomeIcon icon={faSun} /> : <FontAwesomeIcon icon={faMoon} />}
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="theme-ripple"
        initial={{ scale: 0, opacity: 0 }}
        animate={theme === 'light'
          ? { scale: [0, 1], opacity: [0.7, 0] }
          : { scale: [0, 1], opacity: [0.7, 0] }
        }
        transition={{ duration: 0.8 }}
        style={{
          backgroundColor: theme === 'light' ? '#F59E0B' : '#6366F1'
        }}
      />
    </motion.button>
  );
};