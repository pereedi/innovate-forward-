import React from 'react';
import { Mic, Sparkles, Layers, Users, ArrowRight } from 'lucide-react';

export default function WhatToExpect({ onOpenRegister }) {
  const experiences = [
    {
      keyword: "EXPLORE",
      title: "Keynote Sessions",
      icon: <Mic size={24} />,
      desc: "Hear ideas, insights, and perspectives from people shaping the technology and innovation landscape.",
      tag: "Inspiring Vision"
    },
    {
      keyword: "EXPERIENCE",
      title: "Innovation Showcase",
      icon: <Sparkles size={24} />,
      desc: "Discover projects, technologies, and emerging solutions designed to solve real-world problems.",
      tag: "Live Breakthroughs"
    },
    {
      keyword: "IMAGINE",
      title: "Interactive Experiences",
      icon: <Layers size={24} />,
      desc: "Experience technology through demonstrations, practical activities, and engaging sessions.",
      tag: "Hands-on Discovery"
    },
    {
      keyword: "BUILD",
      title: "Networking & Community",
      icon: <Users size={24} />,
      desc: "Connect with innovators, professionals, creators, and like-minded people.",
      tag: "Meaningful Ties"
    }
  ];

  return (
    <section className="section-padding what-to-expect-section" id="experience">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="section-label">Symposium Pillars</div>
          <h2 className="section-title">Explore. Experience. Imagine. Build.</h2>
          <p className="section-description">
            Discover conversations, experiences, and opportunities designed to inspire new ideas and connect people shaping the future.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="expect-grid">
          {experiences.map((item, idx) => (
            <div className="expect-card" key={idx}>
              <div>
                <div className="expect-top">
                  <div className="expect-icon-wrapper">
                    {item.icon}
                  </div>
                  <div>
                    <span className="expect-card-keyword">{item.keyword}</span>
                    <h3 className="expect-card-title">{item.title}</h3>
                  </div>
                </div>
                <p className="expect-card-desc">{item.desc}</p>
              </div>

              <div className="expect-card-footer">
                <span>{item.tag}</span>
                <button 
                  className="card-link-btn" 
                  onClick={onOpenRegister}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--blue-royal)', fontWeight: 700 }}
                >
                  <span>Learn more</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
