import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Apple } from 'lucide-react';
import { APP_STORE_URL, GOOGLE_PLAY_URL } from '../../config/appLinks';
import type { ReactNode } from 'react';

type OS = 'ios' | 'android' | null;

function useDetectedOS(): OS {
  const [os, setOs] = useState<OS>(null);
  useEffect(() => {
    const ua = navigator.userAgent || '';
    if (/iPhone|iPad|iPod/i.test(ua)) setOs('ios');
    else if (/Android/i.test(ua)) setOs('android');
  }, []);
  return os;
}

interface StoreBadgesProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Override device-type detection (e.g. force-highlight App Store). */
  highlight?: OS;
}

/**
 * App Store / Google Play download buttons.
 *
 * OFFICIAL BADGE SLOTS — licensing:
 * The Apple App Store and Google Play badges are trademarked artwork. They MUST
 * NOT be recreated by hand. If the official SVG badge files are available in
 * `src/assets/badges/` (app-store-{fr,en,ar}.svg / google-play-{fr,en,ar}.svg)
 * they should be dropped in and rendered as-is. Until then this code-built
 * fallback reproduces the official layout: black pill, 1px light border,
 * brand glyphs, two-line caption.
 * TODO(store-badges): drop the official badge artwork here.
 */
export function StoreBadges({ className = '', size = 'md', highlight }: StoreBadgesProps) {
  const { t } = useTranslation();
  const detected = useDetectedOS();
  const active = highlight ?? detected;

  const typo =
    size === 'xl' || size === 'lg'
      ? { top: 'text-[10px] sm:text-xs', bottom: 'text-sm sm:text-base', icon: 'h-7 w-7 sm:h-8 sm:w-8' }
      : { top: 'text-[10px] sm:text-xs', bottom: 'text-[13px] sm:text-sm', icon: 'h-6 w-6 sm:h-7 sm:w-7' };

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`} role="group" aria-label="Télécharger l’application">
      <StoreBadge
        href={APP_STORE_URL}
        os="ios"
        active={active === 'ios'}
        icon={<Apple className={typo.icon} aria-hidden="true" />}
        labelTop={t('common.badges.appleTop')}
        labelBottom={t('common.badges.appleBottom')}
        typo={typo}
      />
      <StoreBadge
        href={GOOGLE_PLAY_URL}
        os="android"
        active={active === 'android'}
        icon={<GooglePlayGlyph className={typo.icon} aria-hidden="true" />}
        labelTop={t('common.badges.googleTop')}
        labelBottom={t('common.badges.googleBottom')}
        typo={typo}
      />
    </div>
  );
}

interface StoreBadgeProps {
  href: string;
  os: OS;
  active: boolean;
  icon: ReactNode;
  labelTop: string;
  labelBottom: string;
  typo: { top: string; bottom: string; icon: string };
}

/**
 * Black store badge (official proportions: ~56px desktop / 48px mobile height,
 * 10px radius, 1px light-grey border, brand glyph, two-line caption).
 */
function StoreBadge({ href, os, active, icon, labelTop, labelBottom, typo }: StoreBadgeProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${labelTop} ${labelBottom}`}
      className={`flex h-12 items-center rounded-[10px] border border-white/20 px-4 transition-all duration-300 hover:-translate-y-1 hover:border-white/40 hover:bg-neutral-950 hover:shadow-[0_14px_30px_-10px_rgba(6,40,44,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:h-14 sm:px-5 ${
        active ? 'bg-neutral-950 ring-2 ring-primary' : 'bg-[#0A0A0A]'
      }`}
    >
      <span className="flex items-center gap-2.5 sm:gap-3">
        {icon}
        <span className="flex flex-col items-start leading-none">
          <span className={`font-medium tracking-wide text-neutral-300 ${typo.top}`}>{labelTop}</span>
          <span className={`mt-1 font-bold text-white ${typo.bottom}`}>{labelBottom}</span>
        </span>
      </span>
    </a>
  );
}

/**
 * Google Play brand glyph (inline SVG, official colorway). Recognizable
 * approximation of the mark: blue back crescent + green/red/yellow play
 * triangle. Replaced by the official artwork once provided in src/assets/badges.
 */
function GooglePlayGlyph({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} role="img" aria-hidden="true">
      <path
        fill="#00A0FF"
        d="M3.4 2.3c-1.5 0-2.4 1.3-2.4 3v13.4c0 1.7.9 3 2.4 3 .5 0 1-.16 1.3-.4l.1-.07V2.77l-.1-.07c-.3-.24-.8-.4-1.3-.4z"
      />
      <path fill="#00C853" d="M4.4 3.55 14.9 12 4.4 20.45a1.4 1.4 0 0 1-.5-1.08V4.63c0-.44.19-.85.5-1.08z" />
      <path fill="#F9450A" d="m14.9 12-4.37 4.9c0 .02-6.13 3.55-6.13 3.55L14.9 12z" />
      <path fill="#FFD400" d="M14.9 12 4.4 20.45l3.56-3.9L14.9 12z" />
    </svg>
  );
}