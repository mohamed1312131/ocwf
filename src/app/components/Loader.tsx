import { motion } from 'motion/react';
import { DURATION } from '../../lib/motion';

/** Branded full-screen loader shown while lazy routes are fetched. */
export function Loader() {
  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4"
      role="status"
      aria-live="polite"
      aria-label="Chargement de l’application OmniCare"
    >
      <motion.div
        className="relative h-14 w-14"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary" />
      </motion.div>
      <motion.span
        className="font-semibold text-primary-strong"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: DURATION.slow, repeat: Infinity }}
      >
        OmniCare, l’app santé made in Tunisia
      </motion.span>
    </div>
  );
}