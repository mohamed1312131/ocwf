import { Heart, Lightbulb, ShieldCheck, Target, Users, Flag } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageHero } from '../components/PageHero';
import { Section } from '../components/Section';
import { SectionHeading } from '../components/SectionHeading';
import { DownloadCtaBand } from '../components/sections/DownloadCtaBand';
import { Stagger, StaggerItem } from '../components/motion/Stagger';
import { Reveal } from '../components/motion/Reveal';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import storyImage1 from '../../assets/ad71fe2685cc6f3070124bbb1ba3efeb70ac4bc6.webp';
import storyImage2 from '../../assets/0cd048fb94ea28e94ecac46764d15421cd977e95.webp';
import storyImage3 from '../../assets/81eae92ebae58edbe4ce3e4fcee58abce8c8c7f4.webp';
import tunisiaImage from '../../assets/09960f750fd98ca10af332aa627f0667d9bda569.webp';

interface ValueItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function About() {
  const { t } = useTranslation();

  useDocumentMeta({ title: t('about.metaTitle'), description: t('about.metaDescription') });

  const values: ValueItem[] = [
    { icon: Target, title: t('about.values.accessibility.title'), description: t('about.values.accessibility.description') },
    { icon: ShieldCheck, title: t('about.values.trust.title'), description: t('about.values.trust.description') },
    { icon: Users, title: t('home.trust.verified'), description: t('home.bento.qualified.description') },
    { icon: Lightbulb, title: t('about.values.innovation.title'), description: t('about.values.innovation.description') },
    { icon: Heart, title: t('about.values.quality.title'), description: t('about.values.quality.description') },
    { icon: Flag, title: t('home.bento.tunisia.title'), description: t('home.bento.tunisia.description') },
  ];

  const story = [
    { image: storyImage1, alt: t('about.story1Alt'), title: t('about.story1Title'), body: t('about.story1Body') },
    { image: storyImage2, alt: t('about.story2Alt'), title: t('about.story2Title'), body: t('about.story2Body') },
    { image: storyImage3, alt: t('about.story3Alt'), title: t('about.story3Title'), body: t('about.story3Body') },
  ];

  return (
    <>
      <PageHero eyebrow={t('about.heroBadge')} title={t('about.hero.title')} subtitle={t('about.hero.subtitle')} />

      {/* Story */}
      <Section className="bg-white py-28 lg:py-32">
        <SectionHeading eyebrow={t('about.mission.title')} title={t('about.mission.description')} subtitle={t('about.mission.subtitle')} />
        <div className="mt-14 space-y-16">
          {story.map((item, idx) => (
            <div
              key={item.title}
              className={`grid items-center gap-8 lg:grid-cols-2 ${idx % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}
            >
              <Reveal>
                <div className="relative overflow-hidden rounded-3xl shadow-elevated">
                  <img src={item.image} alt={item.alt} className="aspect-[4/3] w-full object-cover" loading="lazy" />
                </div>
              </Reveal>
              <Reveal delay={0.08}>
                <div className="border-l-4 border-[#1FBF9A] pl-6">
                  <h2 className="text-2xl font-bold text-text-primary sm:text-3xl">{item.title}</h2>
                  <p className="mt-4 text-lg leading-relaxed text-text-secondary">{item.body}</p>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </Section>

      {/* Values */}
      <Section className="bg-mist py-28 lg:py-32">
        <SectionHeading eyebrow={t('about.valuesEyebrow')} title={t('about.values.title')} subtitle={t('about.values.subtitle')} />
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v) => (
            <StaggerItem key={v.title} className="h-full">
              <div className="flex h-full flex-col items-start gap-4 rounded-3xl bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1FBF9A] to-[#6BE3B2] text-white">
                  <v.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-bold text-text-primary">{v.title}</h3>
                <p className="text-text-secondary">{v.description}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* Made in Tunisia */}
      <Section className="bg-white py-28 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              align="left"
              eyebrow={t('about.focus.tunisia.title')}
              title={t('about.focus.tunisia.subtitle')}
              className="mb-6"
            />
            <Reveal delay={0.1}>
              <p className="text-lg leading-relaxed text-text-secondary">{t('about.focus.tunisia.description1')}</p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-4 text-lg leading-relaxed text-text-secondary">{t('about.focus.tunisia.description2')}</p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-7 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#1FBF9A]/10 px-4 py-2 text-sm font-semibold text-primary-strong">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  {t('home.trust.verified')}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#1FBF9A]/10 px-4 py-2 text-sm font-semibold text-primary-strong">
                  <Flag className="h-4 w-4" aria-hidden="true" />
                  {t('home.trust.madeIn')}
                </span>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <div className="relative overflow-hidden rounded-3xl shadow-elevated">
              <img src={tunisiaImage} alt={t('about.tunisiaAlt')} className="aspect-[4/3] w-full object-cover" loading="lazy" />
            </div>
          </Reveal>
        </div>
      </Section>

      <DownloadCtaBand />
    </>
  );
}