import { useTranslation } from 'react-i18next';
import { StoreBadges } from '../StoreBadges';
import { Photo } from '../Photo';
import { Reveal } from '../motion/Reveal';
import { Sparkles } from 'lucide-react';

/**
 * Final call-to-action: one large gradient panel, big headline, official store
 * badges, and the family photo blending in from the right on desktop.
 */
export function DownloadCtaBand() {
  const { t } = useTranslation();

  return (
    <div className="bg-white pb-16 pt-4 lg:pb-20">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#06282C] via-[#0F6F73] to-[#1FBF9A] text-white">
          {/* Ambient glows */}
          <div aria-hidden="true" className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#6BE3B2]/25 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-white/15 blur-3xl" />

          {/* Photo bleeding in from the right (desktop layout complete) */}
          <div aria-hidden="false" className="absolute inset-y-0 right-0 hidden w-[46%] lg:block">
            <Photo
              id="cta-family"
              altKey="photos.ctaFamily"
              className="h-full w-full rounded-none"
              imgClassName="object-[50%_35%]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#06282C] via-[#06282C]/75 to-transparent" />
          </div>

          <div className="relative grid content-center gap-10 px-6 py-16 sm:px-12 lg:grid-cols-[1fr_1fr] lg:py-24">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-base font-semibold backdrop-blur">
                <Sparkles className="h-4 w-4 text-[#6BE3B2]" aria-hidden="true" />
                {t('home.final.eyebrow')}
              </span>

              <h2 className="mt-6 text-balance text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">{t('home.final.title')}</h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg text-white/90 sm:text-xl lg:mx-0">{t('home.final.subtitle')}</p>

              <div className="mt-10 flex flex-col items-center gap-4">
                <StoreBadges size="xl" />
              </div>
            </div>

            {/* Photo preview on mobile / tablet (the desktop one is in the background) */}
            <div className="lg:hidden">
              <Photo
                id="cta-family"
                altKey="photos.ctaFamily"
                className="h-56 w-full rounded-3xl sm:h-72"
                imgClassName="object-[50%_35%]"
              />
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}