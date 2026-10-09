import type { ReactNode } from 'react';
import { Reveal } from './motion/Reveal';

interface PageHeroProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
}

/**
 * Consistent light header used on inner pages (Features, Professionals, About,
 * Contact). Sits on the mist tint with soft teal blobs and fades into the next
 * section — no dark band, keeping the page rhythm white/mist only.
 */
export function PageHero({ eyebrow, title, subtitle, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-mist via-mist to-white px-6 pb-20 pt-36 sm:px-8 lg:px-10 lg:pb-24 lg:pt-44">
      {/* Soft tinted blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#6BE3B2]/20 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-[#1FBF9A]/15 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-8 h-40 w-[40rem] -translate-x-1/2 rounded-full bg-[#1FBF9A]/10 blur-3xl" />

      <div className="relative mx-auto max-w-[860px] text-center">
        {eyebrow ? (
          <Reveal y={12}>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#1FBF9A]/10 px-5 py-2 text-base font-semibold text-primary-strong">
              {eyebrow}
            </span>
          </Reveal>
        ) : null}

        <Reveal delay={0.05}>
          <h1 className="mt-6 text-balance text-5xl font-extrabold leading-[1.05] tracking-tight text-text-primary sm:text-6xl lg:text-7xl">
            {title}
          </h1>
        </Reveal>

        {subtitle ? (
          <Reveal delay={0.1}>
            <p className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-text-secondary sm:text-2xl">{subtitle}</p>
          </Reveal>
        ) : null}

        {children ? (
          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">{children}</div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}