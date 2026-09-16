import React from 'react';
import { Lightbulb, RefreshCw, Cpu, Users2 } from 'lucide-react';

export default function Intro() {
  const pillars = [
    {
      icon: <Lightbulb size={26} />,
      title: "Innovation",
      desc: "Challenging boundaries to unlock ground-breaking methodologies and visionary thinking."
    },
    {
      icon: <RefreshCw size={26} />,
      title: "Digital Transformation",
      desc: "Accelerating the evolution of modern workflows, enterprise agility, and connected systems."
    },
    {
      icon: <Cpu size={26} />,
      title: "Technology",
      desc: "Harnessing the frontier of artificial intelligence, distributed computing, and emerging tech."
    },
    {
      icon: <Users2 size={26} />,
      title: "Collaboration",
      desc: "Uniting thinkers, founders, and engineers to build transformative solutions together."
    }
  ];

  return (
    <section className="section-padding intro-section" id="about">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="section-label">Symposium Overview</div>
          <h2 className="section-title">Where Ideas Move Forward.</h2>
          <p className="section-description">
            Innovate Forward is a space to explore emerging possibilities, experience new ideas, imagine what comes next, and build meaningful connections around technology and digital innovation.
          </p>
        </div>

        {/* 4 Highlight Items */}
        <div className="intro-pillars-grid">
          {pillars.map((pillar, idx) => (
            <div className="pillar-card" key={idx}>
              <div className="pillar-icon-box">
                {pillar.icon}
              </div>
              <h3 className="pillar-title">{pillar.title}</h3>
              <p className="pillar-desc">{pillar.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
