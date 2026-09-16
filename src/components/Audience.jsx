import React from 'react';
import { 
  GraduationCap, 
  Code2, 
  Rocket, 
  Palette, 
  Briefcase, 
  Building2, 
  Compass 
} from 'lucide-react';

export default function Audience() {
  const audiences = [
    { title: "Students & Learners", icon: <GraduationCap size={22} /> },
    { title: "Developers & Engineers", icon: <Code2 size={22} /> },
    { title: "Entrepreneurs & Founders", icon: <Rocket size={22} /> },
    { title: "Creatives & Innovators", icon: <Palette size={22} /> },
    { title: "Technology Professionals", icon: <Briefcase size={22} /> },
    { title: "Business & Industry Leaders", icon: <Building2 size={22} /> },
    { title: "Technology Enthusiasts", icon: <Compass size={22} /> }
  ];

  return (
    <section className="section-padding audience-section" id="audience">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="section-label">Who Should Attend</div>
          <h2 className="section-title">Built for Curious Minds and Bold Ideas.</h2>
          <p className="section-description">
            Whether you are learning, building, leading, or exploring what is next, Innovate Forward offers a space to connect with new possibilities.
          </p>
        </div>

        {/* Audience Grid */}
        <div className="audience-grid">
          {audiences.map((aud, idx) => (
            <div className="audience-card" key={idx}>
              <div className="audience-icon-box">
                {aud.icon}
              </div>
              <h3 className="audience-title">{aud.title}</h3>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
