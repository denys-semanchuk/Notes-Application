import React from 'react';
import Navigation from './Navigation';
import 'styles/header.css';
import { Link } from 'react-router-dom';
import { ThemeToggle } from 'components/common/ThemeToggle';
const Header = () => {
  return (
    <header>
      <Link to="/" className="logo"><img src={require('../../assets/logo.svg').default} alt='logo' /></Link>
      <Navigation />
      <ThemeToggle />
    </header>
  );
};

export default Header;