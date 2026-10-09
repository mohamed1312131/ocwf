import {
  ArrowRight,
  Bell,
  CalendarCheck,
  FolderHeart,
} from 'lucide-react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { StoreBadges } from '../StoreBadges';
import { PhoneMockup } from '../PhoneMockup';
import { Magnetic } from '../motion/Magnetic';
import { EASE } from '../../../lib/motion';
import { patientFeatures } from '../../../config/features';

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;

function AnimatedBackground() {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Rotating conic mesh */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[170%] w-[170%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(from_0deg,#0F6F73,#1FBF9A,#6BE3B2,#2C3E3E,#0F6F73)] opacity-25 blur-2xl"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
      />
      {/* Top glow */}
      <div className="absolute -top-40 left-1/2 h-[32rem] w-[46rem] -translate-x-1/2 rounded-full bg-[#6BE3B2]/20 blur-3xl" />

      {/* Soft blurred blobs */}
      <motion.div
        className="absolute -left-32 top-10 h-[26rem] w-[26rem] rounded-full bg-[#1FBF9A]/30 blur-3xl"
        animate={reduce ? undefined : { x: [0, 54, 0], y: [0, 32, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-24 top-1/3 h-[24rem] w-[24rem] rounded-full bg-[#6BE3B2]/25 blur-3xl"
        animate={reduce ? undefined : { x: [0, -52, 0], y: [0, 48, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-10 left-1/4 h-80 w-80 rounded-full bg-[#0F6F73]/40 blur-3xl"
        animate={reduce ? undefined : { y: [0, -34, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Depth gradient (keeps text readable at the top) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#06282C]/50 via-transparent to-transparent" />

      {/* Long fade into the page tint — no hard edge */}
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-b from-transparent via-[#1FBF9A]/15 to-mist" />
      <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-mist to-transparent" />

      {/* Subtle grain */}
      <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay" style={{ backgroundImage: NOISE }} />
    </div>
  );
}

function Headline({ text }: { text: string }) {
  const reduce = useReducedMotion();
  return (
    <h1 className="text-balance text-5xl font-extrabold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
      {text
        .split(' ')
        .map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            className="inline-block whitespace-nowrap"
            initial={reduce ? { opacity: 0.001 } : { opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.12 + i * 0.07, duration: 0.7, ease: EASE }}
          >
            {word}
            {'\u00A0'}
          </motion.span>
        ))}
    </h1>
  );
}

const FLOAT_CARDS = [
  { key: 'appointment', icon: CalendarCheck, pos: '-top-6 right-0 lg:-top-10 lg:-right-8', delay: 0.6, y: 6 },
  { key: 'reminder', icon: Bell, pos: 'top-16 -left-4 lg:top-20 lg:-left-14', delay: 1.1, y: 8 },
  { key: 'record', icon: FolderHeart, pos: '-bottom-4 right-2 lg:-bottom-10 lg:right-10', delay: 1.6, y: 7 },
] as const;

export function Hero() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();

  // Pointer parallax (normalized -1..1), eased with springs.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18, mass: 0.3 });
  const sy = useSpring(py, { stiffness: 60, damping: 18, mass: 0.3 });
  const phoneX = useTransform(sx, (v) => v * -9);
  const phoneY = useTransform(sy, (v) => v * -7);
  const cardX = useTransform(sx, (v) => v * 14);
  const cardY = useTransform(sy, (v) => v * 12);

  const handlePointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    py.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
  };

  const screens = patientFeatures.map((f) => ({ id: f.id, screen: f.screen, heading: t(f.titleKey) }));

  return (
    <section
      className="relative min-h-screen overflow-hidden bg-[#06282C] text-white"
      onPointerMove={handlePointerMove}
    >
      <AnimatedBackground />

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-[1200px] items-center gap-14 px-6 pb-48 pt-32 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-4 lg:px-10 lg:pb-56 lg:pt-40">
        {/* Copy */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <motion.span
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-base font-semibold backdrop-blur"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-[#6BE3B2]" />
            {t('home.hero.eyebrow')}
          </motion.span>

          <div className="mt-7">
            <Headline text={t('home.hero.title')} />
          </div>

          <motion.p
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: EASE }}
            className="mt-6 max-w-xl text-xl leading-relaxed text-white/90 sm:text-2xl"
          >
            {t('home.hero.subtitle')}
          </motion.p>

          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7, ease: EASE }}
            className="mt-9 flex w-full flex-col items-center gap-5 lg:items-start"
          >
            <StoreBadges size="xl" />
            <Magnetic>
              <Link
                to="/pre-inscription"
                className="group inline-flex items-center gap-2 rounded-2xl border-2 border-white/70 bg-white/5 px-7 py-3.5 text-base font-semibold backdrop-blur transition-colors hover:bg-white hover:text-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#06282C]"
              >
                {t('home.hero.proCta')}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100" aria-hidden="true" />
              </Link>
            </Magnetic>
          </motion.div>
        </div>

        {/* Phone + floating cards */}
        <div className="relative mx-auto w-full">
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 48, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 90, damping: 16, delay: 0.35 }}
          >
            <div className="mx-auto w-[315px] sm:w-[372px] lg:w-[401px]">
              <motion.div
                style={{ x: phoneX, y: phoneY }}
                className="scale-[1.15] origin-top-center rotate-2 sm:scale-[1.28] sm:rotate-1 lg:scale-[1.38] lg:rotate-[1.5deg]"
              >
                <PhoneMockup screens={screens} intervalMs={4500} />
              </motion.div>
            </div>
          </motion.div>

          {/* Floating cards */}
          {FLOAT_CARDS.map((card) => (
            <motion.div
              key={card.key}
              className={`absolute z-10 hidden md:block ${card.pos}`}
              style={{ x: cardX, y: cardY }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: card.delay, duration: 0.6, ease: EASE }}
            >
              <motion.div
                animate={reduce ? undefined : { y: [0, -card.y, 0] }}
                transition={{ duration: 5 + card.delay, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/90 px-4 py-3 shadow-elevated backdrop-blur">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1FBF9A]/15 text-primary-strong">
                    <card.icon className="h-4.5 w-4.5" aria-hidden="true" />
                  </span>
                  <span className="flex flex-col items-start">
                    <span className="text-sm font-bold text-neutral-900">{t(`home.hero.cards.${card.key}.label`)}</span>
                    <span className="text-xs text-neutral-500">{t(`home.hero.cards.${card.key}.sub`)}</span>
                  </span>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      </section>
  );
}