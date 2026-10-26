import { useMemo } from 'react';
import { Download, HelpCircle, ListChecks, Sparkles, Stethoscope } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { Deck } from './Deck';
import type { DeckSlideDef } from './deckTypes';
import { FeatureShowcaseSlide } from '../sections/FeatureShowcase';
import { HowItWorksSlide } from '../sections/HowItWorks';
import { ProfessionalAccessSlide } from '../sections/ProfessionalAccess';
import { FaqSlide } from '../sections/FaqSection';
import { DownloadCtaBand } from '../sections/DownloadCtaBand';

/**
 * Chooses the layout for the Home content below the hero.
 * - Desktop / tablet (>= 768px): slide deck with tabs, arrows and dots.
 * - Phone (< 768px): the same 5 sections rendered stacked, section ids kept so
 *   in-page anchors (`#fonctionnalites`, …) keep working.
 * Returns a neutral placeholder render while the media query is unknown so the
 * initial paint never flashes the wrong layout.
 */
export function DeckOrStack() {
  const { t } = useTranslation();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const slides = useMemo<DeckSlideDef[]>(
    () => [
      {
        id: 'fonctionnalites',
        label: t('nav.features'),
        icon: Sparkles,
        content: <FeatureShowcaseSlide />,
      },
      {
        id: 'comment-ca-marche',
        label: t('deck.tabs.how'),
        icon: ListChecks,
        content: <HowItWorksSlide />,
      },
      {
        id: 'professionnels',
        label: t('deck.tabs.professionals'),
        icon: Stethoscope,
        content: <ProfessionalAccessSlide />,
      },
      {
        id: 'faq',
        label: t('deck.tabs.faq'),
        icon: HelpCircle,
        content: <FaqSlide />,
      },
      {
        id: 'telecharger',
        label: t('deck.tabs.download'),
        icon: Download,
        content: <DownloadCtaBand />,
      },
    ],
    [t],
  );

  if (isDesktop === null) {
    return <div aria-hidden="true" className="min-h-[82vh]" />;
  }

  if (isDesktop) {
    return <Deck slides={slides} />;
  }

  return (
    <div className="bg-gradient-to-b from-white via-white to-mist/80">
      {slides.map((slide) => (
        <section key={slide.id} id={slide.id} className="scroll-mt-24">
          {slide.content}
        </section>
      ))}
    </div>
  );
}