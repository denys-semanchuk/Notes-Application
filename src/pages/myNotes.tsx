import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NoteCard } from 'components/common/NoteCard';
import { EmptyState } from 'components/common/EmptyState';
import { useNotesManagement } from 'hooks/useNotesManagement';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faListUl, faTableCells, faFilter, 
  faSortAmountDown, faSortAmountUp, faPlus 
} from '@fortawesome/free-solid-svg-icons';
import 'styles/myNotes.css';

export const MyNotes = () => {
  const { notes, createANote } = useNotesManagement();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<{field: string, direction: 'asc' | 'desc'}>({
    field: 'updatedAt', 
    direction: 'desc'
  });
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filteredNotes, setFilteredNotes] = useState(notes);
  
  const categories = React.useMemo(() => {
    const allCategories = notes
      .filter(note => note.category)
      .map(note => note.category as string);
    
    return ['All', ...new Set(allCategories)];
  }, [notes]);
  
  useEffect(() => {
    let result = [...notes];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(note => 
        note.title.toLowerCase().includes(term) || 
        note.content.toLowerCase().includes(term)
      );
    }
    
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(note => note.category === selectedCategory);
    }
    
    result.sort((a, b) => {
      let valueA: any;
      let valueB: any;
      
      switch (sortOption.field) {
        case 'title':
          valueA = a.title?.toLowerCase() || '';
          valueB = b.title?.toLowerCase() || '';
          break;
        case 'createdAt':
          valueA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          valueB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          break;
        case 'updatedAt':
          valueA = a.updatedAt ? new Date(a.updatedAt).getTime() : 
                   a.createdAt ? new Date(a.createdAt).getTime() : 0;
          valueB = b.updatedAt ? new Date(b.updatedAt).getTime() : 
                   b.createdAt ? new Date(b.createdAt).getTime() : 0;
          break;
        default:
          const field = sortOption.field as keyof typeof a;
          valueA = a[field] !== undefined ? a[field] : '';
          valueB = b[field] !== undefined ? b[field] : '';
      }
      
      valueA = valueA ?? '';
      valueB = valueB ?? '';
      
      if (sortOption.direction === 'asc') {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      }
    });
    
    setFilteredNotes(result);
  }, [notes, searchTerm, selectedCategory, sortOption]);
  
  const stats = React.useMemo(() => {
    return {
      total: notes.length,
      active: notes.filter(n => !n.isArchived).length,
      archived: notes.filter(n => n.isArchived).length,
      favorites: notes.filter(n => n.isFavorite).length,
    };
  }, [notes]);
  
  const toggleSort = (field: string) => {
    setSortOption(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  const handleCreateNote = () => {
    createANote();
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };
  
  return (
    <div className="my-notes-page">
      <motion.div 
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="title-section">
          <h1>My Notes</h1>
          <div className="stats-pills">
            <span className="stat-pill total">{stats.total} Total</span>
            <span className="stat-pill active">{stats.active} Active</span>
            <span className="stat-pill archived">{stats.archived} Archived</span>
            <span className="stat-pill favorites">{stats.favorites} Favorites</span>
          </div>
        </div>
        
        <motion.button 
          className="create-note-button"
          onClick={handleCreateNote}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FontAwesomeIcon icon={faPlus} /> New Note
        </motion.button>
      </motion.div>
      
      <div className="tools-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              className="clear-search" 
              onClick={() => setSearchTerm('')}
            >
              <FontAwesomeIcon icon="times" />
            </button>
          )}
        </div>
        
        <div className="view-options">
          <button 
            className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
          >
            <FontAwesomeIcon icon={faTableCells} />
          </button>
          <button 
            className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            aria-label="List view"
          >
            <FontAwesomeIcon icon={faListUl} />
          </button>
          
          <div className="divider"></div>
          
          <div className="sort-dropdown">
            <button 
              className="sort-button"
              onClick={() => toggleSort('updatedAt')}
              aria-label="Sort options"
            >
              <FontAwesomeIcon 
                icon={sortOption.direction === 'asc' ? faSortAmountUp : faSortAmountDown} 
              />
              <span>{sortOption.field === 'updatedAt' ? 'Date' : 
                     sortOption.field === 'title' ? 'Title' : 
                     sortOption.field === 'createdAt' ? 'Created' : 
                     'Sort'}</span>
            </button>
            <div className="sort-menu">
              <button 
                className={sortOption.field === 'updatedAt' ? 'active' : ''}
                onClick={() => toggleSort('updatedAt')}
              >
                Last Updated
              </button>
              <button 
                className={sortOption.field === 'createdAt' ? 'active' : ''}
                onClick={() => toggleSort('createdAt')}
              >
                Creation Date
              </button>
              <button 
                className={sortOption.field === 'title' ? 'active' : ''}
                onClick={() => toggleSort('title')}
              >
                Title
              </button>
            </div>
          </div>
          
          <button 
            className={`filter-button ${showFilterPanel ? 'active' : ''}`}
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            aria-label="Filter options"
          >
            <FontAwesomeIcon icon={faFilter} />
            <span>Filter</span>
          </button>
        </div>
      </div>
      
      {showFilterPanel && (
        <motion.div 
          className="filter-panel"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="category-filters">
            <h3>Categories</h3>
            <div className="category-pills">
              {categories.map(category => (
                <button
                  key={category}
                  className={`category-pill ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category === 'All' ? null : category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {(searchTerm || selectedCategory) && (
            <button 
              className="clear-filters-button"
              onClick={clearFilters}
            >
              Clear All Filters
            </button>
          )}
        </motion.div>
      )}
      
      <div className="search-results-info">
        {filteredNotes.length > 0 ? (
          <p>Showing {filteredNotes.length} notes</p>
        ) : (
          <p>No notes match your filters</p>
        )}
      </div>
      
      {filteredNotes.length > 0 ? (
        <motion.div 
          className={`notes-container ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredNotes.map(note => (
            <motion.div 
              key={note.id}
              variants={itemVariants}
              className="note-card-container"
            >
              <NoteCard note={note} highlightText={searchTerm} />
            </motion.div>
          ))}
        </motion.div>
      ) : notes.length > 0 ? (
        <EmptyState 
          icon="fas fa-filter"
          title="No matching notes"
          description="Try adjusting your filters or search terms to find what you're looking for."
          buttonText="Clear Filters"
          onButtonClick={clearFilters}
        />
      ) : (
        <EmptyState 
          icon="fas fa-book"
          title="No notes yet"
          description="Create your first note to get started organizing your thoughts."
          buttonText="Create Note"
          onButtonClick={handleCreateNote}
        />
      )}
    </div>
  );
};