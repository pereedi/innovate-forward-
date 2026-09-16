import React, { useState } from 'react';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';

export default function RegisterModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'Developers & Engineers',
    organization: ''
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      email: '',
      category: 'Developers & Engineers',
      organization: ''
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
          <X size={20} />
        </button>

        {!submitted ? (
          <>
            <div className="modal-header">
              <div className="section-label" style={{ marginBottom: '0.5rem' }}>PRIORITY REGISTRATION</div>
              <h3>Join Innovate Forward 2026</h3>
              <p>Reserve early access to registration tickets, speaker announcements, and venue details.</p>
            </div>

            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="reg-name">Full Name *</label>
                <input 
                  id="reg-name" 
                  type="text" 
                  required 
                  placeholder="e.g. Alex Morgan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-email">Work or Personal Email *</label>
                <input 
                  id="reg-email" 
                  type="email" 
                  required 
                  placeholder="alex@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-category">Audience Category</label>
                <select 
                  id="reg-category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Developers & Engineers">Developers & Engineers</option>
                  <option value="Entrepreneurs & Founders">Entrepreneurs & Founders</option>
                  <option value="Technology Professionals">Technology Professionals</option>
                  <option value="Business & Industry Leaders">Business & Industry Leaders</option>
                  <option value="Creatives & Innovators">Creatives & Innovators</option>
                  <option value="Students & Learners">Students & Learners</option>
                  <option value="Technology Enthusiasts">Technology Enthusiasts</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="reg-org">Organization / Company (Optional)</label>
                <input 
                  id="reg-org" 
                  type="text" 
                  placeholder="e.g. Acme Innovations"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-primary modal-submit-btn">
                <span>Confirm Pre-Registration</span>
                <ArrowRight size={16} />
              </button>
            </form>
          </>
        ) : (
          <div className="modal-success-state">
            <div className="modal-success-icon">
              <CheckCircle2 size={36} />
            </div>
            <h3>You're on the list!</h3>
            <p style={{ marginTop: '0.5rem', marginBottom: '1.5rem', color: 'var(--navy-muted)' }}>
              Thank you, <strong>{formData.name}</strong>. We have saved your spot for early registration alerts and updates for <strong>22 September 2026</strong>.
            </p>
            <button className="btn-primary" onClick={handleReset}>
              <span>Close Window</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
