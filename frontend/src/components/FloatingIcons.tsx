import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Code, Zap, Clock, Brain, Sparkles, Lightbulb, Cpu, Database, Globe } from 'lucide-react';

const icons = [
  { Icon: Code, color: 'text-blue-500' },
  { Icon: Zap, color: 'text-yellow-500' },
  { Icon: Clock, color: 'text-green-500' },
  { Icon: Brain, color: 'text-purple-500' },
  { Icon: Sparkles, color: 'text-pink-500' },
  { Icon: Lightbulb, color: 'text-amber-500' },
  { Icon: Cpu, color: 'text-cyan-500' },
  { Icon: Database, color: 'text-indigo-500' },
  { Icon: Globe, color: 'text-teal-500' },
];

const FloatingIcons: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const icons = container.querySelectorAll('.floating-icon');
      
      icons.forEach((icon, index) => {
        const depth = 1 + (index % 3) * 0.5;
        const moveX = (clientX - window.innerWidth / 2) / depth;
        const moveY = (clientY - window.innerHeight / 2) / depth;
        
        // Apply the movement with a transform
        (icon as HTMLElement).style.transform = `translate(${moveX * 0.05}px, ${moveY * 0.05}px)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden">
      {icons.map((IconItem, index) => {
        // Calculate random positions
        const top = `${Math.random() * 90}%`;
        const left = `${Math.random() * 90}%`;
        const size = 20 + Math.random() * 30;
        const duration = 15 + Math.random() * 20;
        const delay = Math.random() * 5;
        
        return (
          <motion.div
            key={index}
            className={`absolute floating-icon opacity-10 ${IconItem.color}`}
            style={{ top, left }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut',
              delay,
            }}
          >
            <IconItem.Icon size={size} />
          </motion.div>
        );
      })}
    </div>
  );
};

export default FloatingIcons;
