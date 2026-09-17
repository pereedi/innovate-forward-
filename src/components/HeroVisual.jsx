import React, { useRef } from 'react';
import HolographicGlobe from './HolographicGlobe';
import { Mic, Layers, Zap } from 'lucide-react';

export default function HeroVisual({ theme = 'theme-light' }) {
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);

  // 3D Mouse Tilt Parallax Effect
  const handleMouseMove = (e, cardRef) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  };

  const handleMouseLeave = (cardRef) => {
    const card = cardRef.current;
    if (card) card.style.transform = '';
  };

  return (
    <div className="hero-visual-container" aria-label="Innovate Forward Holographic Nexus">
      <div className="abstract-stage">
        
        {/* Concentric Gyroscopic Orbital Rings (Multi-axis rotating radar rings) */}
        <div className="orbit-ring ring-outer"></div>
        <div className="orbit-ring ring-middle">
          <span className="orbit-particle p1"></span>
          <span className="orbit-particle p2"></span>
        </div>
        <div className="orbit-ring ring-inner">
          <span className="orbit-particle p3"></span>
        </div>

        {/* Ambient Radial Flare */}
        <div className="core-radial-flare"></div>

        {/* Central 3D Interactive Point-Cloud Globe Canvas */}
        <HolographicGlobe theme={theme} />

        {/* Floating Glassmorphic HUD Feature Cards with 3D Mouse Tilt */}
        
        {/* Card 1: Keynote Speaker Spotlight (Top Left) */}
        <div 
          ref={card1Ref}
          className="hud-float-card card-keynote" 
          onMouseMove={(e) => handleMouseMove(e, card1Ref)}
          onMouseLeave={() => handleMouseLeave(card1Ref)}
        >
          <div className="float-card-header">
            <span className="card-tag">KEYNOTE TRACK</span>
            <span className="badge-live-stream">FEATURED</span>
          </div>
          <div className="float-speaker-body">
            <div className="speaker-icon-wrap">
              <Mic size={20} />
            </div>
            <div className="speaker-info">
              <div className="speaker-name">Frontier Intelligence</div>
              <div className="speaker-role">Autonomous Systems & AGI</div>
            </div>
          </div>
          <div className="speaker-footer">
            <span className="session-time">🗓️ 22 September 2026</span>
            <span className="card-action-link">Stage A →</span>
          </div>
        </div>

        {/* Card 2: Interactive Tech Corridor & Innovation Hub (Top Right) */}
        <div 
          ref={card2Ref}
          className="hud-float-card card-venue"
          onMouseMove={(e) => handleMouseMove(e, card2Ref)}
          onMouseLeave={() => handleMouseLeave(card2Ref)}
        >
          <div className="venue-header">
            <div className="venue-icon-box">
              <Layers size={18} />
            </div>
            <div>
              <div className="venue-title">Innovation Corridors & Labs</div>
              <div className="venue-sub">Interactive Hub & Stages</div>
            </div>
          </div>
          <div className="venue-stats">
            <div className="v-stat"><span>4</span> Stages</div>
            <div className="v-stat"><span>12</span> Labs</div>
            <div className="v-stat"><span>100+</span> Demos</div>
          </div>
        </div>

        {/* Card 3: Live Pulse & Metrics (Bottom Right) */}
        <div 
          ref={card3Ref}
          className="hud-float-card card-metrics"
          onMouseMove={(e) => handleMouseMove(e, card3Ref)}
          onMouseLeave={() => handleMouseLeave(card3Ref)}
        >
          <div className="metrics-row">
            <div className="metric-item">
              <div className="metric-num">25K+</div>
              <div className="metric-label">Attendees</div>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <div className="metric-num">50+</div>
              <div className="metric-label">Sessions</div>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <div className="metric-num">100%</div>
              <div className="metric-label">Innovation</div>
            </div>
          </div>
          <div className="live-activity-bar">
            <Zap size={13} className="activity-icon-pulse" />
            <span className="activity-text">Priority pre-registration now open</span>
          </div>
        </div>

      </div>
    </div>
  );
}
