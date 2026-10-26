import { useTranslation } from 'react-i18next';
import type { AccordionItem } from '../Accordion';
import { Accordion } from '../Accordion';
import { SectionHeading } from '../SectionHeading';
import { Reveal } from '../motion/Reveal';

export function FaqSlide() {
  const { t } = useTranslation();

  const patientItems = t('home.faq.patients', { returnObjects: true }) as AccordionItem[];
  const proItems = t('home.faq.professionals', { returnObjects: true }) as AccordionItem[];

  return (
    <div className="mx-auto w-full max-w-[1200px] px-6 py-10 sm:px-8 lg:px-10 lg:py-14">
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
    </div>
  );
}