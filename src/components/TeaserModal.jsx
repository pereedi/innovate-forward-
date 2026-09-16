import React, { useState } from 'react';
import { X, Play, Pause, Volume2, Sparkles, ArrowRight } from 'lucide-react';

export default function TeaserModal({ isOpen, onClose, onOpenRegister }) {
  const [isPlaying, setIsPlaying] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="teaser-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close teaser">
          <X size={20} />
        </button>

        {/* Video Player Header */}
        <div className="teaser-video-frame">
          <div className="teaser-video-poster">
            <div className="teaser-ambient-glow"></div>
            
            {/* Simulation overlay */}
            <div className="teaser-screen-content">
              <div className="teaser-brand-badge">
                <Sparkles size={14} />
                <span>INNOVATE FORWARD 2026 OFFICIAL TEASER</span>
              </div>
              <h2 className="teaser-screen-title">Where Ideas Move Forward</h2>
              <p className="teaser-screen-sub">22 September 2026 • Technology & Digital Innovation Symposium</p>

              {/* Soundwave animation */}
              <div className="teaser-soundwave">
                <span className={`wave-bar ${isPlaying ? 'active' : ''}`}></span>
                <span className={`wave-bar ${isPlaying ? 'active' : ''}`}></span>
                <span className={`wave-bar ${isPlaying ? 'active' : ''}`}></span>
                <span className={`wave-bar ${isPlaying ? 'active' : ''}`}></span>
                <span className={`wave-bar ${isPlaying ? 'active' : ''}`}></span>
                <span className={`wave-bar ${isPlaying ? 'active' : ''}`}></span>
                <span className={`wave-bar ${isPlaying ? 'active' : ''}`}></span>
              </div>
            </div>

            {/* Video Controls Bar */}
            <div className="teaser-player-controls">
              <button 
                className="teaser-play-btn"
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? "Pause Teaser" : "Play Teaser"}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>

              <div className="teaser-progress-track">
                <div className="teaser-progress-fill" style={{ width: isPlaying ? '65%' : '30%' }}></div>
              </div>

              <div className="teaser-timestamp">
                <span>0:48 / 1:42</span>
              </div>

              <Volume2 size={18} className="teaser-vol-icon" />
            </div>
          </div>
        </div>

        {/* Teaser Information & Next Steps */}
        <div className="teaser-details">
          <div>
            <h3>What to Expect in 2026</h3>
            <p>
              Preview our immersive experience bringing together 2,500+ attendees, global keynotes, interactive technology showcases, and breakthrough innovations.
            </p>
          </div>

          <button 
            className="btn-primary"
            onClick={() => { onClose(); onOpenRegister(); }}
          >
            <span>Register Now</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
