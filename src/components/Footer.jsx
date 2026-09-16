import React from 'react';
import { Mail, Globe, Share2 } from 'lucide-react';

export default function Footer({ onOpenAnalytics }) {
  return (
    <footer className="site-footer">
      <div className="container">
        
        <div className="footer-top-grid">
          {/* Brand & Mission */}
          <div className="footer-brand">
            <a href="#hero" aria-label="Innovate Forward Home">
              <img 
                src="/logo.png" 
                alt="Innovate Forward" 
                className="footer-logo-img"
              />
            </a>
            <p className="footer-desc">
              Innovate Forward is a Technology & Digital Innovation Symposium uniting curious minds and bold ideas to shape what comes next.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-nav-list">
              <li><a href="#about">About Symposium</a></li>
              <li><a href="#experience">The Experience</a></li>
              <li><a href="#venue">Location & Logistics</a></li>
              <li><a href="#register">Registration</a></li>
            </ul>
          </div>

          {/* Contact & Community */}
          <div>
            <h4 className="footer-col-title">Connect</h4>
            <div className="footer-contact-info">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color="var(--blue-royal)" />
                <span>contact@innovateforward.org</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Globe size={16} color="var(--blue-royal)" />
                <span>22 September 2026</span>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
                <a href="#twitter" aria-label="X / Twitter" style={{ color: 'var(--navy-subtle)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="#linkedin" aria-label="LinkedIn" style={{ color: 'var(--navy-subtle)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                </a>
                <a href="#github" aria-label="GitHub" style={{ color: 'var(--navy-subtle)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="footer-bottom-bar">
          <div>
            © 2026 Innovate Forward. All rights reserved. Technology & Digital Innovation Symposium.
          </div>
          <div className="footer-legal-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#conduct">Code of Conduct</a>
            <button 
              type="button" 
              className="footer-admin-link" 
              onClick={onOpenAnalytics}
              title="Protected Organizer Analytics & Attendee Telemetry"
            >
              🔒 Organizer Analytics
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
