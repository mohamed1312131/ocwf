import { useTranslation } from 'react-i18next';
import type { AccordionItem } from '../Accordion';
import { Accordion } from '../Accordion';
import { Section } from '../Section';
import { SectionHeading } from '../SectionHeading';
import { Reveal } from '../motion/Reveal';

export function FaqSection() {
  const { t } = useTranslation();

  const patientItems = t('home.faq.patients', { returnObjects: true }) as AccordionItem[];
  const proItems = t('home.faq.professionals', { returnObjects: true }) as AccordionItem[];

  return (
    <Section id="faq" className="bg-mist py-28 lg:py-32">
      <SectionHeading eyebrow={t('home.faq.eyebrow')} title={t('home.faq.title')} subtitle={t('home.faq.subtitle')} />

      <div className="mx-auto mt-14 grid max-w-[1200px] gap-10 lg:grid-cols-2">
        <Reveal>
          <h3 className="mb-5 text-lg font-bold text-text-primary">{t('home.faq.patientsTitle')}</h3>
          <Accordion items={patientItems} />
        </Reveal>
        <Reveal delay={0.08}>
          <h3 className="mb-5 text-lg font-bold text-text-primary">{t('home.faq.professionalsTitle')}</h3>
          <Accordion items={proItems} />
        </Reveal>
      </div>
    </Section>
  );
}