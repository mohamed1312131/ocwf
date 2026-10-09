import { ArrowRight, Check, UserPlus, ShieldCheck, Download, KeyRound } from 'lucide-react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Section } from '../Section';
import { Reveal } from '../motion/Reveal';
import { Stagger, StaggerItem } from '../motion/Stagger';
import type { LucideIcon } from 'lucide-react';

const ONBOARDING_STEPS: { icon: LucideIcon; key: string }[] = [
  { icon: UserPlus, key: 'home.how.professionals.step1.title' },
  { icon: ShieldCheck, key: 'home.how.professionals.step2.title' },
  { icon: Download, key: 'home.how.professionals.step3.title' },
  { icon: KeyRound, key: 'home.how.professionals.step4.title' },
];

export function ProfessionalAccess() {
  const { t } = useTranslation();

  const benefits = [
    'home.showcase.professionals.morePatients.title',
    'home.showcase.professionals.flexibleSchedule.title',
    'home.showcase.professionals.managementTools.title',
    'home.showcase.professionals.dedicatedSupport.title',
  ];

  return (
    <Section id="professionnels-cta" className="bg-white py-28 lg:py-32">
      <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        {/* Tinted onboarding panel */}
        <Reveal delay={0.1} className="order-last lg:order-first">
          <div className="relative overflow-hidden rounded-[2rem] bg-mist p-8 shadow-[0_36px_80px_-40px_rgba(15,111,115,0.45)] sm:p-10">
            <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#1FBF9A]/15 blur-3xl" />
            <h3 className="relative text-2xl font-bold text-text-primary">{t('home.pro.onboardingTitle')}</h3>
            <p className="relative mt-2 text-text-secondary">{t('home.pro.onboardingSubtitle')}</p>
            <ol className="relative mt-8 space-y-6">
              {ONBOARDING_STEPS.map((step, n) => (
                <li key={step.key} className="flex gap-4">
                  <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-primary-strong shadow-card">
                    <step.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <div className="flex items-baseline gap-2 font-semibold text-text-primary">
                      <span className="text-sm font-extrabold text-[#1FBF9A]">
                        {String(n + 1).padStart(2, '0')}
                      </span>
                      {t(step.key)}
                    </div>
                    <div className="mt-1 text-base text-text-secondary">{t(`home.how.professionals.step${n + 1}.description`)}</div>
                  </div>
                </li>
              ))}
            </ol>
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
            <Stagger className="mt-9 grid w-full gap-4 text-left sm:grid-cols-2">
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
    </Section>
  );
}