import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import 'styles/statsBar.css';
import { Note } from 'types/index';
import { Link } from 'react-router-dom';

interface StatsBarProps {
  notes: Note[];
}

export const StatsBar: React.FC<StatsBarProps> = ({ notes }) => {
  const stats = useMemo(() => {
    const active = notes.filter(note => !note.isArchived).length;
    const archived = notes.filter(note => note.isArchived).length;
    const favorites = notes.filter(note => note.isFavorite).length;

    const categories = notes.reduce((acc, note) => {
      const category = note.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    let mostUsedCategory = 'None';
    let maxCount = 0;

    Object.entries(categories).forEach(([category, count]) => {
      if (count > maxCount) {
        mostUsedCategory = category;
        maxCount = count;
      }
    });

    const getMostRecentDate = () => {
      if (notes.length === 0) return new Date();

      const dates = notes.map(note => {
        const dateValue = note.updatedAt || note.createdAt;
        return new Date(dateValue).getTime();
      });

      return new Date(Math.max(...dates));
    };

    const lastUpdated = getMostRecentDate().toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    });

    return {
      active,
      archived,
      favorites,
      totalCategories: Object.keys(categories).length,
      mostUsedCategory,
      lastUpdated
    };
  }, [notes]);

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="stats-bar"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="stat-item"
        variants={variants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3, delay: 0.1 }}
        whileHover={{ y: -5, boxShadow: "0 8px 16px rgba(0,0,0,0.1)" }}
      >
        <Link to='/'>
          <div className="stat-icon">
            <i className="fas fa-file-alt"></i>
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.active}</span>
            <span className="stat-label">Active Notes</span>
          </div>
        </Link>
      </motion.div>

      <motion.div
        className="stat-item"
        variants={variants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3, delay: 0.2 }}
        whileHover={{ y: -5, boxShadow: "0 8px 16px rgba(0,0,0,0.1)" }}
      >
        <Link to='/archive'>
          <div className="stat-icon">
            <i className="fas fa-archive"></i>
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.archived}</span>
            <span className="stat-label">Archived</span>
          </div>
        </Link>
      </motion.div>

      <motion.div
        className="stat-item"
        variants={variants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3, delay: 0.3 }}
        whileHover={{ y: -5, boxShadow: "0 8px 16px rgba(0,0,0,0.1)" }}
      >
        <Link to='/favorites'>
          <div className="stat-icon">
            <i className="fas fa-star"></i>
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.favorites}</span>
            <span className="stat-label">Favorites</span>
          </div>
        </Link>
      </motion.div>

      <motion.div
        className="stat-item"
        variants={variants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3, delay: 0.4 }}
        whileHover={{ y: -5, boxShadow: "0 8px 16px rgba(0,0,0,0.1)" }}
      >
        <Link to='/categories'>
        <div className="stat-icon">
          <i className="fas fa-folder"></i>
        </div>
        <div className="stat-info">
          <span className="stat-value">{stats.totalCategories}</span>
          <span className="stat-label">Categories</span>
        </div>
        </Link>
      </motion.div>
    </motion.div>
  );
};