import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Intro from './components/Intro';
import WhatToExpect from './components/WhatToExpect';
import Programme from './components/Programme';
import Speakers from './components/Speakers';
import Audience from './components/Audience';
import VenueDetails from './components/VenueDetails';
import FinalCta from './components/FinalCta';
import Footer from './components/Footer';
import RegisterModal from './components/RegisterModal';
import TeaserModal from './components/TeaserModal';
import './styles/App.css';

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('if_theme') || 'theme-light';
  });
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isTeaserOpen, setIsTeaserOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('if_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'theme-light' ? 'theme-dark' : 'theme-light'));
  };

  const handleOpenRegister = () => setIsRegisterOpen(true);
  const handleCloseRegister = () => setIsRegisterOpen(false);

  const handleOpenTeaser = () => setIsTeaserOpen(true);
  const handleCloseTeaser = () => setIsTeaserOpen(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setToastMessage('Link copied to clipboard! Share Innovate Forward with your team.');
      setTimeout(() => setToastMessage(''), 3500);
    } else {
      setToastMessage('Event details ready to share: 22 September 2026!');
      setTimeout(() => setToastMessage(''), 3500);
    }
  };

  return (
    <div className={`app-root ${theme}`}>
      {/* Ambient background glows for luminous depth */}
      <div className="ambient-decor decor-top-right"></div>
      <div className="ambient-decor decor-left"></div>

      {/* Navigation */}
      <Navbar 
        onOpenRegister={handleOpenRegister} 
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Sections */}
      <main>
        {/* Section 4 & 5: Hero + Live Countdown + 3D Point-Cloud Globe & Gyroscopic Orbit */}
        <Hero 
          onOpenRegister={handleOpenRegister} 
          onOpenTeaser={handleOpenTeaser}
          theme={theme}
        />

        {/* Section 6: Intro ("Where Ideas Move Forward") */}
        <Intro />

        {/* Section 7: What to Expect ("Explore. Experience. Imagine. Build.") */}
        <WhatToExpect onOpenRegister={handleOpenRegister} />

        {/* Section 8: Event Programme ("A Day of Ideas, Discovery & Action.") */}
        <Programme onOpenRegister={handleOpenRegister} />

        {/* Section 9: Speakers & Facilitators ("Meet the Minds Behind the Ideas.") */}
        <Speakers onOpenRegister={handleOpenRegister} />

        {/* Section 10: Audience ("Built for Curious Minds and Bold Ideas.") */}
        <Audience />

        {/* Section 11: Venue & Logistics ("Plan Your Experience.") */}
        <VenueDetails onOpenRegister={handleOpenRegister} />

        {/* Section 12: Final CTA ("Your Next Big Idea Could Start Here.") */}
        <FinalCta onOpenRegister={handleOpenRegister} onShare={handleShare} />
      </main>

      {/* Section 13: Footer */}
      <Footer />

      {/* Interactive Modals */}
      <RegisterModal isOpen={isRegisterOpen} onClose={handleCloseRegister} />
      <TeaserModal 
        isOpen={isTeaserOpen} 
        onClose={handleCloseTeaser} 
        onOpenRegister={handleOpenRegister}
      />

      {/* Toast feedback */}
      {toastMessage && (
        <div className="toast-notice" role="status">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
