import { useTranslation } from 'react-i18next';
import { Section } from '../Section';
import { StoreBadges } from '../StoreBadges';
import { PhoneMockup } from '../PhoneMockup';
import { Reveal } from '../motion/Reveal';

/**
 * Final call-to-action: one large gradient panel, big headline, official store
 * badges and a phone half-cropped at the bottom edge.
 */
export function DownloadCtaBand() {
  const { t } = useTranslation();

  return (
    <Section id="telecharger" className="bg-white pb-16 pt-4 lg:pb-20">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#06282C] via-[#0F6F73] to-[#1FBF9A] px-6 pb-56 pt-16 text-center text-white sm:px-12 sm:pt-20 lg:pb-64 lg:pt-24">
          {/* Ambient glows */}
          <div aria-hidden="true" className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#6BE3B2]/25 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-white/15 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-40 w-[36rem] -translate-x-1/2 rounded-full bg-[#1FBF9A]/30 blur-3xl" />

          <h2 className="relative mx-auto max-w-4xl text-balance text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            {t('home.final.title')}
          </h2>
          <p className="relative mx-auto mt-5 max-w-2xl text-lg text-white/90 sm:text-xl">{t('home.final.subtitle')}</p>

          <div className="relative mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <StoreBadges size="xl" />
          </div>

          {/* Phone, half-cropped at the bottom edge */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -bottom-24 flex justify-center">
            <PhoneMockup screen="appointment" heading="" size="sm" className="pointer-events-none select-none" />
          </div>
        </div>
      </Reveal>
    </Section>
  );
}