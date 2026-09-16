import React from 'react';
import { Mic, Sparkles, Layers, Users } from 'lucide-react';

export default function WhatToExpect({ onOpenRegister }) {
  const experiences = [
    {
      keyword: "EXPLORE",
      title: "Keynote Sessions",
      icon: <Mic size={24} />,
      desc: "Hear ideas, insights, and perspectives from people shaping the technology and innovation landscape."
    },
    {
      keyword: "EXPERIENCE",
      title: "Innovation Showcase",
      icon: <Sparkles size={24} />,
      desc: "Discover projects, technologies, and emerging solutions designed to solve real-world problems."
    },
    {
      keyword: "IMAGINE",
      title: "Interactive Experiences",
      icon: <Layers size={24} />,
      desc: "Experience technology through demonstrations, practical activities, and engaging sessions."
    },
    {
      keyword: "BUILD",
      title: "Networking & Community",
      icon: <Users size={24} />,
      desc: "Connect with innovators, professionals, creators, and like-minded people."
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
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
