import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { StoreBadges } from './StoreBadges';

/**
 * Mobile-only sticky CTA shown after the hero, so the download action is never
 * more than a thumb tap away. Hidden when the final download band is visible
 * (end of the page) is overkill — the same store links are duplicated there.
 */
export function StickyMobileCta() {
  const { t } = useTranslation();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      aria-hidden={!shown}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 px-4 py-3 backdrop-blur transition-all duration-300 md:hidden ${
        shown ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'
      }`}
    >
      <div className="flex items-center gap-3">
        <StoreBadges size="sm" className="flex-1 flex-wrap" />
        <Link
          to="/pre-inscription"
          className="flex min-h-11 flex-1 items-center justify-center gap-1 rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          {t('common.professionalsShort')}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}