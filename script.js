/* ==========================================================================
   INNOVATE FORWARD - INTERACTIVE CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCountdown();
  initGlobe();
  initCardTilt();
  initInteractions();
});

/* --------------------------------------------------------------------------
   Theme Switcher (Light / Dark)
   -------------------------------------------------------------------------- */
function initTheme() {
  const toggleBtn = document.getElementById('themeToggle');
  const body = document.body;

  // Check saved preference or default to light
  const savedTheme = localStorage.getItem('if_theme') || 'theme-light';
  body.className = savedTheme;

  toggleBtn.addEventListener('click', () => {
    if (body.classList.contains('theme-light')) {
      body.classList.replace('theme-light', 'theme-dark');
      localStorage.setItem('if_theme', 'theme-dark');
    } else {
      body.classList.replace('theme-dark', 'theme-light');
      localStorage.setItem('if_theme', 'theme-light');
    }
  });
}

/* --------------------------------------------------------------------------
   Interactive Live Countdown with SVG Radial Progress
   -------------------------------------------------------------------------- */
function initCountdown() {
  const daysEl = document.getElementById('daysVal');
  const hoursEl = document.getElementById('hoursVal');
  const minsEl = document.getElementById('minsVal');
  const secsEl = document.getElementById('secsVal');

  const dialDays = document.querySelector('.dial-days');
  const dialHours = document.querySelector('.dial-hours');
  const dialMins = document.querySelector('.dial-mins');
  const dialSecs = document.querySelector('.dial-secs');

  // Set target date (e.g. 5 days from current)
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 5);
  targetDate.setHours(targetDate.getHours() + 22);
  targetDate.setMinutes(targetDate.getMinutes() + 16);
  targetDate.setSeconds(targetDate.getSeconds() + 14);

  const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * 30; // ~188.4px

  function update() {
    const now = new Date();
    const diff = Math.max(0, targetDate - now);

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    daysEl.textContent = String(d).padStart(2, '0');
    hoursEl.textContent = String(h).padStart(2, '0');
    minsEl.textContent = String(m).padStart(2, '0');
    secsEl.textContent = String(s).padStart(2, '0');

    // SVG dash offsets
    if (dialDays) dialDays.style.strokeDashoffset = CIRCLE_CIRCUMFERENCE * (1 - Math.min(1, d / 30));
    if (dialHours) dialHours.style.strokeDashoffset = CIRCLE_CIRCUMFERENCE * (1 - h / 24);
    if (dialMins) dialMins.style.strokeDashoffset = CIRCLE_CIRCUMFERENCE * (1 - m / 60);
    if (dialSecs) dialSecs.style.strokeDashoffset = CIRCLE_CIRCUMFERENCE * (1 - s / 60);
  }

  update();
  setInterval(update, 1000);
}

/* --------------------------------------------------------------------------
   3D Holographic Dot-Matrix Sphere / Globe Simulation on Canvas
   -------------------------------------------------------------------------- */
