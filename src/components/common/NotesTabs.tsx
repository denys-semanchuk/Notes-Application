import React from 'react'
import { Link } from "react-router-dom";

export const Tabs = () => {
  return (
    <nav>
      <Link to="/">Notes</Link>
      <Link to="/favorites">Favorites</Link>
      <Link to="/archive">Archive</Link>
    </nav>
  );
};