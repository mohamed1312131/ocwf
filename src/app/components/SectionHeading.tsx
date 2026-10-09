import type { ReactNode } from 'react';
import { Reveal } from './motion/Reveal';

interface SectionHeadingProps {
  eyebrow?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  align?: 'center' | 'left';
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className = '',
}: SectionHeadingProps) {
  const alignCls = align === 'center' ? 'text-center items-center' : 'text-left items-start';
  return (
    <div className={`flex flex-col gap-4 ${alignCls} ${className}`}>
      {eyebrow ? (
        <Reveal y={12}>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#1FBF9A]/10 px-5 py-2 text-base font-semibold text-primary-strong">
            {eyebrow}
          </span>
        </Reveal>
      ) : null}
      {title ? (
        <Reveal delay={0.05}>
          <h2 className="text-balance text-4xl font-bold leading-tight text-text-primary sm:text-5xl">{title}</h2>
        </Reveal>
      ) : null}
      {subtitle ? (
        <Reveal delay={0.1}>
          <p className={`max-w-3xl text-lg leading-relaxed text-text-secondary sm:text-xl ${align === 'center' ? 'mx-auto' : ''}`}>
            {subtitle}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}