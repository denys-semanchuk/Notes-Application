import React from 'react';
import Navigation from './Navigation';
import 'styles/header.css';
import { Link } from 'react-router-dom';
const Header = () => {
  return (
    <header>
      <Link to="/" className="logo"><img src={require('../../assets/logo.svg').default} alt='logo' /></Link>
      <Navigation />
    </header>
  );
};

export default Header;