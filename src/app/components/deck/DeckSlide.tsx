import { useEffect, useLayoutEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { DURATION, EASE, REDUCED } from '../../../lib/motion';
import { PARALLAX_FACTOR } from './deckConfig';

interface DeckSlideProps {
  id: string;
  index: number;
  activeIndex: number;
  onMeasure: (index: number, height: number) => void;
  children: ReactNode;
  direction: 'next' | 'prev';
  total: number;
}

/**
 * One absolutely-positioned slide inside the deck. Slides are always kept in
 * the DOM (`aria-hidden` + `inert`) so their text stays in the HTML and reveal
 * animations replay on activation (content is remounted with a keyed wrapper).
 */
export function DeckSlide({ id, index, activeIndex, onMeasure, children, direction, total }: DeckSlideProps) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const active = index === activeIndex;

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) onMeasure(index, entry.contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [index, onMeasure]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    if (active) el.removeAttribute('inert');
    else el.setAttribute('inert', '');
  }, [active]);

  const rtl = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';
  const flow = rtl ? -1 : 1;
  const dir = direction === 'next' ? 1 : -1;
  const enterX = dir * 120 * flow;
  const exitX = -dir * 120 * flow;

  return (
    <div
      ref={rootRef}
      aria-hidden={!active}
      className="absolute inset-x-0 top-0"
      style={{ pointerEvents: active ? undefined : 'none' }}
    >
      <motion.div
        initial={false}
        animate={
          active
            ? { x: 0, opacity: 1, scale: 1, filter: 'blur(0px)' }
            : { x: enterX, opacity: 0, scale: 0.97, filter: 'blur(4px)' }
        }
        transition={{ duration: reduce ? REDUCED : DURATION.slow, ease: EASE }}
      >
        <div
          ref={contentRef}
          id={`deck-panel-${id}`}
          role="tabpanel"
          aria-labelledby={`deck-tab-${id}`}
        >
          <div key={active ? 'live' : 'idle'}>{children}</div>
        </div>
      </motion.div>
    </div>
  );
}