import React from 'react';
import { ArrowRight, Share2 } from 'lucide-react';

export default function FinalCta({ onOpenRegister, onShare }) {
  return (
    <section className="final-cta-section">
      <div className="container">
        <div className="final-cta-banner">
          
          {/* Ambient decorative lighting */}
          <div className="cta-ambient-mesh"></div>

          <div className="final-cta-content">
            <span className="final-cta-tagline">JOIN THE EXPERIENCE</span>
            <h2 className="final-cta-heading">Your Next Big Idea Could Start Here.</h2>
            <p className="final-cta-desc">
              Come with your curiosity. Leave with new ideas, valuable connections, and a fresh perspective on technology and innovation.
            </p>

            <div className="final-cta-actions">
              <button className="btn-primary" onClick={onOpenRegister}>
                <span>Register Now</span>
                <ArrowRight size={18} />
              </button>

              <button className="btn btn-share" onClick={onShare}>
                <Share2 size={16} />
                <span>Share the Event</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
