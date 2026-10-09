import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Section } from '../Section';
import { SectionHeading } from '../SectionHeading';
import { Tabs } from '../Tabs';
import { PhoneMockup } from '../PhoneMockup';
import type { PhoneScreen } from '../PhoneMockup';
import { patientFeatures, professionalFeatures, professionalPills } from '../../../config/features';
import type { FeatureItem } from '../../../config/features';

export function FeatureShowcase() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'patients' | 'professionals'>('patients');
  const features = tab === 'patients' ? patientFeatures : professionalFeatures;

  const listRef = useRef<HTMLOListElement>(null);
  const [activeId, setActiveId] = useState(features[0].id);
  const currentId = features.some((f) => f.id === activeId) ? activeId : features[0].id;

  const screens: PhoneScreen[] =
    tab === 'patients'
      ? patientFeatures.map((f) => ({ id: f.id, screen: f.screen, heading: t(f.titleKey) }))
      : [{ id: 'dashboard', screen: 'dashboard', heading: t('home.showcase.screenLabels.dashboard') }];

  // Scrolling the list drives the phone; clicking does too.
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
  }, [tab]);

  const handleTabChange = (id: string) => setTab(id as 'patients' | 'professionals');

  return (
    <Section id="fonctionnalites" className="bg-white py-28 lg:py-32">
      <SectionHeading
        eyebrow={t('home.showcase.eyebrow')}
        title={t('home.showcase.title')}
        subtitle={t('home.showcase.subtitle')}
      />

      <div className="mt-10 flex justify-center">
        <Tabs
          tabs={[
            { id: 'patients', label: t('home.showcase.patientsTab') },
            { id: 'professionals', label: t('home.showcase.professionalsTab') },
          ]}
          active={tab}
          onChange={handleTabChange}
        />
      </div>

      <div key={tab} className="mx-auto mt-14 grid max-w-[1200px] items-center gap-14 lg:grid-cols-[1fr_340px] lg:gap-24">
        {/* Clean feature list */}
        <ol
          ref={listRef}
          role="tabpanel"
          id="tabpanel-features"
          className="space-y-2 lg:py-4"
          aria-label={t('home.showcase.patientsTab')}
        >
          {features.map((feature, i) => (
            <FeatureRow
              key={feature.id}
              feature={feature}
              index={i}
              active={feature.id === currentId}
              onSelect={() => setActiveId(feature.id)}
            />
          ))}

          {tab === 'professionals' ? (
            <li className="flex flex-wrap gap-2 pt-6">
              {professionalPills.map((pill) => (
                <span
                  key={pill.key}
                  className="inline-flex items-center gap-2 rounded-full bg-[#1FBF9A]/10 px-4 py-2 text-sm font-semibold text-primary-strong"
                >
                  <pill.icon className="h-4 w-4" aria-hidden="true" />
                  {t(pill.key)}
                </span>
              ))}
            </li>
          ) : null}
        </ol>

        {/* Sticky phone */}
        <div className="hidden lg:block">
          <div className="sticky top-28 lg:top-32">
            <PhoneMockup screens={screens} controlledId={currentId} size="lg" />
          </div>
        </div>
      </div>
    </Section>
  );
}

export function FeatureRow({
  feature,
  index,
  active,
  onSelect,
}: {
  feature: FeatureItem;
  index: number;
  active: boolean;
  onSelect: () => void;
}) {
  const { t } = useTranslation();
  return (
    <li data-feature={feature.id} id={feature.id} className="scroll-mt-32">
      <button
        type="button"
        aria-pressed={active}
        onClick={onSelect}
        className={`group relative flex w-full items-center gap-5 text-start transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          active ? 'opacity-100' : 'opacity-60 hover:opacity-90'
        }`}
      >
        {/* Left progress bar */}
        <span
          aria-hidden="true"
          className={`absolute -start-5 top-1/2 hidden h-3/4 w-1 -translate-y-1/2 rounded-full transition-all duration-300 lg:block ${
            active ? 'bg-gradient-to-b from-[#1FBF9A] to-[#6BE3B2]' : 'bg-[#1FBF9A]/20'
          }`}
        />

        <span className="hidden w-8 shrink-0 select-none pt-1 text-4xl font-extrabold tracking-tight text-transparent sm:block" style={{ WebkitTextStroke: '1.5px rgba(31,191,154,0.5)' }}>
          {String(index + 1).padStart(2, '0')}
        </span>

        <span
          className={`flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 ${
            active ? 'bg-[#1FBF9A] text-white shadow-glow' : 'bg-[#1FBF9A]/12 text-primary-strong'
          }`}
        >
          <feature.icon className="h-6.5 w-6.5" aria-hidden="true" />
        </span>

        <span className="flex-1">
          <span className={`block font-bold transition-all duration-300 ${active ? 'text-2xl text-text-primary' : 'text-xl text-text-secondary'}`}>
            {t(feature.titleKey)}
          </span>
          <span className={`mt-1 block leading-relaxed transition-all duration-300 ${active ? 'max-w-xl text-base text-text-secondary' : 'text-sm text-text-secondary'}`}>
            {t(feature.descKey)}
          </span>
        </span>
      </button>
      <div aria-hidden="true" className="ms-16 mt-5 h-px bg-gradient-to-r from-[#1FBF9A]/20 to-transparent" />
    </li>
  );
}