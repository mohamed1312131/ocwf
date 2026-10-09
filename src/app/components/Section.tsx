import type { ReactNode } from 'react';

interface SectionProps {
  id?: string;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
}

/** Consistent vertical rhythm + horizontal gutters for every landing section. */
export function Section({ id, className = '', containerClassName = '', children }: SectionProps) {
  return (
    <section id={id} className={`scroll-mt-24 px-6 sm:px-8 lg:px-10 ${className}`}>
      <div className={`mx-auto w-full max-w-[1200px] ${containerClassName}`}>{children}</div>
    </section>
  );
}