/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';

interface ConfettiProps {
  active: boolean;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  shape: 'circle' | 'square' | 'ribbon';
  opacity: number;
  gravity: number;
  wobble: number;
  wobbleSpeed: number;
}

const COLORS = [
  '#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#C77DFF',
  '#FF9A3C', '#00C9A7', '#FF6EC7', '#FFEB3B', '#00E676'
];

export function Confetti({ active }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Create active particles instantly
    if (active) {
      const pCount = 150;
      const temps: Particle[] = [];
      
      // We burst from the center of screen outwards
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 3; // Position slightly higher to cover area

      for (let i = 0; i < pCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 12;
        temps.push({
          x: centerX,
          y: centerY,
          size: 6 + Math.random() * 8,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          speedX: Math.cos(angle) * speed,
          speedY: Math.sin(angle) * speed - (3 + Math.random() * 5), // Shoot slightly upward
          rotation: Math.random() * 360,
          rotationSpeed: -10 + Math.random() * 20,
          shape: i % 3 === 0 ? 'circle' : i % 3 === 1 ? 'square' : 'ribbon',
          opacity: 1,
          gravity: 0.15 + Math.random() * 0.15,
          wobble: Math.random() * 10,
          wobbleSpeed: 0.05 + Math.random() * 0.1,
        });
      }
      particlesRef.current = temps;

      // Animation Loop
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = false;

        particlesRef.current.forEach((p) => {
          if (p.opacity <= 0) return;
          alive = true;

          // Update physics
          p.x += p.speedX;
          p.y += p.speedY;
          p.speedY += p.gravity;
          p.speedX *= 0.98; // Drag
          p.rotation += p.rotationSpeed;
          p.wobble += p.wobbleSpeed;
          
          // Fluttering effect
          const currentWidth = p.size * Math.sin(p.wobble);
          
          // Fade out as they fall off or get old
          if (p.y > canvas.height - 40) {
            p.opacity -= 0.015;
          } else {
            p.opacity -= 0.003;
          }

          if (p.opacity > 0) {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = p.color;

            if (p.shape === 'circle') {
              ctx.beginPath();
              ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
              ctx.fill();
            } else if (p.shape === 'square') {
              ctx.fillRect(-p.size / 2, -p.size / 2, currentWidth, p.size);
            } else {
              // Ribbon / Long rectangle
              ctx.fillRect(-p.size / 4, -p.size, currentWidth / 2, p.size * 1.5);
            }
            ctx.restore();
          }
        });

        if (alive) {
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      };

      animate();
    } else {
      // Clear canvas if inactive
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current = [];
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      id="confetti-canvas"
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[100]"
    />
  );
}
