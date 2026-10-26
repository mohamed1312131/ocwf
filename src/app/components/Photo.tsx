import { useTranslation } from 'react-i18next';
import type { LucideIcon } from 'lucide-react';
import { ImageIcon } from 'lucide-react';

type ImgRecord = { default: string };

/**
 * Photo discovery: drop a file named `<id>.<ext>` into `src/assets/photos/`
 * (png / jpg / jpeg / webp / avif) and it is picked up automatically, exactly
 * like the app screenshots. Prefer `.webp` when several variants exist.
 */
const PHOTOS = import.meta.glob<ImgRecord>('../../assets/photos/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
});

/** Resolve a photo URL by id. Returns `null` when the file is missing. */
export function resolvePhoto(id: string): string | null {
  let match: string | undefined;
  for (const key of Object.keys(PHOTOS)) {
    const base = key.slice(key.lastIndexOf('/') + 1).split('.')[0];
    if (base !== id) continue;
    if (!match || (key.endsWith('.webp') && !match.endsWith('.webp'))) match = key;
  }
  return match ? PHOTOS[match].default : null;
}

interface PhotoProps {
  /** File id inside `src/assets/photos` (e.g. `hero-patient`). */
  id: string;
  /** i18n key of a neutral, descriptive alt text (translated fr/en/ar). */
  altKey: string;
  /** Wrapper classes — include the sizing/aspect (e.g. `aspect-[4/5] rounded-3xl`). */
  className?: string;
  /** Classes for the `<img>` itself (object-position tuning, etc.). */
  imgClassName?: string;
  /** Icon shown by the gradient fallback when the file is missing. */
  icon?: LucideIcon;
  /** Hero image: eager-load instead of lazy. */
  eager?: boolean;
  /** Add a subtle teal edge overlay to blend with the palette. */
  overlay?: boolean;
}

/**
 * Image with a graceful fallback: if the file in `src/assets/photos/` is
 * missing, a teal gradient + icon renders instead — it never crashes. The
 * wrapper carries the aspect ratio so there is no layout shift, and every
 * image except the hero is lazy-loaded and decoded asynchronously.
 */
export function Photo({
  id,
  altKey,
  className = '',
  imgClassName = '',
  icon: Icon = ImageIcon,
  eager = false,
  overlay = false,
}: PhotoProps) {
  const { t } = useTranslation();
  const src = resolvePhoto(id);
  const alt = t(altKey);

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-[#0F6F73] to-[#06282C] ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className={`h-full w-full object-cover ${imgClassName}`}
        />
      ) : (
        <div role="img" aria-label={alt} className="flex h-full w-full items-center justify-center">
          <span className="rounded-full bg-white/10 p-4 text-white/60">
            <Icon className="h-7 w-7" aria-hidden="true" />
          </span>
        </div>
      )}
      {overlay ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#06282C]/30 via-transparent to-[#1FBF9A]/10"
        />
      ) : null}
    </div>
  );
}
