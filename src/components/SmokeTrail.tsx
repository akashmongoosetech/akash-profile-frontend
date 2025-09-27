import React, { useEffect, useRef } from 'react';

const NUM_PARTICLES = 30;
const TRAIL_LENGTH = 30;
const HEAD_COLOR = 'rgba(255,255,200,1)'; // bright yellowish white
const TAIL_COLORS = [
  'rgba(255,59,48,0.5)',   // Red
  'rgba(255,149,0,0.4)',  // Orange
  'rgba(255,235,59,0.3)', // Yellow
  'rgba(52,199,89,0.25)', // Green
  'rgba(0,122,255,0.2)',  // Blue
  'rgba(88,86,214,0.15)', // Indigo
  'rgba(175,82,222,0.1)', // Violet
];

const SmokeTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trail = useRef<{ x: number; y: number }[]>([]);
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Touch support for mobile/small screens
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        console.log('touchmove', e.touches[0].clientX, e.touches[0].clientY);
        mouse.current.x = e.touches[0].clientX;
        mouse.current.y = e.touches[0].clientY;
      }
    };
    document.addEventListener('touchmove', handleTouchMove);

    // Initialize trail
    trail.current = Array(TRAIL_LENGTH).fill({ x: mouse.current.x, y: mouse.current.y });

    function drawComet() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Update trail
      const last = trail.current[trail.current.length - 1];
      const dx = mouse.current.x - last.x;
      const dy = mouse.current.y - last.y;
      const newPoint = {
        x: last.x + dx * 0.25,
        y: last.y + dy * 0.25,
      };
      trail.current.push(newPoint);
      if (trail.current.length > TRAIL_LENGTH) trail.current.shift();

      // Draw comet tail (from oldest to newest)
      for (let i = 0; i < trail.current.length; i++) {
        const t = i / (trail.current.length - 1);
        const size = 18 * (1 - t) + 6;
        const blur = 32 * t + 4;
        // Fade from rainbow tail to white/yellow head
        let color;
        if (i < trail.current.length - 3) {
          color = TAIL_COLORS[i % TAIL_COLORS.length];
        } else {
          // Head: blend to white/yellow
          color = HEAD_COLOR;
        }
        ctx.save();
        ctx.beginPath();
        ctx.arc(trail.current[i].x, trail.current[i].y, size, 0, Math.PI * 2);
        ctx.shadowColor = color;
        ctx.shadowBlur = blur;
        ctx.globalAlpha = 0.7 * (1 - t) + 0.1;
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
      }

      // Draw small bright head circle
      const head = trail.current[trail.current.length - 1];
      ctx.save();
      ctx.beginPath();
      ctx.arc(head.x, head.y, 12, 0, Math.PI * 2);
      ctx.shadowColor = 'rgba(255,255,220,0.8)';
      ctx.shadowBlur = 18;
      ctx.globalAlpha = 1;
      ctx.fillStyle = HEAD_COLOR;
      ctx.fill();
      ctx.restore();

      // Draw small circle outline around cursor
      ctx.save();
      ctx.beginPath();
      ctx.arc(mouse.current.x, mouse.current.y, 16, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.7)';
      ctx.lineWidth = 2;
      ctx.shadowColor = 'rgba(255,255,255,0.3)';
      ctx.shadowBlur = 6;
      ctx.stroke();
      ctx.restore();

      animationId = requestAnimationFrame(drawComet);
    }
    drawComet();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-20"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
};

export default SmokeTrail; 