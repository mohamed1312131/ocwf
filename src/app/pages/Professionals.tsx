import { Link } from 'react-router';
import { ArrowRight, Brain, Bone, Stethoscope, Syringe } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageHero } from '../components/PageHero';
import { Section } from '../components/Section';
import { SectionHeading } from '../components/SectionHeading';
import { Accordion } from '../components/Accordion';
import type { AccordionItem } from '../components/Accordion';
import { Stagger, StaggerItem } from '../components/motion/Stagger';
import { Reveal } from '../components/motion/Reveal';
import { professionalFeatures } from '../../config/features';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const professions: { value: string; icon: LucideIcon }[] = [
  { value: 'doctor', icon: Stethoscope },
  { value: 'nurse', icon: Syringe },
  { value: 'psychologist', icon: Brain },
  { value: 'physiotherapist', icon: Bone },
];

export function Professionals() {
  const { t } = useTranslation();

  useDocumentMeta({ title: t('professionals.metaTitle'), description: t('professionals.metaDescription') });

  const faqItems = t('home.faq.professionals', { returnObjects: true }) as AccordionItem[];

  return (
    <>
      <PageHero
        eyebrow={t('home.pro.eyebrow')}
        title={t('professionals.hero.title')}
        subtitle={t('home.pro.subtitle')}
      >
        <Link
          to="/pre-inscription"
          className="group inline-flex min-h-12 items-center gap-2 rounded-2xl bg-gradient-to-br from-[#0F6F73] to-[#1FBF9A] px-8 py-4 font-semibold text-white shadow-[0_20px_45px_-18px_rgba(15,111,115,0.65)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_26px_55px_-18px_rgba(15,111,115,0.75)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {t('nav.preRegister')}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100" aria-hidden="true" />
        </Link>
        <Link
          to="/contact"
          className="inline-flex min-h-12 items-center rounded-2xl border border-[#1FBF9A]/40 px-8 py-4 font-semibold text-primary-strong transition hover:border-[#1FBF9A] hover:bg-[#1FBF9A]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {t('nav.contact')}
        </Link>
      </PageHero>

      {/* Professions */}
      <Section className="bg-white py-28 lg:py-32">
        <SectionHeading eyebrow={t('professionals.professionsEyebrow')} title={t('professionals.professionsTitle')} subtitle={t('professionals.professionsSubtitle')} />
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {professions.map((p) => (
            <StaggerItem key={p.value} className="h-full">
              <div className="flex h-full flex-col items-center gap-5 rounded-3xl bg-white p-9 text-center shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-28px_rgba(15,111,115,0.45)]">
                <span className="flex h-16 w-16 items-center justify-center rounded-[1.4rem] bg-gradient-to-br from-[#1FBF9A]/15 to-[#6BE3B2]/15 text-primary-strong">
                  <p.icon className="h-8 w-8" aria-hidden="true" />
                </span>
                <div>
                  <div className="text-xl font-bold text-text-primary">{t(`preInscription.${p.value}`)}</div>
                  <div className="mt-1.5 text-base text-text-secondary">{t(`professionals.professions.${p.value}`)}</div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* How it works */}
      <Section className="bg-mist py-28 lg:py-32">
        <SectionHeading eyebrow={t('home.how.eyebrow')} title={t('home.how.title')} subtitle={t('home.how.professionalsTitle')} />
        <Stagger className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2">
          {[1, 2, 3, 4].map((n) => (
            <StaggerItem key={n} className="h-full">
              <div className="flex h-full items-start gap-5 rounded-3xl bg-white p-7 shadow-soft">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1FBF9A]/12 text-xl font-extrabold text-primary-strong">
                  {String(n).padStart(2, '0')}
                </span>
                <div>
                  <div className="text-lg font-semibold text-text-primary">{t(`home.how.professionals.step${n}.title`)}</div>
                  <div className="mt-1 text-base text-text-secondary">{t(`home.how.professionals.step${n}.description`)}</div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* Benefits */}
      <Section className="bg-white py-28 lg:py-32">
        <SectionHeading eyebrow={t('home.pro.eyebrow')} title={t('professionals.benefits.title')} subtitle={t('home.showcase.subtitle')} />
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {professionalFeatures.map((f) => (
            <StaggerItem key={f.id} className="h-full">
              <div className="flex h-full flex-col rounded-3xl bg-mist p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-28px_rgba(15,111,115,0.45)]">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-primary-strong shadow-card">
                  <f.icon className="h-7 w-7" aria-hidden="true" />
                </span>
                <div className="mt-5 text-xl font-bold text-text-primary">{t(f.titleKey)}</div>
                <div className="mt-2 text-base text-text-secondary">{t(f.descKey)}</div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* FAQ */}
      <Section className="bg-mist py-28 lg:py-32">
        <SectionHeading eyebrow={t('home.faq.eyebrow')} title={t('home.faq.title')} subtitle={t('home.faq.subtitle')} />
        <div className="mx-auto mt-12 max-w-3xl">
          <Reveal>
            <Accordion items={faqItems} />
          </Reveal>
        </div>
      </Section>

      {/* Final CTA */}
      <Section className="bg-white pb-28 pt-28 lg:pb-32 lg:pt-32">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#06282C] via-[#0F6F73] to-[#1FBF9A] px-6 py-16 text-center text-white sm:px-12 lg:py-24">
            <div aria-hidden="true" className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[#6BE3B2]/25 blur-3xl" />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -right-10 h-60 w-60 rounded-full bg-white/15 blur-3xl" />
            <h2 className="relative text-balance text-4xl font-extrabold sm:text-5xl">{t('professionals.cta.title')}</h2>
            <p className="relative mx-auto mt-5 max-w-2xl text-lg text-white/90 sm:text-xl">{t('home.pro.subtitle')}</p>
            <div className="relative mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/pre-inscription"
                className="group inline-flex min-h-12 items-center gap-2 rounded-2xl bg-white px-8 py-4 font-semibold text-primary-strong transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
              >
                {t('nav.preRegister')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100" aria-hidden="true" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex min-h-12 items-center rounded-2xl border-2 border-white/80 px-8 py-4 font-semibold text-white transition hover:bg-white hover:text-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
              >
                {t('nav.contact')}
              </Link>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}