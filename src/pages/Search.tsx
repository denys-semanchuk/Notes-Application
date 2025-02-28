import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useNotesManagement } from 'hooks/useNotesManagement';
import { NoteCard } from 'components/common/NoteCard';
import { EmptyState } from 'components/common/EmptyState';
import 'styles/search.css';

export const Search = () => {
  const { notes } = useNotesManagement();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [searchResults, setSearchResults] = useState<Array<any>>([]);
  const [activeFilters, setActiveFilters] = useState({
    showArchived: false,
    showFavorites: false,
    category: 'all'
  });
  const [categories, setCategories] = useState<string[]>([]);
  
  useEffect(() => {
    if (notes.length) {
      const uniqueCategories = [...new Set(
        notes
          .filter(note => note.category)
          .map(note => note.category as string)
      )];
      setCategories(uniqueCategories);
    }
  }, [notes]);
  
  useEffect(() => {
    if (query.trim() === '' && !activeFilters.showArchived && !activeFilters.showFavorites && activeFilters.category === 'all') {
      setSearchResults([]);
      return;
    }
    
    let filtered = [...notes];
    
    if (query.trim() !== '') {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(searchTerm) || 
        note.content.toLowerCase().includes(searchTerm)
      );
    }
    
    if (!activeFilters.showArchived) {
      filtered = filtered.filter(note => !note.isArchived);
    }
    
    if (activeFilters.showFavorites) {
      filtered = filtered.filter(note => note.isFavorite);
    }
    
    if (activeFilters.category !== 'all') {
      filtered = filtered.filter(note => note.category === activeFilters.category);
    }
    
    setSearchResults(filtered);
  }, [query, notes, activeFilters]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({ q: e.target.value });
  };
  
  const handleFilterChange = (filter: keyof typeof activeFilters, value: any) => {
    setActiveFilters(prev => ({
      ...prev,
      [filter]: value
    }));
  };
  
  const clearSearch = () => {
    setSearchParams({});
    setActiveFilters({
      showArchived: false,
      showFavorites: false,
      category: 'all'
    });
  };
  
  return (
    <div className="search-page">
      <motion.div 
        className="search-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Search Notes</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by title or content..."
            value={query}
            onChange={handleSearch}
            autoFocus
          />
          {query && (
            <button className="clear-button" onClick={() => setSearchParams({})}>
              <i className="fas fa-times"></i>
            </button>
          )}
          <button className="search-button">
            <i className="fas fa-search"></i>
          </button>
        </div>
        
        <div className="filters">
          <div className="filter-section">
            <h3>Filters</h3>
            <div className="filter-options">
              <label className="filter-checkbox">
                <input 
                  type="checkbox" 
                  checked={activeFilters.showArchived} 
                  onChange={(e) => handleFilterChange('showArchived', e.target.checked)}
                />
                <span>Show Archived</span>
              </label>
              
              <label className="filter-checkbox">
                <input 
                  type="checkbox" 
                  checked={activeFilters.showFavorites} 
                  onChange={(e) => handleFilterChange('showFavorites', e.target.checked)}
                />
                <span>Favorites Only</span>
              </label>
              
              <div className="category-filter">
                <label>Category</label>
                <select 
                  value={activeFilters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {(query || activeFilters.showArchived || activeFilters.showFavorites || activeFilters.category !== 'all') && (
              <button className="clear-filters" onClick={clearSearch}>
                Clear All
              </button>
            )}
          </div>
        </div>
      </motion.div>
      
      <div className="search-results-header">
        {searchResults.length > 0 ? (
          <h2>Found {searchResults.length} {searchResults.length === 1 ? 'note' : 'notes'}</h2>
        ) : query ? (
          <h2>No notes match your search</h2>
        ) : null}
      </div>
      
      {searchResults.length > 0 ? (
        <motion.div 
          className="search-results"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {searchResults.map(note => (
            <motion.div 
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <NoteCard note={note} highlightText={query} />
            </motion.div>
          ))}
        </motion.div>
      ) : query ? (
        <EmptyState 
          icon="fas fa-search"
          title="No Results Found"
          description="Try adjusting your search or filters to find what you're looking for."
          buttonText="Clear Search"
          onButtonClick={clearSearch}
        />
      ) : (
        <div className="search-prompt">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <i className="fas fa-search"></i>
            <h2>Search for your notes</h2>
            <p>Enter keywords above to find notes by title or content</p>
          </motion.div>
        </div>
      )}
    </div>
  );
};