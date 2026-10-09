import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import { DURATION, EASE, REDUCED, VIEWPORT } from '../../../lib/motion';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Vertical offset before reveal. */
  y?: number;
  /** Horizontal offset before reveal. */
  x?: number;
}

/**
 * Reveals its children once when they scroll into view.
 * Falls back to a fade only when the user prefers reduced motion.
 */
export function Reveal({ children, className, delay = 0, y = 24, x = 0 }: RevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={VIEWPORT}
      transition={{
        duration: reduce ? REDUCED : DURATION.reveal,
        ease: EASE,
        delay: reduce ? 0 : delay,
      }}
    >
      {children}
    </motion.div>
  );
}
