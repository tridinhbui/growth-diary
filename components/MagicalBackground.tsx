'use client';

import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

interface GeometricShape {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  type: 'triangle' | 'square' | 'circle' | 'hexagon';
  color: string;
}

interface MagicalBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
  theme?: 'aurora' | 'cosmic' | 'forest' | 'ocean' | 'sunset';
  interactive?: boolean;
  className?: string;
}

const colors = {
  aurora: ['#FF3CAC', '#784BA0', '#2B86AB', '#00D2FF', '#B06AB3'],
  cosmic: ['#667eea', '#764ba2', '#ff6b6b', '#4ecdc4', '#45b7d1'],
  forest: ['#11998e', '#38ef7d', '#56ab2f', '#a8e6cf', '#7fdbff'],
  ocean: ['#667db6', '#0082c8', '#0093E6', '#8EC5FC', '#E0C3FC'],
  sunset: ['#ff9a9e', '#fecfef', '#fecfef', '#fff9ca', '#f093fb']
};

export default function MagicalBackground({ 
  intensity = 'medium', 
  theme = 'aurora',
  interactive = true,
  className = ''
}: MagicalBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const shapesRef = useRef<GeometricShape[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const themeColors = colors[theme];
  const particleCount = intensity === 'low' ? 30 : intensity === 'medium' ? 60 : 100;
  const shapeCount = intensity === 'low' ? 8 : intensity === 'medium' ? 15 : 25;

  // Initialize particles
  const createParticle = (canvas: HTMLCanvasElement): Particle => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    size: Math.random() * 3 + 1,
    opacity: Math.random() * 0.8 + 0.2,
    color: themeColors[Math.floor(Math.random() * themeColors.length)],
    life: 0,
    maxLife: Math.random() * 1000 + 500
  });

  // Initialize geometric shapes
  const createShape = (canvas: HTMLCanvasElement): GeometricShape => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 50 + 20,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.02,
    opacity: Math.random() * 0.1 + 0.05,
    type: ['triangle', 'square', 'circle', 'hexagon'][Math.floor(Math.random() * 4)] as any,
    color: themeColors[Math.floor(Math.random() * themeColors.length)]
  });

  // Draw geometric shapes
  const drawShape = (ctx: CanvasRenderingContext2D, shape: GeometricShape) => {
    ctx.save();
    ctx.translate(shape.x, shape.y);
    ctx.rotate(shape.rotation);
    ctx.globalAlpha = shape.opacity;
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = 2;

    const size = shape.size;
    
    switch (shape.type) {
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(0, -size / 2);
        ctx.lineTo(-size / 2, size / 2);
        ctx.lineTo(size / 2, size / 2);
        ctx.closePath();
        ctx.stroke();
        break;
      
      case 'square':
        ctx.strokeRect(-size / 2, -size / 2, size, size);
        break;
      
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        ctx.stroke();
        break;
      
      case 'hexagon':
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const x = Math.cos(angle) * size / 2;
          const y = Math.sin(angle) * size / 2;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
        break;
    }
    
    ctx.restore();
  };

  // Draw aurora effect
  const drawAurora = (ctx: CanvasRenderingContext2D, time: number) => {
    const { width, height } = ctx.canvas;
    
    // Create multiple aurora layers
    for (let layer = 0; layer < 3; layer++) {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      const layerOpacity = 0.1 - layer * 0.02;
      
      gradient.addColorStop(0, `${themeColors[layer % themeColors.length]}${Math.floor(layerOpacity * 255).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(0.5, `${themeColors[(layer + 1) % themeColors.length]}${Math.floor(layerOpacity * 127).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(1, `${themeColors[(layer + 2) % themeColors.length]}${Math.floor(layerOpacity * 255).toString(16).padStart(2, '0')}`);
      
      ctx.save();
      ctx.fillStyle = gradient;
      
      // Create wavy aurora pattern
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      
      for (let x = 0; x <= width; x += 10) {
        const y = height / 2 + Math.sin(x * 0.01 + time * 0.001 + layer) * 100 * Math.sin(time * 0.0005 + layer);
        ctx.lineTo(x, y);
      }
      
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  };

  // Update particles
  const updateParticles = (canvas: HTMLCanvasElement) => {
    particlesRef.current = particlesRef.current.map(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life += 1;

      // Wrap around edges
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;

      // Pulse opacity
      particle.opacity = 0.5 + 0.3 * Math.sin(particle.life * 0.01);

      // Interactive effect
      if (interactive && mouseRef.current.active) {
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const force = (100 - distance) / 100;
          particle.vx += dx * force * 0.001;
          particle.vy += dy * force * 0.001;
        }
      }

      // Reset if particle is too old
      if (particle.life > particle.maxLife) {
        return createParticle(canvas);
      }

      return particle;
    });
  };

  // Update geometric shapes
  const updateShapes = (canvas: HTMLCanvasElement) => {
    shapesRef.current = shapesRef.current.map(shape => {
      shape.rotation += shape.rotationSpeed;
      
      // Gentle floating movement
      shape.x += Math.sin(Date.now() * 0.001) * 0.1;
      shape.y += Math.cos(Date.now() * 0.0008) * 0.1;
      
      // Wrap around edges
      if (shape.x < -shape.size) shape.x = canvas.width + shape.size;
      if (shape.x > canvas.width + shape.size) shape.x = -shape.size;
      if (shape.y < -shape.size) shape.y = canvas.height + shape.size;
      if (shape.y > canvas.height + shape.size) shape.y = -shape.size;
      
      return shape;
    });
  };

  // Main animation loop
  const animate = (time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw aurora background
    drawAurora(ctx, time);

    // Update and draw geometric shapes
    updateShapes(canvas);
    shapesRef.current.forEach(shape => drawShape(ctx, shape));

    // Update and draw particles
    updateParticles(canvas);
    particlesRef.current.forEach(particle => {
      ctx.save();
      ctx.globalAlpha = particle.opacity;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Add glow effect
      ctx.shadowBlur = 20;
      ctx.shadowColor = particle.color;
      ctx.fill();
      ctx.restore();
    });

    // Draw connections between nearby particles
    if (intensity !== 'low') {
      ctx.save();
      ctx.globalAlpha = 0.1;
      particlesRef.current.forEach((particle, i) => {
        particlesRef.current.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.strokeStyle = particle.color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });
      ctx.restore();
    }

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // Handle mouse interaction
  const handleMouseMove = (e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || !interactive) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
    mouseRef.current.active = true;
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
  };

  // Handle resize
  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
    
    setCanvasSize({ width: rect.width, height: rect.height });
    
    // Reinitialize particles and shapes
    particlesRef.current = Array.from({ length: particleCount }, () => createParticle(canvas));
    shapesRef.current = Array.from({ length: shapeCount }, () => createShape(canvas));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initial setup
    handleResize();
    
    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);

    // Event listeners
    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', handleMouseLeave);
    }
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (interactive) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [intensity, theme, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{
        width: '100%',
        height: '100%',
        zIndex: -1
      }}
    />
  );
} 