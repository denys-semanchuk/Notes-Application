import React from 'react';
import { Link } from 'react-router-dom';
import 'styles/navigation.css';
const Navigation = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/archive">Archive</Link></li>
      </ul>
    </nav>
  );
};

export default Navigation;