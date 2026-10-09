import { BadgeCheck, LockKeyhole, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Section } from '../Section';
import { Stagger, StaggerItem } from '../motion/Stagger';

const ITEMS = [
  { icon: LockKeyhole, key: 'home.trust.confidentiality' },
  { icon: BadgeCheck, key: 'home.trust.verified' },
  { icon: MapPin, key: 'home.trust.madeIn' },
];

/**
 * Floating glass card straddling the hero→page boundary. The hero fades into
 * the same mist tint as this section, so the card reads as glass floating over
 * the soft transition rather than sitting on a grey band.
 */
export function TrustStrip() {
  const { t } = useTranslation();
  return (
    <Section className="relative z-20 -mt-20 bg-mist pb-10">
      <Stagger className="relative z-10 mx-auto grid max-w-4xl grid-cols-1 gap-3 rounded-3xl border border-white/50 bg-white/70 p-5 shadow-[0_30px_70px_-30px_rgba(15,111,115,0.35)] backdrop-blur-md sm:grid-cols-3 sm:gap-4 sm:p-6">
        {ITEMS.map((item) => (
          <StaggerItem key={item.key} className="flex items-center justify-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1FBF9A]/15 text-primary-strong">
              <item.icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-semibold text-text-primary">{t(item.key)}</span>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}