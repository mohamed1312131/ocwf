import type { RefObject } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import type { DeckTab } from './deckTypes';

interface DeckTabsProps {
  tabs: DeckTab[];
  activeIndex: number;
  progress: number;
  onSelect: (index: number) => void;
  /** Element used to compute the "scroll to below the navbar" target. */
  barRef?: RefObject<HTMLDivElement | null>;
}

/**
 * Tab bar for the home slide deck. ARIA tabs pattern with roving tabindex and
 * arrow-key navigation (mirrored in RTL). The active tab shows a spring-animated
 * "pill" underline that moves between tabs.
 */
export function DeckTabs({ tabs, activeIndex, onSelect, barRef, progress }: DeckTabsProps) {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const rtl = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';

  const onKeyDown = (e: React.KeyboardEvent) => {
    const nextKey = rtl ? 'ArrowLeft' : 'ArrowRight';
    const prevKey = rtl ? 'ArrowRight' : 'ArrowLeft';
    let next = -1;
    if (e.key === nextKey) next = (activeIndex + 1) % tabs.length;
    else if (e.key === prevKey) next = (activeIndex - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = tabs.length - 1;
    if (next >= 0) {
      e.preventDefault();
      document.getElementById(`deck-tab-${tabs[next].id}`)?.focus();
      onSelect(next);
    }
  };

  return (
    <div ref={barRef} className="sticky top-20 z-40">
      <div
        role="tablist"
        aria-label={t('deck.tabsAria')}
        onKeyDown={onKeyDown}
        className="flex items-center gap-1 overflow-x-auto border-b border-border/60 bg-white/95 px-4 py-2.5 backdrop-blur-sm sm:justify-center sm:px-6"
      >
        {tabs.map((tab, i) => {
          const selected = i === activeIndex;
          return (
            <button
              key={tab.id}
              type="button"
              id={`deck-tab-${tab.id}`}
              role="tab"
              aria-selected={selected}
              aria-controls={`deck-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => onSelect(i)}
              aria-label={tab.label}
              className={`relative flex shrink-0 items-center gap-2 rounded-2xl px-3.5 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                selected ? 'text-primary-strong' : 'text-text-secondary hover:text-primary-strong'
              }`}
            >
              <tab.icon
                className={`relative z-10 h-5 w-5 shrink-0 ${selected && !reduce ? 'animate-[pulse_1.8s_ease-in-out_infinite]' : ''}`}
                aria-hidden="true"
              />
              <span className="relative z-10 hidden lg:inline">{tab.label}</span>
              {selected ? (
                <motion.span
                  aria-hidden="true"
                  layoutId={`deck-active-tab`}
                  transition={
                    reduce
                      ? { duration: 0.001 }
                      : { type: 'spring', bounce: 0.18, duration: 0.45 }
                  }
                  className="absolute inset-0 overflow-hidden rounded-2xl border border-primary/25 bg-primary/10"
                >
                  <motion.span
                    aria-hidden="true"
                    initial={false}
                    animate={{ width: reduce ? 0 : `${Math.round(progress * 100)}%` }}
                    transition={{ duration: 100, ease: 'linear' }}
                    className="absolute inset-y-0 left-0 bg-primary/20"
                  />
                </motion.span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}