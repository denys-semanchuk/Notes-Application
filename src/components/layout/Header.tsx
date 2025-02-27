import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import { Link } from 'react-router-dom';
import { ThemeToggle } from 'components/common/ThemeToggle';
import { useScrollPosition } from 'hooks/useScrollPosition';
import 'styles/header.css';

const Header = () => {
  const scrollPosition = useScrollPosition();
  const isScrolled = scrollPosition > 20;
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formattedTime = currentTime.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  return (
    <header className={isScrolled ? 'scrolled' : ''}>
      <div className="header-left">
        <Link to="/" className="logo">
          <img 
            src={require('../../assets/logo.svg').default} 
            alt='Notes App Logo' 
          />
          <span className="app-name">QuickQuill</span>
        </Link>
      </div>
      
      <Navigation />
      
      <div className="header-right">
        <div className="header-actions">
          <div className="current-time">{formattedTime}</div>
          <Link to="/search" className="search-button" aria-label="Search notes">
            <i className="fas fa-search"></i>
          </Link>
          <Link to="/notifications" className="notification-button" aria-label="Notifications">
            <i className="fas fa-bell"></i>
            <span className="notification-badge">2</span>
          </Link>
          <ThemeToggle />
          <Link to="/profile" className="user-profile">
            <div className="profile-avatar">JS</div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;