import React from 'react';
import { Calendar, Clock, Navigation, ArrowDown } from 'lucide-react';

export default function VenueDetails({ onScrollToRegister }) {
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

        {/* Two Column Grid: Confirmed Date/Time Logistics + Travel Guide */}
        <div className="venue-details-grid">
          
          {/* Key Event Details Cards */}
          <div className="venue-info-card-group venue-confirmed-group">
            <div className="venue-detail-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--blue-royal)', marginBottom: '0.4rem' }}>
                <Calendar size={20} />
                <span className="venue-detail-label">EVENT DATE</span>
              </div>
              <div className="venue-detail-value">22 September 2026</div>
              <div className="venue-detail-sub">Tuesday • Full Day Symposium</div>
            </div>

            <div className="venue-detail-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--blue-royal)', marginBottom: '0.4rem' }}>
                <Clock size={20} />
                <span className="venue-detail-label">SYMPOSIUM TIME</span>
              </div>
              <div className="venue-detail-value">9:00 AM – 6:00 PM</div>
              <div className="venue-detail-sub">Morning check-in & welcome breakfast</div>
            </div>
          </div>

          {/* Interactive Travel & Directions Notice */}
          <div className="venue-map-placeholder">
            <div className="map-pin-circle">
              <Navigation size={28} />
            </div>
            <h4>Travel & Venue Guidelines</h4>
            <p>
              Detailed venue directions, parking access, transit routes, and virtual symposium access details will be sent directly to your registered email address.
            </p>
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
