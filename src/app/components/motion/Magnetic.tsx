import { useRef, type ReactNode, type PointerEvent as ReactPointerEvent } from 'react';
import { motion, useReducedMotion, useSpring } from 'motion/react';

interface MagneticProps {
  children: ReactNode;
  className?: string;
  /** How strongly the element follows the pointer (0–1). */
  strength?: number;
}

/**
 * Gently pulls its child toward the pointer over a sprung animation.
 * Disabled entirely when the user prefers reduced motion.
 */
export function Magnetic({ children, className = '', strength = 0.25 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const x = useSpring(0, { stiffness: 160, damping: 14, mass: 0.2 });
  const y = useSpring(0, { stiffness: 160, damping: 14, mass: 0.2 });

  const handleMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      style={{ x, y }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {children}
    </motion.div>
  );
}