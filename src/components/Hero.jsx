import React from 'react';
import { ArrowRight, Play, Calendar } from 'lucide-react';
import Countdown from './Countdown';
import HeroVisual from './HeroVisual';

export default function Hero({ onOpenRegister, onOpenTeaser, theme }) {
  return (
    <section className="hero-section" id="hero">
      <div className="hero-grid-bg"></div>
      
      <div className="container hero-two-column">
        {/* Left Column: Value Prop, Copy, CTAs, Metadata & Prominent Countdown */}
        <div className="hero-left">
          
          {/* Small Category Label */}
          <div className="hero-badge-pill">
            <span className="pulse-dot-wrap">
              <span className="pulse-dot"></span>
              <span className="pulse-wave"></span>
            </span>
            <span className="badge-text">TECHNOLOGY & DIGITAL INNOVATION SYMPOSIUM</span>
          </div>

          {/* Main Headline */}
          <h1 className="hero-headline">
            Explore the Ideas<br />
            <span className="gradient-text">Shaping Tomorrow.</span>
          </h1>

          {/* Supporting Description */}
          <p className="hero-description">
            Innovate Forward is a Technology & Digital Innovation Symposium bringing together curious minds, bold ideas, and the people building the future.
          </p>

          {/* CTA Buttons: Register Now & Watch Teaser */}
          <div className="hero-cta-cluster">
            <button 
              className="btn-primary" 
              onClick={onOpenRegister}
              aria-label="Register Now for Innovate Forward"
            >
              <span>Register Now</span>
              <ArrowRight size={18} />
            </button>

            <button 
              className="btn-secondary btn-watch-teaser"
              onClick={onOpenTeaser}
              aria-label="Watch Innovate Forward Teaser"
            >
              <span className="play-icon-wrap">
                <Play size={14} fill="currentColor" />
              </span>
              <span>Watch Teaser</span>
              <span className="duration-pill">1:42</span>
            </button>
          </div>

          {/* Event Metadata */}
          <div className="hero-meta-strip">
            <div className="meta-item">
              <Calendar size={16} />
              <span>22 September 2026</span>
            </div>
          </div>

          {/* Prominent Live Countdown Panel */}
          <Countdown targetDate="2026-09-22T13:00:00" />

        </div>

        {/* Right Column: 3D Point-Cloud Globe & Gyroscopic Orbit Rings */}
        <div className="hero-right">
          <HeroVisual theme={theme} />
        </div>

      </div>
    </section>
  );
}
