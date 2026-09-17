import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ArrowRight, 
  RotateCcw,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { TEASER_VIDEO_URL } from '../config/constants';

export default function TeaserModal({ isOpen, onClose, onOpenRegister }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const videoRef = useRef(null);
  const progressTrackRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  // Auto-play when opened, pause and reset when closed
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setHasError(false);
      
      // Small timeout to allow modal animation to mount DOM before playing
      const timer = setTimeout(() => {
        if (videoRef.current) {
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
                setIsLoading(false);
              })
              .catch((err) => {
                console.log('Autoplay requires user interaction:', err);
                // If browser blocks unmuted autoplay, mute and try again, or pause
                setIsPlaying(false);
                setIsLoading(false);
              });
          }
        }
      }, 250);

      return () => clearTimeout(timer);
    } else {
      // Pause and clean up on close
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Play / Pause Toggle
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Mute / Unmute Toggle
  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  // Progress Track Seeking
  const handleSeek = (e) => {
    if (!videoRef.current || !progressTrackRef.current || !duration) return;
    const rect = progressTrackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const seekPercentage = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = seekPercentage * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Format seconds to mm:ss
  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Retry playback if an error occurred
  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        setIsLoading(false);
      }).catch(() => {
        setIsLoading(false);
      });
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="teaser-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close teaser">
          <X size={20} />
        </button>

        {/* Video Player Container */}
        <div 
          className="teaser-video-frame"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => isPlaying && setShowControls(false)}
        >
          {/* HTML5 Video Streaming directly from Cloudinary / Configured Host */}
          <video
            ref={videoRef}
            className="teaser-video-element"
            src={TEASER_VIDEO_URL}
            playsInline
            preload="metadata"
            crossOrigin="anonymous"
            onTimeUpdate={() => {
              if (videoRef.current) {
                setCurrentTime(videoRef.current.currentTime);
              }
            }}
            onLoadedMetadata={() => {
              if (videoRef.current) {
                setDuration(videoRef.current.duration);
                setIsLoading(false);
              }
            }}
            onWaiting={() => setIsLoading(true)}
            onPlaying={() => {
              setIsLoading(false);
              setIsPlaying(true);
            }}
            onPause={() => setIsPlaying(false)}
            onEnded={() => {
              setIsPlaying(false);
              if (videoRef.current) videoRef.current.currentTime = 0;
            }}
            onError={(e) => {
              console.error('Video playback error:', e);
              setIsLoading(false);
              setHasError(true);
            }}
            onClick={togglePlay}
          />

          {/* Buffering Indicator */}
          {isLoading && !hasError && (
            <div className="teaser-loading-overlay">
              <Loader2 size={32} className="spin-loader" />
              <span>Streaming Teaser...</span>
            </div>
          )}

          {/* Error Message & Retry */}
          {hasError && (
            <div className="teaser-error-overlay">
              <AlertCircle size={28} />
              <h4>Unable to load video stream</h4>
              <p>Please check your connection or video host server.</p>
              <button className="btn-secondary btn-retry" onClick={handleRetry}>
                <RotateCcw size={15} />
                <span>Retry Playback</span>
              </button>
            </div>
          )}

          {/* Center Play Button Overlay when Paused */}
          {!isPlaying && !isLoading && !hasError && (
            <div className="teaser-big-play-overlay" onClick={togglePlay}>
              <div className="teaser-big-play-btn" title="Play Teaser">
                <Play size={28} fill="currentColor" />
              </div>
            </div>
          )}

          {/* Video Controls Bar */}
          <div className={`teaser-player-controls ${showControls ? 'visible' : 'hidden'}`}>
            <button 
              className="teaser-play-btn"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause Teaser" : "Play Teaser"}
            >
              {isPlaying ? <Pause size={17} /> : <Play size={17} fill="currentColor" />}
            </button>

            {/* Clickable Progress Scrub Track */}
            <div 
              className="teaser-progress-track"
              ref={progressTrackRef}
              onClick={handleSeek}
              title="Seek"
            >
              <div 
                className="teaser-progress-fill" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            {/* Dynamic Time Display */}
            <div className="teaser-timestamp">
              <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
            </div>

            {/* Volume / Mute Button */}
            <button 
              className="teaser-vol-btn"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>
        </div>

        {/* Teaser Information & Next Steps */}
        <div className="teaser-details">
          <div>
            <div className="teaser-brand-badge">
              <Sparkles size={13} />
              <span>INNOVATE FORWARD 2026 OFFICIAL TEASER</span>
            </div>
            <h3>Where Ideas Move Forward</h3>
            <p>
              Preview our immersive experience bringing together 25k+ attendees, global keynotes, interactive technology showcases, and breakthrough innovations on 22 September 2026.
            </p>
          </div>

          <button 
            className="btn-primary"
            onClick={() => { onClose(); onOpenRegister(); }}
          >
            <span>Register Now</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}

