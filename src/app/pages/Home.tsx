import { useTranslation } from 'react-i18next';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { BackToTop } from '../components/BackToTop';
import { StickyMobileCta } from '../components/StickyMobileCta';
import { Hero } from '../components/sections/Hero';
import { DeckOrStack } from '../components/deck/DeckOrStack';

export function Home() {
  const { t } = useTranslation();

  useDocumentMeta({
    title: t('home.meta.title'),
    description: t('home.meta.description'),
  });

  return (
    <div>
      <Hero />
      <DeckOrStack />
      <BackToTop />
      <StickyMobileCta />
    </div>
  );
}