function initGlobe() {
  const canvas = document.getElementById('globeCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const width = canvas.width;
  const height = canvas.height;
  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.40;

  // Generate 3D point cloud on sphere
  const points = [];
  const numPoints = 420;

  for (let i = 0; i < numPoints; i++) {
    // Fibonacci sphere distribution
    const phi = Math.acos(1 - 2 * (i + 0.5) / numPoints);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;

    points.push({
      x: radius * Math.sin(phi) * Math.cos(theta),
      y: radius * Math.sin(phi) * Math.sin(theta),
      z: radius * Math.cos(phi),
      baseX: radius * Math.sin(phi) * Math.cos(theta),
      baseY: radius * Math.sin(phi) * Math.sin(theta),
      baseZ: radius * Math.cos(phi),
      isHighlight: Math.random() > 0.88,
      pulse: Math.random() * Math.PI
    });
  }

  let rotX = 0.25;
  let rotY = 0;
  let isDragging = false;
  let lastMouseX = 0;
  let lastMouseY = 0;

  // Mouse interaction for rotation
  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMouseX;
    const dy = e.clientY - lastMouseY;
    rotY += dx * 0.006;
    rotX += dy * 0.006;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });

  // Touch controls for mobile
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      lastMouseX = e.touches[0].clientX;
      lastMouseY = e.touches[0].clientY;
    }
  });

  window.addEventListener('touchend', () => { isDragging = false; });
  window.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - lastMouseX;
    const dy = e.touches[0].clientY - lastMouseY;
    rotY += dx * 0.006;
    rotX += dy * 0.006;
    lastMouseX = e.touches[0].clientX;
    lastMouseY = e.touches[0].clientY;
  });

  function render() {
    ctx.clearRect(0, 0, width, height);

    if (!isDragging) {
      rotY += 0.004; // Auto spin
    }

    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);

    const isDark = document.body.classList.contains('theme-dark');
    const primaryDotColor = isDark ? 'rgba(99, 102, 241,' : 'rgba(59, 130, 246,';
    const highlightColor = isDark ? 'rgba(6, 182, 212,' : 'rgba(124, 58, 237,';

    // Projected dots buffer
    const projected = [];

    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      p.pulse += 0.04;

      // Rotation around Y
      let x1 = p.baseX * cosY - p.baseZ * sinY;
      let z1 = p.baseZ * cosY + p.baseX * sinY;

      // Rotation around X
      let y1 = p.baseY * cosX - z1 * sinX;
      let z2 = z1 * cosX + p.baseY * sinX;

      // Perspective projection
      const fov = 420;
      const scale = fov / (fov + z2);
      const px = cx + x1 * scale;
      const py = cy + y1 * scale;
      const alpha = Math.max(0.12, (z2 + radius) / (radius * 2));

      projected.push({
        x: px,
        y: py,
        z: z2,
        scale,
        alpha,
        isHighlight: p.isHighlight,
        pulse: Math.sin(p.pulse)
      });
    }

    // Sort by depth (back to front)
    projected.sort((a, b) => a.z - b.z);

    // Render connecting lines between nearby points
    ctx.lineWidth = 0.6;
    for (let i = 0; i < projected.length; i += 2) {
      const p1 = projected[i];
      if (p1.z < -40) continue; // skip far back

      for (let j = i + 1; j < Math.min(i + 7, projected.length); j++) {
        const p2 = projected[j];
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        if (dist < 42) {
          const lineAlpha = (1 - dist / 42) * p1.alpha * (isDark ? 0.35 : 0.22);
          ctx.strokeStyle = `rgba(99, 102, 241, ${lineAlpha})`;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    // Draw dots
    for (let i = 0; i < projected.length; i++) {
      const p = projected[i];
      const dotRadius = p.isHighlight 
        ? (2.8 + p.pulse * 0.8) * p.scale 
        : 1.8 * p.scale;

      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.8, dotRadius), 0, Math.PI * 2);

      if (p.isHighlight) {
        ctx.fillStyle = `${highlightColor} ${Math.min(1, p.alpha * 1.3)})`;
        ctx.shadowColor = isDark ? '#06b6d4' : '#7c3aed';
        ctx.shadowBlur = 8 * p.scale;
      } else {
        ctx.fillStyle = `${primaryDotColor} ${p.alpha * (isDark ? 0.85 : 0.7)})`;
        ctx.shadowBlur = 0;
      }
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    requestAnimationFrame(render);
  }

  render();
}

/* --------------------------------------------------------------------------
   3D Mouse Tilt Effect on Glassmorphic HUD Cards
   -------------------------------------------------------------------------- */
function initCardTilt() {
  const cards = document.querySelectorAll('[data-tilt]');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* --------------------------------------------------------------------------
   Interactive Buttons & Micro-Interactions
   -------------------------------------------------------------------------- */
function initInteractions() {
  const trailerBtn = document.getElementById('trailerBtn');
  if (trailerBtn) {
    trailerBtn.addEventListener('click', () => {
      showToast('🎬 Innovate Forward 2025 official teaser is loading...');
    });
  }

  // Simple Toast notification helper
  function showToast(msg) {
    let toast = document.querySelector('.toast-banner');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-banner';
      document.body.appendChild(toast);
      
      // Toast inline styling
      Object.assign(toast.style, {
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%) translateY(100px)',
        background: 'var(--text-primary)',
        color: 'var(--text-inverse)',
        padding: '0.75rem 1.5rem',
        borderRadius: '9999px',
        fontSize: '0.88rem',
        fontWeight: '600',
        zIndex: '9999',
        boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: '0'
      });
    }

    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(100px)';
    }, 3200);
  }
}
