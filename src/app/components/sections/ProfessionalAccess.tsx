import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Photo } from '../Photo';
import { Reveal } from '../motion/Reveal';
import { Stagger, StaggerItem } from '../motion/Stagger';

export function ProfessionalAccessSlide() {
  const { t } = useTranslation();

  const benefits = [
    'home.showcase.professionals.morePatients.title',
    'home.showcase.professionals.flexibleSchedule.title',
    'home.showcase.professionals.managementTools.title',
    'home.showcase.professionals.dedicatedSupport.title',
  ];

  return (
    <div className="mx-auto w-full max-w-[1200px] px-6 py-10 sm:px-8 lg:px-10 lg:py-14">
      <div className="grid items-center gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
        {/* Photos: pro-doctor with a smaller overlapping pro-nurse */}
        <Reveal className="order-last lg:order-first">
          <div className="relative mx-auto max-w-md lg:max-w-none">
            <Photo
              id="pro-doctor"
              altKey="photos.proDoctor"
              className="aspect-[4/5] rounded-3xl shadow-elevated"
              imgClassName="object-[50%_25%]"
            />
            <div className="absolute -bottom-6 -right-3 w-[44%] sm:w-[40%]">
              <Photo
                id="pro-nurse"
                altKey="photos.proNurse"
                className="aspect-square rounded-3xl border-4 border-white shadow-elevated"
                imgClassName="object-[50%_30%]"
              />
            </div>
          </div>
        </Reveal>

        {/* Benefits + CTA */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#1FBF9A]/10 px-5 py-2 text-base font-semibold text-primary-strong">
              {t('home.pro.eyebrow')}
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 text-balance text-4xl font-bold leading-tight text-text-primary sm:text-5xl">{t('home.pro.title')}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-text-secondary sm:text-xl">{t('home.pro.subtitle')}</p>
          </Reveal>
          <Reveal delay={0.15}>
            <Stagger className="mt-9 grid w-full gap-4 text-start sm:grid-cols-2">
              {benefits.map((b) => (
                <StaggerItem key={b} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1FBF9A]/15">
                    <Check className="h-3.5 w-3.5 text-primary-strong" aria-hidden="true" />
                  </span>
                  <span className="font-semibold text-text-primary">{t(b)}</span>
                </StaggerItem>
              ))}
            </Stagger>
          </Reveal>
          <Reveal delay={0.2}>
            <Link
              to="/pre-inscription"
              className="group mt-10 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-gradient-to-br from-[#0F6F73] to-[#1FBF9A] px-8 py-4 text-lg font-semibold text-white shadow-[0_20px_45px_-18px_rgba(15,111,115,0.65)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_26px_55px_-18px_rgba(15,111,115,0.75)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {t('home.pro.cta')}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
