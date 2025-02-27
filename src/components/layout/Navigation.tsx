import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'styles/navigation.css';

const Navigation = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className={isExpanded ? 'expanded' : ''}>
      <button 
        className="nav-toggle" 
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label="Toggle navigation menu"
      >
        <i className={`fas ${isExpanded ? 'fa-times' : 'fa-bars'}`}></i>
      </button>
      
      <ul className="nav-menu">
        <li>
          <Link to="/" className={isActive('/') ? 'active' : ''}>
            <i className="fas fa-home"></i>
            <span>Home</span>
          </Link>
        </li>
        <li>
          <Link to="/notes" className={isActive('/notes') ? 'active' : ''}>
            <i className="fas fa-sticky-note"></i>
            <span>My Notes</span>
          </Link>
        </li>
        <li>
          <Link to="/categories" className={isActive('/categories') ? 'active' : ''}>
            <i className="fas fa-folder"></i>
            <span>Categories</span>
          </Link>
        </li>
        <li>
        </li>
        <li>
          <Link to="/settings" className={isActive('/settings') ? 'active' : ''}>
            <i className="fas fa-cog"></i>
            <span>Settings</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;