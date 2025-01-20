import React from 'react';
import 'styles/footer.css';
const Footer = () => {
  return (
    <footer>
      <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
      <nav>
        <ul>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;