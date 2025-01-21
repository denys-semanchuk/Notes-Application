import React from 'react';
import { Link } from 'react-router-dom';
import 'styles/404.css';

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <h1>404</h1>
        <p>Oops! Page not found</p>
        <div className="icon">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <path d="M32 5.33334L56 44H8L32 5.33334Z" stroke="#2563eb" strokeWidth="4"/>
            <circle cx="32" cy="36" r="2" fill="#2563eb"/>
            <rect x="30" y="24" width="4" height="8" fill="#2563eb"/>
          </svg>
        </div>
        <Link to="/" className="back-button">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;