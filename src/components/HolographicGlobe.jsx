import React, { useRef, useEffect } from 'react';

export default function HolographicGlobe({ theme = 'theme-light' }) {
  const canvasRef = useRef(null);
  const isDraggingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const rotRef = useRef({ x: 0.25, y: 0 });
  const animationFrameIdRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const radius = width * 0.40;

    // Generate 3D point cloud on sphere using Fibonacci distribution
    const numPoints = 420;
    const points = [];

    for (let i = 0; i < numPoints; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / numPoints);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      points.push({
        baseX: radius * Math.sin(phi) * Math.cos(theta),
        baseY: radius * Math.sin(phi) * Math.sin(theta),
        baseZ: radius * Math.cos(phi),
        isHighlight: Math.random() > 0.88,
        pulse: Math.random() * Math.PI
      });
    }

    // Mouse handlers
    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      lastPosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;
      rotRef.current.y += dx * 0.006;
      rotRef.current.x += dy * 0.006;
      lastPosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    // Touch handlers for mobile
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        lastPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - lastPosRef.current.x;
      const dy = e.touches[0].clientY - lastPosRef.current.y;
      rotRef.current.y += dx * 0.006;
      rotRef.current.x += dy * 0.006;
      lastPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    // Animation Render Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (!isDraggingRef.current) {
        rotRef.current.y += 0.004; // Continuous smooth auto-rotation
      }

      const cosY = Math.cos(rotRef.current.y);
      const sinY = Math.sin(rotRef.current.y);
      const cosX = Math.cos(rotRef.current.x);
      const sinX = Math.sin(rotRef.current.x);

      const isDark = theme === 'theme-dark';
      const primaryDotColor = isDark ? 'rgba(56, 189, 248,' : 'rgba(37, 99, 235,';
      const highlightColor = isDark ? 'rgba(168, 85, 247,' : 'rgba(124, 58, 237,';

      const projected = [];

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        p.pulse += 0.04;

        // Rotation around Y
        const x1 = p.baseX * cosY - p.baseZ * sinY;
        const z1 = p.baseZ * cosY + p.baseX * sinY;

        // Rotation around X
        const y1 = p.baseY * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.baseY * sinX;

        // Perspective 3D projection
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

      // Draw proximity constellation lines between nearby points
      ctx.lineWidth = 0.6;
      for (let i = 0; i < projected.length; i += 2) {
        const p1 = projected[i];
        if (p1.z < -40) continue;

        for (let j = i + 1; j < Math.min(i + 6, projected.length); j++) {
          const p2 = projected[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 42) {
            const lineAlpha = (1 - dist / 42) * p1.alpha * (isDark ? 0.35 : 0.22);
            ctx.strokeStyle = `rgba(37, 99, 235, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw sphere points
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        const dotRadius = p.isHighlight 
          ? (2.8 + p.pulse * 0.8) * p.scale 
          : 1.8 * p.scale;

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.8, dotRadius), 0, Math.PI * 2);

        if (p.isHighlight) {
          ctx.fillStyle = `${highlightColor} ${Math.min(1, p.alpha * 1.3)})`;
          ctx.shadowColor = isDark ? '#00d2ff' : '#7c3aed';
          ctx.shadowBlur = 8 * p.scale;
        } else {
          ctx.fillStyle = `${primaryDotColor} ${p.alpha * (isDark ? 0.85 : 0.7)})`;
          ctx.shadowBlur = 0;
        }
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      animationFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [theme]);

  return (
    <canvas 
      ref={canvasRef} 
      width={460} 
      height={460} 
      className="interactive-globe-canvas"
      title="Click and drag to rotate the 3D Holographic Globe"
      aria-label="Interactive 3D Holographic Point-Cloud Sphere"
    />
  );
}
