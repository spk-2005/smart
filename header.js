import React, { useState } from 'react';
import './header.css';
import logo from './newsa.png'
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  function CustomLink({ href, children, onClick }) {
    const path = window.location.pathname;
    return (
      <li className={path === href ? "active" : ""} onClick={onClick}>
        <a href={href}>{children}</a>
      </li>
    );
  }

  return (
    <section id='head'>
      <nav>
        <div className="logo">
          <img src={logo} alt='error' id='logo1'/>
        </div>
        <div className={`menu-icon ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <CustomLink href='/'>Home</CustomLink>
          <CustomLink href='/environment'>Environment</CustomLink>
          <CustomLink href='/health'>Health</CustomLink>
          <CustomLink href='/food'>Food Wastage</CustomLink>
          <CustomLink href='/disasters'>Natural Disasters</CustomLink>
          <CustomLink href='/contact'>Contact Us</CustomLink>
        </ul>
      </nav>
    </section>
  );
}
