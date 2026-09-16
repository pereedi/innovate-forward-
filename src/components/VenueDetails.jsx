import React from 'react';
import { Calendar, Clock, ArrowDown } from 'lucide-react';

export default function VenueDetails({ onScrollToRegister }) {
  return (
    <section className="section-padding venue-section" id="venue">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="section-label">Date & Time</div>
          <h2 className="section-title">Symposium Date & Schedule.</h2>
          <p className="section-description">
            Mark your calendar. Join pioneers, engineers, and researchers on 22 September 2026.
          </p>
        </div>

        {/* Confirmed Date & Time Cards Centered */}
        <div className="date-time-cards-wrapper">
          <div className="venue-info-card-group date-time-group">
            <div className="venue-detail-item date-time-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--blue-royal)', marginBottom: '0.5rem' }}>
                <Calendar size={22} />
                <span className="venue-detail-label">CONFIRMED EVENT DATE</span>
              </div>
              <div className="venue-detail-value">22 September 2026</div>
              <div className="venue-detail-sub">Tuesday • Digital Innovation Symposium</div>
            </div>

            <div className="venue-detail-item date-time-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--blue-royal)', marginBottom: '0.5rem' }}>
                <Clock size={22} />
                <span className="venue-detail-label">SYMPOSIUM HOURS</span>
              </div>
              <div className="venue-detail-value">1:00 PM – 4:00 PM GMT+1</div>
              <div className="venue-detail-sub">Keynotes, interactive sessions & live demos</div>
            </div>
          </div>

          <div className="date-time-cta-wrap">
            <button className="btn-secondary" onClick={onScrollToRegister}>
              <span>Proceed to Registration Below</span>
              <ArrowDown size={16} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
