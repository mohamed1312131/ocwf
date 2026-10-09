import { Search, ShieldCheck, Timer, BadgeCheck, MapPin, HeartHandshake } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Section } from '../Section';
import { SectionHeading } from '../SectionHeading';
import { Stagger, StaggerItem } from '../motion/Stagger';

type BentoSize = 'large' | 'medium' | 'small';

interface BentoItem {
  icon: LucideIcon;
  key: string;
  size: BentoSize;
  tint: string;
}

const BENTO: BentoItem[] = [
  {
    icon: Search,
    key: 'home.bento.simple',
    size: 'large',
    tint: 'bg-gradient-to-br from-[#1FBF9A]/12 to-[#6BE3B2]/8',
  },
  { icon: ShieldCheck, key: 'home.bento.secure', size: 'small', tint: 'bg-white' },
  { icon: Timer, key: 'home.bento.available', size: 'small', tint: 'bg-[#F0FBF6]' },
  { icon: BadgeCheck, key: 'home.bento.qualified', size: 'small', tint: 'bg-white' },
  { icon: MapPin, key: 'home.bento.tunisia', size: 'medium', tint: 'bg-[#EAF7F9]' },
  { icon: HeartHandshake, key: 'home.bento.follow', size: 'medium', tint: 'bg-white' },
];

const SIZE_CLASS: Record<BentoSize, string> = {
  large: 'md:col-span-6',
  medium: 'md:col-span-3',
  small: 'md:col-span-2',
};

export function BentoGrid() {
  const { t } = useTranslation();
  return (
    <Section className="bg-mist py-28 lg:py-32">
      <SectionHeading eyebrow={t('home.bento.eyebrow')} title={t('home.bento.title')} subtitle={t('home.bento.subtitle')} />
      <Stagger className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-6">
        {BENTO.map((item) => (
          <StaggerItem key={item.key} className={`${SIZE_CLASS[item.size]}`}>
            <div
              className={`group flex h-full flex-col gap-5 overflow-hidden rounded-3xl p-7 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:rotate-[0.6deg] hover:shadow-[0_28px_60px_-28px_rgba(15,111,115,0.45)] sm:p-8 ${
                item.size === 'large' ? 'md:flex-row md:items-center md:gap-8' : ''
              } ${item.tint}`}
            >
              <span
                className={`flex shrink-0 items-center justify-center rounded-2xl bg-white text-primary-strong shadow-card transition-transform duration-500 group-hover:scale-110 group-hover:text-[#0F6F73] ${
                  item.size === 'large' ? 'h-20 w-20' : item.size === 'medium' ? 'h-16 w-16' : 'h-14 w-14'
                }`}
              >
                <item.icon
                  className={item.size === 'large' ? 'h-10 w-10' : item.size === 'medium' ? 'h-8 w-8' : 'h-7 w-7'}
                  aria-hidden="true"
                />
              </span>
              <span className="flex flex-col">
                <span
                  className={`font-bold text-text-primary ${
                    item.size === 'large' ? 'text-2xl sm:text-3xl' : item.size === 'medium' ? 'text-xl' : 'text-lg'
                  }`}
                >
                  {t(`${item.key}.title`)}
                </span>
                <span className={`mt-2 leading-relaxed text-text-secondary ${item.size === 'large' ? 'max-w-2xl text-lg' : 'text-base'}`}>
                  {t(`${item.key}.description`)}
                </span>
              </span>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}