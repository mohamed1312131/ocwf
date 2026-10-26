import { useTranslation } from 'react-i18next';

import { Pause, Play } from 'lucide-react';

interface DeckControlsProps {
  count: number;
  activeIndex: number;
  progress: number;
  isPlaying: boolean;
  onSelect: (index: number) => void;
  onTogglePlay: () => void;
}

/** Dots + slide counter below the deck. A polite live region announces the current slide. */
export function DeckControls({
  count,
  activeIndex,
  progress,
  isPlaying,
  onSelect,
  onTogglePlay,
}: DeckControlsProps) {
  const { t } = useTranslation();

  return (
    <div className="mt-7 flex items-center justify-center gap-2 pb-2">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          aria-label={t('deck.gotoSlide', { index: i + 1 })}
          aria-current={i === activeIndex ? 'step' : undefined}
          onClick={() => onSelect(i)}
          className={`relative h-2.5 overflow-hidden rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            i === activeIndex ? 'w-10 bg-border' : 'w-2.5 bg-border hover:bg-primary/60'
          }`}
        >
          {i === activeIndex ? (
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 bg-primary"
              style={{ width: `${Math.round(progress * 100)}%`, transition: 'width 100ms linear' }}
            />
          ) : null}
        </button>
      ))}
      <button
        type="button"
        aria-label={isPlaying ? t('deck.pauseAutoplay') : t('deck.playAutoplay')}
        aria-pressed={isPlaying}
        onClick={onTogglePlay}
        className="ml-2 flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-white/85 text-text-primary shadow-soft transition hover:bg-white hover:text-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {isPlaying ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
      </button>
      <span aria-hidden="true" className="ms-3 text-sm font-semibold tabular-nums text-text-secondary">
        {String(activeIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
      </span>
      <span aria-live="polite" className="sr-only">
        {t('deck.slideStatus', { current: activeIndex + 1, total: count })}
      </span>
    </div>
  );
}