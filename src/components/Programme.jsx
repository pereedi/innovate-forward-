import React from 'react';
import { Clock, AlertCircle, ArrowRight } from 'lucide-react';

export default function Programme({ onOpenRegister }) {
  const sessions = [
    {
      title: "Registration & Welcome",
      time: "Time to be announced",
      desc: "Check-in, badge collection, morning coffee, and introductory welcome."
    },
    {
      title: "Opening Session",
      time: "Time to be announced",
      desc: "Setting the symposium vision: navigating the next decade of technological breakthroughs."
    },
    {
      title: "Keynote / Technology Talk",
      time: "Time to be announced",
      desc: "An inspiring address on autonomous intelligence, societal impact, and frontier innovation."
    },
    {
      title: "Panel Discussion",
      time: "Time to be announced",
      desc: "Cross-industry debate on ethics, digital transformation, and scaling emerging technology."
    },
    {
      title: "Innovation Showcase",
      time: "Time to be announced",
      desc: "Live project demonstrations and interactive displays solving real-world challenges."
    },
    {
      title: "Interactive Workshops",
      time: "Time to be announced",
      desc: "Hands-on collaborative working sessions led by forward-thinking practitioners."
    },
    {
      title: "Networking Session",
      time: "Time to be announced",
      desc: "Structured connections, community discussions, and creative exchange."
    },
    {
      title: "Closing Session",
      time: "Time to be announced",
      desc: "Key symposium takeaways, future initiatives, and closing remarks."
    }
  ];

  return (
    <section className="section-padding programme-section" id="programme">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="section-label">Symposium Flow</div>
          <h2 className="section-title">A Day of Ideas, Discovery & Action.</h2>
          <p className="section-description">
            Explore the sessions and experiences planned for Innovate Forward.
          </p>
        </div>

        {/* Notice Banner */}
        <div className="programme-notice-banner">
          <AlertCircle size={18} />
          <span>Note: Schedule is subject to confirmation. Exact timings and speaker lineups will be announced soon.</span>
        </div>

        {/* Timeline Items */}
        <div className="programme-timeline">
          {sessions.map((session, idx) => (
            <div className="timeline-item" key={idx}>
              <div className="timeline-time-badge">
                <Clock size={16} />
                <span>{session.time}</span>
              </div>
              <div className="timeline-content">
                <h4>{session.title}</h4>
                <p>{session.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Secondary CTA */}
        <div className="programme-cta-wrap">
          <button className="btn-secondary" onClick={onOpenRegister}>
            <span>View Full Programme Updates</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </section>
  );
}
