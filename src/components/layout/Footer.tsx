import React from 'react';
import 'styles/footer.css';
const Footer = () => {
  return (
    <footer>
      <p>&copy; {new Date().getFullYear()} QuickQuill Notes. All rights reserved.</p>
    </footer>
  );
};

export default Footer;