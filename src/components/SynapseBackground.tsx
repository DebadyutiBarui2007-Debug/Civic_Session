import React, { useEffect, useRef } from 'react';
import { ThemeMode } from '../types';

interface SynapseBackgroundProps {
  theme: ThemeMode;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulsePhase: number;
  pulseSpeed: number;
  baseAlpha: number;
}

interface PulseSignal {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  progress: number;
  speed: number;
}

export const SynapseBackground: React.FC<SynapseBackgroundProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isRunning = true;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = width < 768;
    const particleCount = isMobile ? 22 : 46;
    const connectionDistance = isMobile ? 120 : 160;

    // Get current colors based on theme
    const getThemeColors = () => {
      const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isDark) {
        return {
          nodeColor: 'rgba(52, 211, 153, 0.75)',
          nodeGlow: 'rgba(52, 211, 153, 0.35)',
          lineColor: 'rgba(52, 211, 153, ',
          pulseColor: 'rgba(245, 158, 11, 0.9)',
        };
      }
      if (theme === 'midnight-aurora') {
        return {
          nodeColor: 'rgba(6, 182, 212, 0.8)',
          nodeGlow: 'rgba(6, 182, 212, 0.4)',
          lineColor: 'rgba(6, 182, 212, ',
          pulseColor: 'rgba(245, 158, 11, 0.95)',
        };
      }
      if (theme === 'warm-oasis') {
        return {
          nodeColor: 'rgba(180, 83, 9, 0.65)',
          nodeGlow: 'rgba(180, 83, 9, 0.25)',
          lineColor: 'rgba(180, 83, 9, ',
          pulseColor: 'rgba(45, 106, 79, 0.85)',
        };
      }
      // Light / Nordic Biophilic
      return {
        nodeColor: 'rgba(45, 102, 78, 0.65)',
        nodeGlow: 'rgba(45, 102, 78, 0.22)',
        lineColor: 'rgba(45, 102, 78, ',
        pulseColor: 'rgba(194, 110, 26, 0.85)',
      };
    };

    let colors = getThemeColors();

    // Create particles
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2 + 1.5,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.015 + Math.random() * 0.02,
        baseAlpha: 0.35 + Math.random() * 0.45,
      });
    }

    // Synaptic pulses moving along lines
    const pulses: PulseSignal[] = [];

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: null, y: null };
    };

    const handleVisibilityChange = () => {
      isRunning = !document.hidden;
      if (isRunning) {
        lastTime = performance.now();
        loop();
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    let lastTime = performance.now();

    const loop = () => {
      if (!isRunning) return;

      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      // Randomly create a synaptic pulse between nearby particles
      if (pulses.length < 8 && Math.random() < 0.06) {
        const p1 = particles[Math.floor(Math.random() * particles.length)];
        // Find a nearby particle
        let nearest: Particle | null = null;
        let minDist = connectionDistance;
        for (const p2 of particles) {
          if (p1 === p2) continue;
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.hypot(dx, dy);
          if (dist < minDist) {
            minDist = dist;
            nearest = p2;
          }
        }
        if (nearest) {
          pulses.push({
            fromX: p1.x,
            fromY: p1.y,
            toX: nearest.x,
            toY: nearest.y,
            progress: 0,
            speed: 0.02 + Math.random() * 0.025,
          });
        }
      }

      // Update and draw particles
      const mouse = mouseRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx * 60 * dt;
        p.y += p.vy * 60 * dt;

        // Wrap around bounds with gentle margin
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Subtle mouse repulsion/attraction with golden-ratio damping
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 180 && dist > 1) {
            const force = (180 - dist) / 180 * 0.008;
            p.vx += dx * force;
            p.vy += dy * force;
          }
        }

        // Speed dampening
        p.vx *= 0.992;
        p.vy *= 0.992;

        p.pulsePhase += p.pulseSpeed;
        const currentAlpha = p.baseAlpha + Math.sin(p.pulsePhase) * 0.2;

        // Draw particle halo
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.6, 0, Math.PI * 2);
        ctx.fillStyle = colors.nodeGlow;
        ctx.fill();

        // Draw particle center
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = colors.nodeColor;
        ctx.globalAlpha = Math.max(0.2, Math.min(1, currentAlpha));
        ctx.fill();
        ctx.globalAlpha = 1;

        // Draw connecting axons (lines)
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.24;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `${colors.lineColor}${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw active synaptic pulses
      for (let k = pulses.length - 1; k >= 0; k--) {
        const pulse = pulses[k];
        pulse.progress += pulse.speed;

        if (pulse.progress >= 1) {
          pulses.splice(k, 1);
          continue;
        }

        const currX = pulse.fromX + (pulse.toX - pulse.fromX) * pulse.progress;
        const currY = pulse.fromY + (pulse.toY - pulse.fromY) * pulse.progress;

        ctx.beginPath();
        ctx.arc(currX, currY, 2.8, 0, Math.PI * 2);
        ctx.fillStyle = colors.pulseColor;
        ctx.shadowColor = colors.pulseColor;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
      {/* 1. Synaptic Neural Constellation HTML5 Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* 2. Floating Ambient Synapse Badges (Moving with Golden Ratio Rhythm, zero reading obstruction) */}
      <div 
        className="absolute top-28 left-8 hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-mono tracking-wider backdrop-blur-md opacity-60 animate-float-node-1"
        style={{
          backgroundColor: 'var(--bg-surface-subtle)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-secondary)',
        }}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
        <span>SYNAPSE NODE 01 • INTAKE NOMINAL</span>
      </div>

      <div 
        className="absolute bottom-36 left-12 hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-mono tracking-wider backdrop-blur-md opacity-60 animate-float-node-2"
        style={{
          backgroundColor: 'var(--bg-surface-subtle)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-secondary)',
        }}
      >
        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
        <span>INTERCEPTOR DAG • ZERO DROPOUT [ACTIVE]</span>
      </div>

      <div 
        className="absolute top-44 right-10 hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-mono tracking-wider backdrop-blur-md opacity-60 animate-float-node-3"
        style={{
          backgroundColor: 'var(--bg-surface-subtle)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-secondary)',
        }}
      >
        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
        <span>PYDANTIC PARITY • 99.4% VERIFIED</span>
      </div>
    </div>
  );
};
