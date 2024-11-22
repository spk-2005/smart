import React, { useState } from 'react';
import './adminheader.css'; // Ensure you have this CSS file for styles

export default function Adminheader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  function CustomLink({ href, children }) {
    const path = window.location.pathname;
    return (
      <li className={`custom-link ${path === href ? 'active' : ''}`}>
        <a href={href}>{children}</a>
      </li>
    );
  }

  return (
    <section id='adhead'>
      <div className="header-container">
        <h1 className="header-title">Admin Panel</h1>
        <button className="hamburger" onClick={toggleMenu}>
          &#9776; {/* Hamburger icon */}
        </button>
        <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
          <ul className="link-list">
            <CustomLink href='/admin'>Home</CustomLink>
            <CustomLink href='/creditsallotment'>credits allotment</CustomLink>
            <CustomLink href="/winners">Winners</CustomLink>
            <CustomLink href="/users">Users</CustomLink>
            <CustomLink href="/suggestions">Suggestions</CustomLink>
            <CustomLink href="/rating">Rating</CustomLink>
          </ul>
        </nav>
      </div>
    </section>
  );
}
