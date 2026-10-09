/**
 * Shared motion system: a single source of truth for easings and durations.
 * Every animated component should use these so the whole site feels consistent.
 */

export const EASE = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  fast: 0.15,
  base: 0.25,
  slow: 0.45,
  reveal: 0.6,
} as const;

/** Default viewport config for scroll-triggered reveals. */
export const VIEWPORT = { once: true, amount: 0.2 } as const;

/** A tiny near-zero duration used when the user prefers reduced motion. */
export const REDUCED = 0.001;
