import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, ShieldCheck, UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageHero } from '../components/PageHero';
import { Section } from '../components/Section';
import { SectionHeading } from '../components/SectionHeading';
import { Tabs } from '../components/Tabs';
import { PhoneMockup } from '../components/PhoneMockup';
import type { PhoneScreen } from '../components/PhoneMockup';
import { DownloadCtaBand } from '../components/sections/DownloadCtaBand';
import { FeatureRow } from '../components/sections/FeatureShowcase';
import { Stagger, StaggerItem } from '../components/motion/Stagger';
import { Reveal } from '../components/motion/Reveal';
import { patientFeatures, professionalFeatures, professionalPills } from '../../config/features';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

type TabId = 'patients' | 'professionals';

export function Features() {
  const { t } = useTranslation();
  const [active, setActive] = useState<TabId>('patients');

  useDocumentMeta({ title: t('features.metaTitle'), description: t('features.metaDescription') });

  return (
    <>
      <PageHero
        eyebrow={t('features.heroBadge')}
        title={t('features.hero.title')}
        subtitle={t('features.hero.subtitle')}
      />

      <Section id="fonctionnalites" className="bg-white py-28 lg:py-32">
        <div className="flex flex-col items-center">
          <Tabs
            tabs={[
              { id: 'patients', label: t('features.forPatients') },
              { id: 'professionals', label: t('footer.professionalsSection') },
            ]}
            active={active}
            onChange={(id) => setActive(id as TabId)}
          />
        </div>

        <div key={active}>
          {active === 'patients' ? <PatientsContent /> : <ProfessionalsContent />}
        </div>
      </Section>

      <DownloadCtaBand />
    </>
  );
}

/**
 * Scroll-driven showcase: the phone stays pinned while scrolling through the
 * feature list; the currently visible feature updates the phone screen.
 */
function PatientsContent() {
  const { t } = useTranslation();
  const listRef = useRef<HTMLOListElement>(null);
  const [activeId, setActiveId] = useState(patientFeatures[0].id);

  const screens: PhoneScreen[] = patientFeatures.map((f) => ({
    id: f.id,
    screen: f.screen,
    heading: t(f.titleKey),
  }));

  useEffect(() => {
    const rows = Array.from(listRef.current?.querySelectorAll<HTMLElement>('[data-feature]') ?? []);
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }),
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    rows.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto mt-16 grid gap-14 lg:grid-cols-[1fr_340px] lg:gap-24">
      <ol ref={listRef} className="space-y-2 lg:py-4">
        {patientFeatures.map((f, i) => (
          <FeatureRow
            key={f.id}
            feature={f}
            index={i}
            active={f.id === activeId}
            onSelect={() => setActiveId(f.id)}
          />
        ))}
      </ol>

      <div className="hidden lg:block">
        <div className="sticky top-28 lg:top-32">
          <PhoneMockup screens={screens} controlledId={activeId} size="lg" />
        </div>
      </div>
    </div>
  );
}

function ProfessionalsContent() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto mt-16 grid items-start gap-16 lg:grid-cols-[1fr_360px]">
      <div>
        <SectionHeading
          align="left"
          eyebrow={t('home.pro.eyebrow')}
          title={t('home.showcase.professionalsIntro')}
          subtitle={t('home.showcase.subtitle')}
          className="mb-10"
        />
        <Stagger className="grid gap-5 sm:grid-cols-2">
          {professionalFeatures.map((f) => (
            <StaggerItem key={f.id} className="h-full">
              <div className="flex h-full gap-4 rounded-2xl border border-border bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-soft">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1FBF9A]/15 text-primary-strong">
                  <f.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-lg font-semibold text-text-primary">{t(f.titleKey)}</span>
                  <span className="mt-1 block text-base leading-relaxed text-text-secondary">{t(f.descKey)}</span>
                </span>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {professionalPills.map((pill) => (
              <span
                key={pill.key}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-base font-semibold text-text-secondary"
              >
                <pill.icon className="h-4 w-4 text-primary-strong" aria-hidden="true" />
                {t(pill.key)}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <Link
            to="/pre-inscription"
            className="group mt-10 inline-flex min-h-12 items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {t('nav.preRegister')}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100" aria-hidden="true" />
          </Link>
        </Reveal>
      </div>

      <Reveal className="hidden lg:block">
        <div className="space-y-6">
          <PhoneMockup screen="dashboard" heading={t('home.showcase.screenLabels.dashboard')} size="lg" />
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-white px-5 py-4 text-base font-semibold text-text-primary">
            <ShieldCheck className="h-5 w-5 text-primary-strong" aria-hidden="true" />
            {t('home.trust.verified')}
          </div>
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-white px-5 py-4 text-base font-semibold text-text-primary">
            <UserPlus className="h-5 w-5 text-primary-strong" aria-hidden="true" />
            {t('home.pro.onboardingTitle')}
          </div>
        </div>
      </Reveal>
    </div>
  );
}