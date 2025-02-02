import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSortBy, SortType, SortDirection } from 'store/slices/notesSlice';
import { RootState } from 'store';
import 'styles/sortNotes.css';

export const SortNotes = () => {
  const dispatch = useDispatch();
  const { sortBy, sortDirection } = useSelector((state: RootState) => state.notes);

  const handleSort = (type: SortType) => {
    const newDirection: SortDirection = 
      type === sortBy ? (sortDirection === 'asc' ? 'desc' : 'asc') : 'asc';
    
    dispatch(setSortBy({ type, direction: newDirection }));
  };

  return (
    <div className="sort-controls">
      <button 
        className={`sort-button ${sortBy === 'date' ? 'active' : ''}`}
        onClick={() => handleSort('date')}
      >
        Date {sortBy === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
      </button>
      <button 
        className={`sort-button ${sortBy === 'title' ? 'active' : ''}`}
        onClick={() => handleSort('title')}
      >
        Title {sortBy === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
      </button>
    </div>
  );
};