import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Intro from './components/Intro';
import WhatToExpect from './components/WhatToExpect';
import Audience from './components/Audience';
import VenueDetails from './components/VenueDetails';
import RegistrationSection from './components/RegistrationSection';
import FinalCta from './components/FinalCta';
import Footer from './components/Footer';
import TeaserModal from './components/TeaserModal';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { getFullVisitorTelemetry } from './utils/deviceTelemetry';
import { logVisitor } from './lib/supabase';
import './styles/App.css';

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('if_theme') || 'theme-light';
  });
  const [isTeaserOpen, setIsTeaserOpen] = useState(false);
  const [isAnalyticsPage, setIsAnalyticsPage] = useState(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return (
      path === '/organizeranalytics' || 
      path === '/organizeranalytics/' ||
      hash === '#organizeranalytics' ||
      hash === '#analytics' ||
      hash === '#dashboard'
    );
  });
  const [toastMessage, setToastMessage] = useState('');

  // Log visitor telemetry on initial page landing
  useEffect(() => {
    const hasLoggedVisit = sessionStorage.getItem('if_visited_logged');
    if (!hasLoggedVisit) {
      sessionStorage.setItem('if_visited_logged', 'true');
      getFullVisitorTelemetry('landing_page').then((telemetry) => {
        logVisitor(telemetry);
      });
    }

    // Check if user navigated to /organizeranalytics or hash route
    const checkAnalyticsRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const isAnalytics = (
        path === '/organizeranalytics' || 
        path === '/organizeranalytics/' ||
        hash === '#organizeranalytics' ||
        hash === '#analytics' ||
        hash === '#dashboard'
      );
      setIsAnalyticsPage(isAnalytics);
    };

    checkAnalyticsRoute();
    window.addEventListener('popstate', checkAnalyticsRoute);
    window.addEventListener('hashchange', checkAnalyticsRoute);
    return () => {
      window.removeEventListener('popstate', checkAnalyticsRoute);
      window.removeEventListener('hashchange', checkAnalyticsRoute);
    };
  }, []);

  const handleNavigateHome = () => {
    setIsAnalyticsPage(false);
    history.pushState(null, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('if_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'theme-light' ? 'theme-dark' : 'theme-light'));
  };

  const handleOpenRegister = () => {
    const regSection = document.getElementById('register');
    if (regSection) {
      regSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

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

  // If navigated to /organizeranalytics, render as a dedicated standalone full page
  if (isAnalyticsPage) {
    return (
      <div className={`app-root ${theme}`}>
        <AnalyticsDashboard 
          isPageMode={true}
          onNavigateHome={handleNavigateHome}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      </div>
    );
  }

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

        {/* Section 8: Audience ("Built for Curious Minds and Bold Ideas.") */}
        <Audience />

        {/* Section 9: Date & Time ("Plan Your Experience.") */}
        <VenueDetails onScrollToRegister={handleOpenRegister} />

        {/* Section 10: Call to Action ("JOIN THE EXPERIENCE > Your Next Big Idea Could Start Here.") */}
        <FinalCta onOpenRegister={handleOpenRegister} onShare={handleShare} />

        {/* Section 11: Embedded 2-Step Registration with KingsChat */}
        <RegistrationSection />
      </main>

      {/* Section 12: Footer */}
      <Footer />

      {/* Video Teaser Modal */}
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
