import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Sun, Moon } from 'lucide-react';

export default function Navbar({ onOpenRegister, theme, onToggleTheme }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-container">
        {/* Brand Logo - Official Uploaded Asset */}
        <a href="#hero" className="navbar-logo-link" aria-label="Innovate Forward Home">
          <img 
            src="/logo.png" 
            alt="Innovate Forward Logo" 
            className="navbar-logo-img"
          />
        </a>

        {/* Desktop Navigation Links */}
        <nav className="navbar-links">
          <a href="#about" className="nav-link">About</a>
          <a href="#experience" className="nav-link">Experience</a>
          <a href="#venue" className="nav-link">Date & Time</a>
          <a href="#register" className="nav-link">Register</a>
        </nav>

        {/* Action Button & Theme Toggle */}
        <div className="navbar-actions">
          {/* Theme Toggle Button */}
          <button 
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label={theme === 'theme-dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            title={theme === 'theme-dark' ? "Light Mode" : "Dark Mode"}
          >
            {theme === 'theme-dark' ? <Sun size={18} className="theme-icon sun" /> : <Moon size={18} className="theme-icon moon" />}
          </button>

          <button 
            className="btn-primary nav-cta-btn"
            onClick={onOpenRegister}
            aria-label="Register Now for Innovate Forward"
          >
            <span>Register Now</span>
            <ArrowRight size={16} />
          </button>

          {/* Mobile Menu Hamburger */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer open">
          <a href="#about" className="mobile-nav-link" onClick={closeMenu}>About</a>
          <a href="#experience" className="mobile-nav-link" onClick={closeMenu}>Experience</a>
          <a href="#venue" className="mobile-nav-link" onClick={closeMenu}>Date & Time</a>
          <a href="#register" className="mobile-nav-link" onClick={closeMenu}>Register</a>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Appearance</span>
            <button className="theme-toggle-btn" onClick={onToggleTheme}>
              {theme === 'theme-dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          <button 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '0.5rem' }}
            onClick={() => { closeMenu(); onOpenRegister(); }}
          >
            <span>Register Now</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </header>
  );
}
