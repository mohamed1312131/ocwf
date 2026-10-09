import { useTranslation } from 'react-i18next';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { BackToTop } from '../components/BackToTop';
import { StickyMobileCta } from '../components/StickyMobileCta';
import { Hero } from '../components/sections/Hero';
import { TrustStrip } from '../components/sections/TrustStrip';
import { FeatureShowcase } from '../components/sections/FeatureShowcase';
import { BentoGrid } from '../components/sections/BentoGrid';
import { HowItWorks } from '../components/sections/HowItWorks';
import { ProfessionalAccess } from '../components/sections/ProfessionalAccess';
import { FaqSection } from '../components/sections/FaqSection';
import { DownloadCtaBand } from '../components/sections/DownloadCtaBand';

export function Home() {
  const { t } = useTranslation();

  useDocumentMeta({
    title: t('home.meta.title'),
    description: t('home.meta.description'),
  });

  return (
    <div>
      <Hero />
      <TrustStrip />
      <FeatureShowcase />
      <BentoGrid />
      <HowItWorks />
      <ProfessionalAccess />
      <FaqSection />
      <DownloadCtaBand />
      <BackToTop />
      <StickyMobileCta />
    </div>
  );
}