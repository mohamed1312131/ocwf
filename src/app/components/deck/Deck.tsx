import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DeckControls } from './DeckControls';
import { DeckSlide } from './DeckSlide';
import { DeckTabs } from './DeckTabs';
import type { DeckSlideDef } from './deckTypes';
import { AUTOPLAY_MS, AUTOPLAY_RESUME_DELAY_MS, NAVBAR_HEIGHT } from './deckConfig';
import { DURATION, EASE, REDUCED } from '../../../lib/motion';

interface DeckProps {
  slides: DeckSlideDef[];
}

/**
 * Home page slide deck (desktop / tablet). Slides fade + slide horizontally
 * (direction follows the click order, mirrored in RTL), the container animates
 * its height to the active slide, and the tab bar stays sticky under the fixed
 * navbar. Hash ids, keyboard arrows, touch swipe and back/forward are wired.
 */
export function Deck({ slides }: DeckProps) {
  const { t } = useTranslation();
  const reduce = useReducedMotion();

  const tabsBarRef = useRef<HTMLDivElement | null>(null);
  const activeIndexRef = useRef(0);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const autoplayRef = useRef<number | null>(null);
  const progressRef = useRef<number | null>(null);
  const manualUntilRef = useRef(0);
  const deckRef = useRef<HTMLDivElement | null>(null);
  const isVisibleRef = useRef(true);
  const isPausedByUserRef = useRef(false);

  const canAutoplay = useMemo(() => {
    if (reduce) return false;
    if (isPausedByUserRef.current) return false;
    if (!isVisibleRef.current) return false;
    const deck = deckRef.current;
    if (!deck) return false;
    const rect = deck.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight * 1.2) return false;
    if (Date.now() < manualUntilRef.current) return false;
    return true;
  }, [reduce]);

  const indexFromHash = useCallback(() => {
    const id = window.location.hash.replace(/^#/, '');
    return slides.findIndex((s) => s.id === id);
  }, [slides]);

  const [activeIndex, setActiveIndex] = useState(() => {
    const i = indexFromHash();
    return i >= 0 ? i : 0;
  });
  const [heights, setHeights] = useState<Record<string, number>>({});
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [, setLastManual] = useState(0);

  activeIndexRef.current = activeIndex;

  const scrollToTabs = useCallback(
    (behavior?: ScrollBehavior) => {
      const bar = tabsBarRef.current;
      if (!bar) return;
      const top = bar.getBoundingClientRect().top + window.scrollY;
      const target = Math.max(0, top - NAVBAR_HEIGHT - 12);
      window.scrollTo({ top: target, behavior: behavior ?? (reduce ? 'auto' : 'smooth') });
    },
    [reduce],
  );

  const rtl = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';
  const flow = rtl ? -1 : 1;

  const nextIndex = useCallback(
    (i: number) => (i + 1) % slides.length,
    [slides.length],
  );
  const prevIndex = useCallback(
    (i: number) => (i - 1 + slides.length) % slides.length,
    [slides.length],
  );

  const markManual = useCallback(() => {
    setLastManual(Date.now());
    manualUntilRef.current = Date.now() + AUTOPLAY_RESUME_DELAY_MS;
    isPausedByUserRef.current = false;
    setIsPlaying(false);
  }, []);

  const goTo = useCallback(
    (index: number, opts?: { changeHash?: boolean; scroll?: boolean; source?: 'manual' | 'auto' }) => {
      const source = opts?.source ?? 'manual';
      const wrap = (n: number) => ((n % slides.length) + slides.length) % slides.length;
      const i = wrap(index);
      const changeHash = opts?.changeHash ?? true;
      const scroll = opts?.scroll ?? true;
      if (i !== activeIndexRef.current) {
        const dir = i > activeIndexRef.current ? 'next' : 'prev';
        const wrapped =
          (activeIndexRef.current === 0 && i === slides.length - 1) ||
          (activeIndexRef.current === slides.length - 1 && i === 0);
        setDirection(wrapped ? (source === 'auto' || i > activeIndexRef.current ? 'next' : 'prev') : dir);
        setActiveIndex(i);
        if (changeHash) {
          const target = `#${slides[i].id}`;
          if (window.location.hash !== target) window.history.pushState(null, '', target);
        }
      }
      if (source === 'manual') markManual();
      if (scroll) requestAnimationFrame(() => scrollToTabs());
    },
    [slides, scrollToTabs, markManual],
  );

  const syncFromHash = useCallback(() => {
    const i = indexFromHash();
    if (i >= 0 && i !== activeIndexRef.current) {
      setDirection(i > activeIndexRef.current ? 'next' : 'prev');
      setActiveIndex(i);
    }
    requestAnimationFrame(() => scrollToTabs());
  }, [indexFromHash, scrollToTabs]);

  const onMeasure = useCallback(
    (index: number, height: number) => {
      const id = slides[index].id;
      setHeights((prev) => {
        if (Math.abs((prev[id] ?? 0) - height) < 2) return prev;
        return { ...prev, [id]: height };
      });
    },
    [slides],
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        target.closest &&
        target.closest('[role="tab"], a, button, input, textarea, select, [contenteditable="true"]')
      ) {
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      let move: number | undefined;
      if (e.key === 'ArrowRight') move = activeIndexRef.current + flow;
      else if (e.key === 'ArrowLeft') move = activeIndexRef.current - flow;
      else if (e.key === 'Home') move = 0;
      else if (e.key === 'End') move = slides.length - 1;
      if (move === undefined || move < 0 || move >= slides.length) return;
      e.preventDefault();
      goTo(move, { source: 'manual' });
    },
    [flow, slides.length, goTo],
  );

  const endSwipe = useCallback(
    (clientX: number, clientY: number, target: EventTarget) => {
      const start = swipeStart.current;
      swipeStart.current = null;
      if (!start) return;
      const dx = clientX - start.x;
      const dy = clientY - start.y;
      if (Math.abs(dx) < 56 || Math.abs(dx) < Math.abs(dy)) return;
      const el = target as HTMLElement | null;
      if (el && el.closest && el.closest('button, a, [role="tab"], input, textarea, select')) return;
      if (dx < 0) goTo(activeIndexRef.current + flow, { source: 'manual' });
      else goTo(activeIndexRef.current - flow, { source: 'manual' });
    },
    [flow, goTo],
  );

  useEffect(() => {
    window.addEventListener('hashchange', syncFromHash);
    window.addEventListener('popstate', syncFromHash);
    return () => {
      window.removeEventListener('hashchange', syncFromHash);
      window.removeEventListener('popstate', syncFromHash);
    };
  }, [syncFromHash]);

  useEffect(() => {
    const onVisibility = () => {
      isVisibleRef.current = document.visibilityState !== 'hidden';
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    const deck = deckRef.current;
    if (!deck) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (isVisibleRef.current = e.isIntersecting));
      },
      { threshold: 0.2 },
    );
    io.observe(deck);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    setIsPlaying(canAutoplay);
  }, [canAutoplay]);

  useEffect(() => {
    if (autoplayRef.current) window.clearInterval(autoplayRef.current);
    if (progressRef.current) window.clearInterval(progressRef.current);
    setProgress(0);
    if (canAutoplay) {
      const start = Date.now();
      progressRef.current = window.setInterval(() => {
        const p = Math.min(1, (Date.now() - start) / AUTOPLAY_MS);
        setProgress(p);
      }, 100);
      autoplayRef.current = window.setInterval(() => {
        goTo(nextIndex(activeIndexRef.current), { source: 'auto' });
      }, AUTOPLAY_MS);
    }
    return () => {
      if (autoplayRef.current) window.clearInterval(autoplayRef.current);
      if (progressRef.current) window.clearInterval(progressRef.current);
      autoplayRef.current = null;
      progressRef.current = null;
    };
  }, [activeIndex, canAutoplay, goTo, nextIndex]);

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

  const activeSlide = slides[activeIndex];
  const targetHeight = heights[activeSlide.id] ? Math.max(heights[activeSlide.id], 640) : 640;
  const tabs = slides.map((s) => ({ id: s.id, label: s.label, icon: s.icon }));

  return (
    <div className="relative bg-gradient-to-b from-white via-white to-mist/80">
      <DeckTabs
        tabs={tabs}
        activeIndex={activeIndex}
        onSelect={(i) => goTo(i, { source: 'manual' })}
        barRef={tabsBarRef}
        progress={progress}
      />

      <div
        ref={deckRef}
        className="relative mx-auto w-full max-w-7xl"
        style={{ touchAction: 'pan-y' }}
        onPointerDown={(e) => {
          swipeStart.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={(e) => endSwipe(e.clientX, e.clientY, e.target)}
        onPointerCancel={() => {
          swipeStart.current = null;
        }}
      >
        <motion.div
          initial={false}
          animate={{ height: targetHeight }}
          transition={{ duration: reduce ? REDUCED : DURATION.slow, ease: EASE }}
          className="relative min-h-[clamp(640px,82vh,820px)]"
        >
          {slides.map((slide, i) => (
            <DeckSlide
              key={slide.id}
              id={slide.id}
              index={i}
              activeIndex={activeIndex}
              direction={direction}
              total={slides.length}
              onMeasure={onMeasure}
            >
              {slide.content}
            </DeckSlide>
          ))}

          {/* Prev / next arrows */}
          <div className="absolute start-3 top-1/2 z-30 hidden -translate-y-1/2 md:flex">
            <button
              type="button"
              aria-label={t('deck.prev')}
              disabled={false}
              onClick={() => goTo(prevIndex(activeIndex), { source: 'manual' })}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border/70 bg-white/85 text-text-primary shadow-soft backdrop-blur transition hover:bg-white hover:text-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronLeft className="h-5 w-5 rtl:-scale-x-100" aria-hidden="true" />
            </button>
          </div>
          <div className="absolute end-3 top-1/2 z-30 hidden -translate-y-1/2 md:flex">
            <button
              type="button"
              aria-label={t('deck.next')}
              disabled={false}
              onClick={() => goTo(nextIndex(activeIndex), { source: 'manual' })}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border/70 bg-white/85 text-text-primary shadow-soft backdrop-blur transition hover:bg-white hover:text-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronRight className="h-5 w-5 rtl:-scale-x-100" aria-hidden="true" />
            </button>
          </div>
        </motion.div>

        <DeckControls
          count={slides.length}
          activeIndex={activeIndex}
          progress={progress}
          isPlaying={isPlaying && !reduce}
          onSelect={(i) => goTo(i, { source: 'manual' })}
          onTogglePlay={() => {
            const nextPlay = !isPlaying;
            setIsPlaying(nextPlay);
            if (nextPlay) {
              isPausedByUserRef.current = false;
              manualUntilRef.current = 0;
            } else {
              isPausedByUserRef.current = true;
              manualUntilRef.current = Date.now() + 60 * 60 * 1000;
            }
          }}
        />
      </div>
    </div>
  );
}
