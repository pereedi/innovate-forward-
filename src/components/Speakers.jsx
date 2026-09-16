import React from 'react';
import { UserCheck, Sparkles, Bell, ArrowRight } from 'lucide-react';

export default function Speakers({ onOpenRegister }) {
  const tracks = [
    {
      title: "Keynote Speaker 01",
      track: "Frontier AI & Autonomous Systems",
      status: "Speaker to be announced",
      desc: "Leading researchers and architects advancing foundation models and machine intelligence."
    },
    {
      title: "Keynote Speaker 02",
      track: "Digital Transformation & Strategy",
      status: "Speaker to be announced",
      desc: "Visionary executives steering large-scale organizational and technological shifts."
    },
    {
      title: "Keynote Speaker 03",
      track: "Emerging Tech & Creative Future",
      status: "Speaker to be announced",
      desc: "Pioneering creators exploring the intersection of design, spatial computing, and human experience."
    }
  ];

  return (
    <section className="section-padding speakers-section" id="speakers">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="section-label">Symposium Voices</div>
          <h2 className="section-title">Meet the Minds Behind the Ideas.</h2>
          <p className="section-description">
            Connect with the people bringing fresh perspectives, knowledge, and experience to the conversation.
          </p>
        </div>

        {/* Polished "Speakers to be announced" cards */}
        <div className="speakers-grid">
          {tracks.map((track, idx) => (
            <div className="speaker-card-placeholder" key={idx}>
              <div className="speaker-avatar-circle">
                <UserCheck size={36} />
              </div>
              <span className="speaker-card-track">{track.track}</span>
              <h3 className="speaker-card-name">{track.status}</h3>
              <p className="speaker-card-desc">{track.desc}</p>
            </div>
          ))}
        </div>

        {/* Call for Speakers / Announcement Notification Box */}
        <div className="speakers-cta-box">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--blue-royal)', fontWeight: 800, marginBottom: '0.75rem' }}>
            <Sparkles size={18} />
            <span>LINEUP REVEAL COMING SOON</span>
          </div>
          <h3>Interested in speaking or nominating a visionary?</h3>
          <p>
            Speaker and facilitator submissions are currently being reviewed by the advisory committee. Register for notifications to receive the complete roster first.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={onOpenRegister}>
              <Bell size={16} />
              <span>Get Speaker Lineup Alerts</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
