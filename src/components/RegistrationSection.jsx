import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Sparkles, 
  AlertCircle,
  Users,
  Compass,
  Heart,
  Loader2
} from 'lucide-react';
import { getFullVisitorTelemetry } from '../utils/deviceTelemetry';
import { saveRegistration, logVisitor } from '../lib/supabase';

export default function RegistrationSection() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const sectionRef = useRef(null);
  const hasLoggedView = useRef(false);

  // Track when visitor scrolls to or views the registration section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasLoggedView.current) {
          hasLoggedView.current = true;
          getFullVisitorTelemetry('registration_section').then((telemetry) => {
            logVisitor(telemetry);
          });
        }
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    bringsYou: [],
    otherBringsYou: '',
    interests: [],
    otherInterest: '',
    community: '',
    otherCommunity: '',
    organization: '',
    registeredWithKingsChat: false
  });

  // Validation Error State
  const [errors, setErrors] = useState({});

  // Motivation Options
  const bringsYouOptions = [
    "Networking & meeting industry pioneers",
    "Discovering cutting-edge AI & tech breakthroughs",
    "Exploring career & startup opportunities",
    "Learning from visionary keynotes & tech talks",
    "Other"
  ];

  // Interest Areas
  const interestOptions = [
    "Development",
    "Data Analysis",
    "Artificial Intelligence & AGI",
    "Autonomous Systems & Robotics",
    "Cloud & Distributed Architecture",
    "Product Design & UX Engineering",
    "Digital Economy & Web3",
    "Cybersecurity & Data Privacy",
    "Tech Entrepreneurship & Venture",
    "Other"
  ];

  // Community Options
  const communityOptions = [
    "Design",
    "Developers",
    "AI Thinkers",
    "Founders & Entrepreneurs",
    "Students & Researchers",
    "Business & Industry Leaders",
    "Tech Enthusiasts",
    "Other"
  ];

  // Clear specific error on field change
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  // Toggle Motivation Chip (Multi-select)
  const toggleBringsYou = (option) => {
    const exists = formData.bringsYou.includes(option);
    const updated = exists
      ? formData.bringsYou.filter((item) => item !== option)
      : [...formData.bringsYou, option];

    handleChange('bringsYou', updated);
  };

  // Toggle Interest Pill
  const toggleInterest = (topic) => {
    const exists = formData.interests.includes(topic);
    const updated = exists
      ? formData.interests.filter((item) => item !== topic)
      : [...formData.interests, topic];
    
    handleChange('interests', updated);
  };

  // KingsChat Login / Registration Handler
  // Left empty until the official KingsChat Login API / OAuth flow is connected
  const handleKingsChatAuth = () => {
    // Awaiting KingsChat Login API implementation
  };

  // Validate Step 1
  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.firstName.trim() || formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name is required (min 2 characters)";
    }

    if (!formData.lastName.trim() || formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name is required (min 2 characters)";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation (digits, spaces, plus, dashes, min 7 digits)
    const phoneDigits = formData.phone.replace(/[^0-9]/g, '');
    if (!formData.phone.trim() || phoneDigits.length < 7) {
      newErrors.phone = "Please enter a valid phone number (min 7 digits)";
    }

    if (!formData.location.trim() || formData.location.trim().length < 2) {
      newErrors.location = "Location is required (e.g. City, Country)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate Step 2
  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.bringsYou || formData.bringsYou.length === 0) {
      newErrors.bringsYou = "Please select what brings you to Innovate Forward conference";
    } else if (formData.bringsYou.includes("Other") && (!formData.otherBringsYou.trim() || formData.otherBringsYou.trim().length < 3)) {
      newErrors.otherBringsYou = "Please specify your reason (min 3 characters)";
    }

    if (!formData.interests || formData.interests.length === 0) {
      newErrors.interests = "Please select at least one area of interest";
    } else if (formData.interests.includes("Other") && (!formData.otherInterest.trim() || formData.otherInterest.trim().length < 2)) {
      newErrors.otherInterest = "Please specify your interest (min 2 characters)";
    }

    if (!formData.community) {
      newErrors.community = "Please select your primary community";
    } else if (formData.community === "Other" && (!formData.otherCommunity.trim() || formData.otherCommunity.trim().length < 2)) {
      newErrors.otherCommunity = "Please specify your community / background (min 2 characters)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Proceed from Step 1 to Step 2
  const handleNext = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setCurrentStep(2);
      // Smooth scroll to top of registration card
      document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Back from Step 2 to Step 1
  const handleBack = () => {
    setCurrentStep(1);
    setErrors({});
  };

  // Final Submission to Supabase with Telemetry
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsSubmitting(true);
    setSubmissionError('');

    try {
      // Gather device telemetry (IP address, OS, Browser, Screen)
      const telemetry = await getFullVisitorTelemetry('registration_form');
      
      // Format community if custom
      const formattedCommunity = formData.community === 'Other' && formData.otherCommunity
        ? `Other (${formData.otherCommunity})`
        : formData.community;

      const submissionPayload = {
        ...formData,
        community: formattedCommunity
      };

      // Save record to Supabase (or fallback store)
      const result = await saveRegistration(submissionPayload, telemetry);

      if (result.error) {
        setSubmissionError('Unable to complete registration. Please check your connection and try again.');
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setSubmitted(true);
      // Smooth scroll to confirmation view
      document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error('Registration error:', err);
      setSubmissionError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Reset and register another
  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      bringsYou: [],
      otherBringsYou: '',
      interests: [],
      otherInterest: '',
      community: '',
      otherCommunity: '',
      organization: '',
      registeredWithKingsChat: false
    });
    setErrors({});
    setSubmissionError('');
    setCurrentStep(1);
    setSubmitted(false);
  };

  return (
    <section ref={sectionRef} className="section-padding registration-section" id="register">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="section-label">Symposium Registration</div>
          <h2 className="section-title">Reserve Your Seat for Tomorrow.</h2>
          <p className="section-description">
            Join visionary engineers, researchers, founders, and creators on 22 September 2026. Complete your priority symposium registration below.
          </p>
        </div>

        {/* Multi-Step Card Container */}
        <div className="registration-card-wrapper">
          
          {!submitted ? (
            <div className="registration-card">
              
              {/* Progress Indicator */}
              <div className="reg-stepper-header">
                <div className={`step-badge ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
                  <span className="step-num">{currentStep > 1 ? '✓' : '1'}</span>
                  <span className="step-title">Personal & Contact</span>
                </div>
                <div className="stepper-track-line">
                  <div className="stepper-track-fill" style={{ width: currentStep === 2 ? '100%' : '0%' }}></div>
                </div>
                <div className={`step-badge ${currentStep === 2 ? 'active' : ''}`}>
                  <span className="step-num">2</span>
                  <span className="step-title">Preferences & Community</span>
                </div>
              </div>

              {/* ============================================================
                  SECTION 1: PERSONAL & CONTACT INFORMATION
                  ============================================================ */}
              {currentStep === 1 && (
                <div className="reg-step-view step-1-view">
                  
                  {/* KingsChat Complete Registration Button */}
                  <div className="kingschat-banner-wrap">
                    <button 
                      type="button" 
                      className="kingschat-btn"
                      onClick={handleKingsChatAuth}
                      title="Quick Registration with KingsChat"
                    >
                      <img 
                        src="/kingschat.png" 
                        alt="KingsChat Logo" 
                        className="kc-logo-img" 
                      />
                      <span>Complete Registration with KingsChat</span>
                    </button>
                    {formData.registeredWithKingsChat && (
                      <div className="kc-verified-pill">
                        <CheckCircle2 size={14} />
                        <span>KingsChat Details Verified</span>
                      </div>
                    )}
                  </div>

                  <div className="reg-divider">
                    <span>or fill your details manually</span>
                  </div>

                  <form onSubmit={handleNext} noValidate>
                    
                    {/* Row 1: First Name and Last Name Side by Side */}
                    <div className="form-two-col-grid">
                      <div className="form-group">
                        <label htmlFor="reg-firstName">
                          <User size={15} />
                          <span>First Name *</span>
                        </label>
                        <input 
                          id="reg-firstName"
                          type="text"
                          required
                          placeholder="e.g. Alex"
                          className={errors.firstName ? 'input-error' : ''}
                          value={formData.firstName}
                          onChange={(e) => handleChange('firstName', e.target.value)}
                        />
                        {errors.firstName && (
                          <div className="error-message">
                            <AlertCircle size={13} />
                            <span>{errors.firstName}</span>
                          </div>
                        )}
                      </div>

                      <div className="form-group">
                        <label htmlFor="reg-lastName">
                          <User size={15} />
                          <span>Last Name *</span>
                        </label>
                        <input 
                          id="reg-lastName"
                          type="text"
                          required
                          placeholder="e.g. Morgan"
                          className={errors.lastName ? 'input-error' : ''}
                          value={formData.lastName}
                          onChange={(e) => handleChange('lastName', e.target.value)}
                        />
                        {errors.lastName && (
                          <div className="error-message">
                            <AlertCircle size={13} />
                            <span>{errors.lastName}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Row 2: Email and Phone Number Side by Side */}
                    <div className="form-two-col-grid">
                      <div className="form-group">
                        <label htmlFor="reg-email">
                          <Mail size={15} />
                          <span>Email Address *</span>
                        </label>
                        <input 
                          id="reg-email"
                          type="email"
                          required
                          placeholder="alex@example.com"
                          className={errors.email ? 'input-error' : ''}
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                        />
                        {errors.email && (
                          <div className="error-message">
                            <AlertCircle size={13} />
                            <span>{errors.email}</span>
                          </div>
                        )}
                      </div>

                      <div className="form-group">
                        <label htmlFor="reg-phone">
                          <Phone size={15} />
                          <span>Phone Number *</span>
                        </label>
                        <input 
                          id="reg-phone"
                          type="tel"
                          required
                          placeholder="+1 (555) 000-0000"
                          className={errors.phone ? 'input-error' : ''}
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                        />
                        {errors.phone && (
                          <div className="error-message">
                            <AlertCircle size={13} />
                            <span>{errors.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Row 3: Location Underneath */}
                    <div className="form-group">
                      <label htmlFor="reg-location">
                        <MapPin size={15} />
                        <span>Location (City, Country) *</span>
                      </label>
                      <input 
                        id="reg-location"
                        type="text"
                        required
                        placeholder="e.g. San Francisco, United States"
                        className={errors.location ? 'input-error' : ''}
                        value={formData.location}
                        onChange={(e) => handleChange('location', e.target.value)}
                      />
                      {errors.location && (
                        <div className="error-message">
                          <AlertCircle size={13} />
                          <span>{errors.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Step 1 Actions */}
                    <div className="form-actions-row">
                      <button type="submit" className="btn-primary btn-step-next">
                        <span>Continue to Step 2</span>
                        <ArrowRight size={17} />
                      </button>
                    </div>

                  </form>

                </div>
              )}

              {/* ============================================================
                  SECTION 2: PREFERENCES, INTERESTS & COMMUNITY
                  ============================================================ */}
              {currentStep === 2 && (
                <div className="reg-step-view step-2-view">
                  
                  {/* Step Back Action */}
                  <div className="step-back-row">
                    <button type="button" className="btn-step-back" onClick={handleBack}>
                      <ArrowLeft size={16} />
                      <span>Back to Contact Info</span>
                    </button>
                    <span className="step-count-pill">Step 2 of 2</span>
                  </div>

                  <form onSubmit={handleSubmit} noValidate>

                    {/* Question 1: What brings you to Innovate Forward conference? (Multi-select) */}
                    <div className="form-group question-group">
                      <label className="question-label">
                        <Compass size={16} />
                        <span>What brings you to Innovate Forward conference? (Select all that apply) *</span>
                      </label>
                      <div className="chips-container">
                        {bringsYouOptions.map((opt, idx) => {
                          const isSelected = formData.bringsYou.includes(opt);
                          return (
                            <button
                              key={idx}
                              type="button"
                              className={`chip-choice-btn ${isSelected ? 'selected' : ''}`}
                              onClick={() => toggleBringsYou(opt)}
                            >
                              <span className="pill-check">{isSelected ? '✓' : '+'}</span>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Custom text field if 'Other' is selected */}
                      {formData.bringsYou.includes("Other") && (
                        <div className="other-input-wrap">
                          <input 
                            type="text"
                            required
                            placeholder="Please tell us what brings you to Innovate Forward..."
                            className={errors.otherBringsYou ? 'input-error' : ''}
                            value={formData.otherBringsYou}
                            onChange={(e) => handleChange('otherBringsYou', e.target.value)}
                          />
                          {errors.otherBringsYou && (
                            <div className="error-message">
                              <AlertCircle size={13} />
                              <span>{errors.otherBringsYou}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {errors.bringsYou && (
                        <div className="error-message">
                          <AlertCircle size={13} />
                          <span>{errors.bringsYou}</span>
                        </div>
                      )}
                    </div>

                    {/* Question 2: What's your interest? */}
                    <div className="form-group question-group">
                      <label className="question-label">
                        <Heart size={16} />
                        <span>What's your interest? (Select all that apply) *</span>
                      </label>
                      <div className="interest-pills-grid">
                        {interestOptions.map((topic, idx) => {
                          const isSelected = formData.interests.includes(topic);
                          return (
                            <button
                              key={idx}
                              type="button"
                              className={`interest-pill-btn ${isSelected ? 'selected' : ''}`}
                              onClick={() => toggleInterest(topic)}
                            >
                              <span className="pill-check">{isSelected ? '✓' : '+'}</span>
                              <span>{topic}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Custom text field if 'Other' is selected */}
                      {formData.interests.includes("Other") && (
                        <div className="other-input-wrap">
                          <input 
                            type="text"
                            required
                            placeholder="Please tell us your other area of interest..."
                            className={errors.otherInterest ? 'input-error' : ''}
                            value={formData.otherInterest}
                            onChange={(e) => handleChange('otherInterest', e.target.value)}
                          />
                          {errors.otherInterest && (
                            <div className="error-message">
                              <AlertCircle size={13} />
                              <span>{errors.otherInterest}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {errors.interests && (
                        <div className="error-message">
                          <AlertCircle size={13} />
                          <span>{errors.interests}</span>
                        </div>
                      )}
                    </div>

                    {/* Question 3: Select your community & Organization */}
                    <div className="form-two-col-grid">
                      
                      {/* Community Dropdown */}
                      <div className="form-group">
                        <label htmlFor="reg-community">
                          <Users size={15} />
                          <span>Select your community *</span>
                        </label>
                        <select
                          id="reg-community"
                          required
                          className={errors.community ? 'input-error' : ''}
                          value={formData.community}
                          onChange={(e) => handleChange('community', e.target.value)}
                        >
                          <option value="">-- Choose your community --</option>
                          {communityOptions.map((comm, idx) => (
                            <option key={idx} value={comm}>{comm}</option>
                          ))}
                        </select>
                        {errors.community && (
                          <div className="error-message">
                            <AlertCircle size={13} />
                            <span>{errors.community}</span>
                          </div>
                        )}

                        {/* Custom community input if 'Other' is chosen */}
                        {formData.community === "Other" && (
                          <div className="other-input-wrap">
                            <input 
                              type="text"
                              required
                              placeholder="Please specify your community / background..."
                              className={errors.otherCommunity ? 'input-error' : ''}
                              value={formData.otherCommunity}
                              onChange={(e) => handleChange('otherCommunity', e.target.value)}
                            />
                            {errors.otherCommunity && (
                              <div className="error-message">
                                <AlertCircle size={13} />
                                <span>{errors.otherCommunity}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Organization (Optional) */}
                      <div className="form-group">
                        <label htmlFor="reg-org-sec">
                          <Building2 size={15} />
                          <span>Organization / Company (Optional)</span>
                        </label>
                        <input 
                          id="reg-org-sec"
                          type="text"
                          placeholder="e.g. OpenAI / Stanford / Freelance"
                          value={formData.organization}
                          onChange={(e) => handleChange('organization', e.target.value)}
                        />
                      </div>

                    </div>

                    {/* Submission Error Feedback */}
                    {submissionError && (
                      <div className="error-banner" role="alert" style={{ marginBottom: '1.25rem' }}>
                        <AlertCircle size={18} />
                        <span>{submissionError}</span>
                      </div>
                    )}

                    {/* Step 2 Actions & Submission */}
                    <div className="form-actions-row">
                      <button 
                        type="submit" 
                        className="btn-primary btn-submit-final"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>Securing Your Seat...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles size={17} />
                            <span>Complete Registration</span>
                            <ArrowRight size={17} />
                          </>
                        )}
                      </button>
                    </div>

                    <div className="modal-privacy-note" style={{ marginTop: '1rem' }}>
                      🔒 Guaranteed priority access for <strong>22 September 2026</strong>. No spam policy.
                    </div>

                  </form>

                </div>
              )}

            </div>
          ) : (
            
            /* ============================================================
               NOTIFICATION OF SUCCESS IN SUBMISSION
               ============================================================ */
            <div className="registration-success-card" role="alert" aria-live="polite">
              <div className="success-badge-icon">
                <CheckCircle2 size={48} />
              </div>
              
              <div className="section-label" style={{ marginBottom: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: '#059669', borderColor: 'rgba(16, 185, 129, 0.25)' }}>
                REGISTRATION CONFIRMED
              </div>

              <h3 className="success-headline">You're Confirmed for Innovate Forward 2026!</h3>
              
              <p className="success-body-copy">
                Congratulations, <strong>{formData.firstName} {formData.lastName}</strong>! Your seat has been successfully reserved for the <strong>Technology & Digital Innovation Symposium</strong> on <strong>22 September 2026</strong>.
              </p>

              {/* Confirmation Details Summary Box */}
              <div className="success-summary-box">
                <div className="summary-line">
                  <span className="summary-key">Registered Email:</span>
                  <span className="summary-val">{formData.email}</span>
                </div>
                <div className="summary-line">
                  <span className="summary-key">Phone:</span>
                  <span className="summary-val">{formData.phone}</span>
                </div>
                <div className="summary-line">
                  <span className="summary-key">Location:</span>
                  <span className="summary-val">{formData.location}</span>
                </div>
                <div className="summary-line">
                  <span className="summary-key">Community:</span>
                  <span className="summary-val">
                    {formData.community === 'Other' && formData.otherCommunity 
                      ? `Other (${formData.otherCommunity})` 
                      : formData.community}
                  </span>
                </div>
                {formData.bringsYou && formData.bringsYou.length > 0 && (
                  <div className="summary-line">
                    <span className="summary-key">Motivation:</span>
                    <span className="summary-val">
                      {formData.bringsYou
                        .map((b) => (b === 'Other' && formData.otherBringsYou ? `Other (${formData.otherBringsYou})` : b))
                        .join(', ')}
                    </span>
                  </div>
                )}
                {formData.interests && formData.interests.length > 0 && (
                  <div className="summary-line">
                    <span className="summary-key">Interests:</span>
                    <span className="summary-val">
                      {formData.interests
                        .map((item) => (item === 'Other' && formData.otherInterest ? `Other (${formData.otherInterest})` : item))
                        .join(', ')}
                    </span>
                  </div>
                )}
                {formData.organization && (
                  <div className="summary-line">
                    <span className="summary-key">Organization:</span>
                    <span className="summary-val">{formData.organization}</span>
                  </div>
                )}
                {formData.registeredWithKingsChat && (
                  <div className="summary-line kingschat-sync-line">
                    <span className="summary-key">KingsChat Pass:</span>
                    <span className="summary-val kc-synced">
                      <img src="/kingschat.png" alt="KingsChat" className="summary-kc-icon" />
                      Synced & Verified
                    </span>
                  </div>
                )}
              </div>

              <div className="success-actions">
                <button type="button" className="btn-secondary" onClick={handleReset}>
                  <span>Register Another Attendee</span>
                </button>
                <a href="#hero" className="btn-primary">
                  <span>Return to Top ↑</span>
                </a>
              </div>
            </div>

          )}

        </div>

      </div>
    </section>
  );
}
