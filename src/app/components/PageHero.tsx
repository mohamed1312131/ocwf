import type { ReactNode } from 'react';
import { Reveal } from './motion/Reveal';
import { Photo } from './Photo';

interface PageHeroProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  /** Optional background photograph shown under the mist, kept faint for legible text. */
  image?: { id: string; altKey: string };
}

/**
 * Consistent light header used on inner pages (Features, Professionals, About,
 * Contact). Sits on the mist tint with soft teal blobs and fades into the next
 * section — no dark band, keeping the page rhythm white/mist only. An optional
 * `image` renders a photographs behind the tint so the headline stays readable.
 */
export function PageHero({ eyebrow, title, subtitle, children, image }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-mist via-mist to-white px-6 pb-20 pt-36 sm:px-8 lg:px-10 lg:pb-24 lg:pt-44">
      {/* Soft tinted blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#6BE3B2]/20 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-[#1FBF9A]/15 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-8 h-40 w-[40rem] -translate-x-1/2 rounded-full bg-[#1FBF9A]/10 blur-3xl" />

      {image ? (
        <>
          <Photo
            id={image.id}
            altKey={image.altKey}
            className="absolute inset-0 h-full w-full rounded-none"
            imgClassName="object-cover object-[50%_30%]"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-mist via-mist/85 to-white" />
        </>
      ) : null}

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