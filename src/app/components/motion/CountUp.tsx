import { animate, useInView, useMotionValue, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { EASE } from '../../../lib/motion';

interface CountUpProps {
  /** Final value to count to. */
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  /** Locale used for number formatting. Defaults to fr-TN. */
  locale?: string;
}

/**
 * Counts up to `to` when scrolled into view.
 * Only use for REAL numbers — never for invented stats.
 * Respects prefers-reduced-motion by jumping straight to the value.
 */
export function CountUp({
  to,
  duration = 1.6,
  prefix = '',
  suffix = '',
  className,
  locale = 'fr-TN',
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(to);
      return;
    }
    const controls = animate(motionValue, to, {
      duration,
      ease: EASE,
      onUpdate: (value) => setDisplay(Math.round(value)),
    });
    return () => controls.stop();
  }, [inView, to, duration, reduce, motionValue]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toLocaleString(locale)}
      {suffix}
    </span>
  );
}
