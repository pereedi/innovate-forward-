import React from 'react';
import { Calendar, Clock, MapPin, Building, Ticket, Navigation } from 'lucide-react';

export default function VenueDetails({ onOpenRegister }) {
  return (
    <section className="section-padding venue-section" id="venue">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="section-label">Location & Logistics</div>
          <h2 className="section-title">Plan Your Experience.</h2>
          <p className="section-description">
            Everything you need to know about joining Innovate Forward on 22 September 2026.
          </p>
        </div>

        {/* Two Column Grid: Info Cards + Map Placeholder */}
        <div className="venue-details-grid">
          
          {/* Key Event Details Cards */}
          <div className="venue-info-card-group">
            <div className="venue-detail-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--blue-royal)', marginBottom: '0.4rem' }}>
                <Calendar size={18} />
                <span className="venue-detail-label">DATE</span>
              </div>
              <div className="venue-detail-value">22 September 2026</div>
              <div className="venue-detail-sub">Tuesday • Full Day Symposium</div>
            </div>

            <div className="venue-detail-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--blue-royal)', marginBottom: '0.4rem' }}>
                <Clock size={18} />
                <span className="venue-detail-label">TIME</span>
              </div>
              <div className="venue-detail-value">To be announced</div>
              <div className="venue-detail-sub">Morning check-in schedule coming soon</div>
            </div>

            <div className="venue-detail-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--blue-royal)', marginBottom: '0.4rem' }}>
                <Building size={18} />
                <span className="venue-detail-label">VENUE</span>
              </div>
              <div className="venue-detail-value">To be announced</div>
              <div className="venue-detail-sub">Premier tech symposium center</div>
            </div>

            <div className="venue-detail-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--blue-royal)', marginBottom: '0.4rem' }}>
                <MapPin size={18} />
                <span className="venue-detail-label">LOCATION</span>
              </div>
              <div className="venue-detail-value">To be announced</div>
              <div className="venue-detail-sub">Accessible central tech corridor</div>
            </div>

            <div className="venue-detail-item full-width">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--blue-royal)', marginBottom: '0.4rem' }}>
                <Ticket size={18} />
                <span className="venue-detail-label">ATTENDANCE & PASSES</span>
              </div>
              <div className="venue-detail-value">Registration details coming soon</div>
              <div className="venue-detail-sub">Early notification passes are currently open for pre-registration</div>
            </div>
          </div>

          {/* Interactive Venue / Map Card Placeholder */}
          <div className="venue-map-placeholder">
            <div className="map-pin-circle">
              <Navigation size={28} />
            </div>
            <h4>Venue Map & Travel Guide</h4>
            <p>
              Detailed directions, parking information, public transit routes, and virtual access links will be published once the host venue is finalized.
            </p>
            <button className="btn-secondary" onClick={onOpenRegister}>
              <MapPin size={16} />
              <span>Notify Me When Venue Confirmed</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
