import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function Countdown({ targetDate = '2026-09-22T09:00:00' }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isToday: false
  });

  // Calculate circumference for r=30 circle -> 2 * PI * 30 ≈ 188.5
  const CIRCLE_CIRCUMFERENCE = 188.5;

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isToday: true
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isToday: false
      });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.isToday) {
    return (
      <div className="countdown-card">
        <div className="countdown-event-today">
          🎉 The event is happening today! Welcome to Innovate Forward.
        </div>
      </div>
    );
  }

  // Dial progress offsets
  const daysOffset = CIRCLE_CIRCUMFERENCE * (1 - Math.min(1, timeLeft.days / 365));
  const hoursOffset = CIRCLE_CIRCUMFERENCE * (1 - timeLeft.hours / 24);
  const minsOffset = CIRCLE_CIRCUMFERENCE * (1 - timeLeft.minutes / 60);
  const secsOffset = CIRCLE_CIRCUMFERENCE * (1 - timeLeft.seconds / 60);

  return (
    <div className="countdown-card" aria-label="Conference Countdown">
      <div className="countdown-header">
        <div className="countdown-title-wrap">
          <Clock size={18} className="countdown-icon" />
          <span className="countdown-title">Event begins in</span>
        </div>
        <span className="countdown-target-pill">22 Sept 2026</span>
      </div>

      <div className="countdown-dials-grid">
        {/* Days */}
        <div className="dial-block">
          <div className="dial-svg-wrap">
            <svg className="dial-svg" viewBox="0 0 70 70">
              <circle className="dial-bg" cx="35" cy="35" r="30" />
              <circle 
                className="dial-stroke days" 
                cx="35" 
                cy="35" 
                r="30" 
                style={{ strokeDashoffset: daysOffset }}
              />
            </svg>
            <span className="dial-num">{String(timeLeft.days).padStart(2, '0')}</span>
          </div>
          <span className="dial-label">Days</span>
        </div>

        {/* Hours */}
        <div className="dial-block">
          <div className="dial-svg-wrap">
            <svg className="dial-svg" viewBox="0 0 70 70">
              <circle className="dial-bg" cx="35" cy="35" r="30" />
              <circle 
                className="dial-stroke hours" 
                cx="35" 
                cy="35" 
                r="30" 
                style={{ strokeDashoffset: hoursOffset }}
              />
            </svg>
            <span className="dial-num">{String(timeLeft.hours).padStart(2, '0')}</span>
          </div>
          <span className="dial-label">Hours</span>
        </div>

        {/* Minutes */}
        <div className="dial-block">
          <div className="dial-svg-wrap">
            <svg className="dial-svg" viewBox="0 0 70 70">
              <circle className="dial-bg" cx="35" cy="35" r="30" />
              <circle 
                className="dial-stroke mins" 
                cx="35" 
                cy="35" 
                r="30" 
                style={{ strokeDashoffset: minsOffset }}
              />
            </svg>
            <span className="dial-num">{String(timeLeft.minutes).padStart(2, '0')}</span>
          </div>
          <span className="dial-label">Minutes</span>
        </div>

        {/* Seconds */}
        <div className="dial-block">
          <div className="dial-svg-wrap">
            <svg className="dial-svg" viewBox="0 0 70 70">
              <circle className="dial-bg" cx="35" cy="35" r="30" />
              <circle 
                className="dial-stroke secs" 
                cx="35" 
                cy="35" 
                r="30" 
                style={{ strokeDashoffset: secsOffset }}
              />
            </svg>
            <span className="dial-num">{String(timeLeft.seconds).padStart(2, '0')}</span>
          </div>
          <span className="dial-label">Seconds</span>
        </div>
      </div>
    </div>
  );
}
