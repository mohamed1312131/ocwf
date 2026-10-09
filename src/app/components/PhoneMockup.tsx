import type { ComponentType } from 'react';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  Activity,
  BadgeCheck,
  Bell,
  CalendarCheck,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  Clock,
  CreditCard,
  FileText,
  FolderHeart,
  HeartPulse,
  Home as HomeIcon,
  MapPin,
  Pill,
  Receipt,
  Stethoscope,
  Wallet,
} from 'lucide-react';

export type ScreenId =
  | 'appointment'
  | 'records'
  | 'prescription'
  | 'notifications'
  | 'payment'
  | 'homecare'
  | 'followup'
  | 'dashboard';

/** A screen option for the auto-cycling / controlled phone. */
export interface PhoneScreen {
  id: string;
  screen: ScreenId;
  heading: string;
}

interface PhoneMockupProps {
  /** Single static screen (used when `screens` is not provided). */
  screen?: ScreenId;
  heading?: string;
  /** When provided, the phone crossfades through these screens. */
  screens?: PhoneScreen[];
  /** Externally controls which `screens` entry is shown (scroll-driven). */
  controlledId?: string;
  /** Auto-advance interval in ms (ignored when `controlledId` is set). */
  intervalMs?: number;
  /** 'lg' is the large showcase variant (~340px wide on desktop). */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Realistic phone mockup.
 * - If a screenshot exists in `src/assets/screens/{featureId}.{png,jpg,webp…}`
 *   it is shown in a 9:19.5 frame (object-fit: cover); otherwise a stylized
 *   code-built screen is drawn. Screenshots are auto-discovered by feature id.
 */
export function PhoneMockup({
  screen = 'appointment',
  heading = '',
  screens,
  controlledId,
  intervalMs = 4500,
  size = 'md',
  className = '',
}: PhoneMockupProps) {
  const cycler = Boolean(screens && screens.length > 0);
  const options = screens ?? [{ id: 'single', screen, heading }];
  const [index, setIndex] = useState(0);

  const activeIndex = cycler && controlledId ? Math.max(0, options.findIndex((o) => o.id === controlledId)) : index;
  const active = options[activeIndex] ?? options[0];

  useEffect(() => {
    if (!cycler || controlledId) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % options.length), intervalMs);
    return () => window.clearInterval(id);
  }, [cycler, controlledId, options.length, intervalMs]);

  const imageSrc = active ? resolveScreenImage(active.id) : undefined;
  const isImage = Boolean(imageSrc);

  const dims =
    size === 'lg'
      ? { frame: 'w-[300px] rounded-[2.6rem] sm:w-[340px]', border: 'border-[10px] sm:border-[11px]', inner: 'rounded-[2.1rem]' }
      : size === 'sm'
        ? { frame: 'w-[190px] rounded-[2rem] sm:w-[210px]', border: 'border-[8px]', inner: 'rounded-[1.5rem]' }
        : { frame: 'w-[270px] rounded-[2.35rem] sm:w-[290px]', border: 'border-[9px]', inner: 'rounded-[1.85rem]' };

  return (
    <div className="relative">
      {/* Soft colored glow behind the device */}
      <div
        aria-hidden="true"
        className="absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-[#0F6F73]/25 via-[#1FBF9A]/20 to-[#6BE3B2]/25 blur-2xl"
      />

      <div
        role="img"
        aria-label={`Écran de l’application : ${active?.heading ?? ''}`}
        className={`relative mx-auto aspect-[9/19.5] overflow-hidden bg-neutral-900 ${dims.border} ${dims.frame} shadow-[0_40px_90px_-30px_rgba(6,40,44,0.55)] ${className}`}
      >
        {/* Screen */}
        <div className={`relative h-full w-full ${dims.inner} overflow-hidden bg-neutral-50`}>
          <AnimatePresence initial={false}>
            <motion.div
              key={active?.id ?? 'static'}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {isImage ? (
                <img src={imageSrc} alt={active?.heading ?? ''} className="h-full w-full object-cover" loading="lazy" />
              ) : (
                <div className="flex h-full flex-col">
                  {/* Fake status bar */}
                  <div className="flex shrink-0 items-center justify-between bg-white px-4 py-2 text-[11px] font-semibold text-neutral-500">
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" />
                      OmniCare
                    </span>
                    <span className="font-bold text-neutral-800">9:41</span>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto bg-gradient-to-b from-[#1FBF9A]/12 to-neutral-50 px-4 pb-5 pt-3">
                    <ScreenBody screen={active?.screen ?? screen} heading={active?.heading ?? heading} />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Notch */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center pt-2">
            <div className="h-5 w-24 rounded-full bg-neutral-900" />
          </div>
        </div>

        {/* Subtle glass reflection */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-2/5 bg-gradient-to-br from-white/15 via-transparent to-transparent"
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Screenshot discovery: src/assets/screens/<featureId>.<ext>          */
/* ------------------------------------------------------------------ */

type ImgRecord = { default: string };
const SCREEN_SHOTS = import.meta.glob<ImgRecord>('../../assets/screens/**/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
});

function resolveScreenImage(id: string): string | undefined {
  const entry = Object.entries(SCREEN_SHOTS).find(([path]) => {
    const base = path.replace(/\\/g, '/').split('/').pop() ?? '';
    return base.split('.')[0] === id;
  });
  return entry?.[1].default;
}

function ScreenBody({ screen, heading }: { screen: ScreenId; heading: string }) {
  switch (screen) {
    case 'appointment':
      return <AppointmentScreen heading={heading} />;
    case 'records':
      return <RecordsScreen heading={heading} />;
    case 'prescription':
      return <PrescriptionScreen heading={heading} />;
    case 'notifications':
      return <NotificationsScreen heading={heading} />;
    case 'payment':
      return <PaymentScreen heading={heading} />;
    case 'homecare':
      return <HomeCareScreen heading={heading} />;
    case 'followup':
      return <FollowUpScreen heading={heading} />;
    case 'dashboard':
      return <DashboardScreen heading={heading} />;
    default:
      return null;
  }
}

function PhoneHeader({ icon: Icon, title }: { icon: ComponentType<{ className?: string }>; title: string }) {
  return (
    <div className="flex items-center justify-between px-1 pb-3">
      <span className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1FBF9A]/15 text-primary-strong">
          <Icon className="h-3.5 w-3.5" />
        </span>
        <span className="text-xs font-bold text-neutral-800">{title}</span>
      </span>
      <span className="text-[10px] text-neutral-400">•••</span>
    </div>
  );
}

function Avatar({ initials, className = '' }: { initials: string; className?: string }) {
  return (
    <span
      className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#0F6F73] to-[#1FBF9A] text-sm font-bold text-white ${className}`}
    >
      {initials}
    </span>
  );
}

function AppointmentScreen({ heading }: { heading: string }) {
  return (
    <div>
      <PhoneHeader icon={CalendarDays} title={heading} />
      <div className="grid grid-cols-7 gap-1 text-center text-[8px] font-semibold text-neutral-500">
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
        {Array.from({ length: 28 }).map((_, i) => (
          <span
            key={i}
            className={`rounded py-1 ${
              i === 12
                ? 'bg-[#1FBF9A] font-bold text-white'
                : i === 13
                  ? 'bg-[#6BE3B2]/40 font-semibold text-[#0F6F73]'
                  : 'text-neutral-600'
            }`}
          >
            {i + 1}
          </span>
        ))}
      </div>
      <ConfirmCard icon={CalendarCheck} text="Consultation — 14:30" />
    </div>
  );
}

function ConfirmCard({ icon: Icon, text }: { icon: ComponentType<{ className?: string }>; text: string }) {
  return (
    <div className="mt-3 flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-sm">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1FBF9A]/15 text-[#0F6F73]">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="text-[10px] font-semibold text-neutral-700">{text}</span>
      <ChevronRight className="ml-auto h-3 w-3 text-neutral-300" />
    </div>
  );
}

function RecordsScreen({ heading }: { heading: string }) {
  return (
    <div>
      <PhoneHeader icon={FolderHeart} title={heading} />
      <div className="space-y-2">
        <RecordRow icon={ClipboardList} label="Bilan sanguin" sub="Laboratoire" />
        <RecordRow icon={HeartPulse} label="Consultation cardiologue" sub="Dr S. Amri" />
        <RecordRow icon={Pill} label="Traitement antihypertenseur" sub="Ordonnance" />
      </div>
    </div>
  );
}

function RecordRow({
  icon: Icon,
  label,
  sub,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  sub: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-white px-3 py-2.5 shadow-sm">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1FBF9A]/15 text-[#0F6F73]">
        <Icon className="h-4 w-4" />
      </span>
      <span className="flex flex-col">
        <span className="text-[10px] font-bold text-neutral-800">{label}</span>
        <span className="text-[8px] text-neutral-400">{sub}</span>
      </span>
      <ChevronRight className="ml-auto h-3 w-3 text-neutral-300" />
    </div>
  );
}

function PrescriptionScreen({ heading }: { heading: string }) {
  return (
    <div>
      <PhoneHeader icon={FileText} title={heading} />
      <div className="rounded-xl bg-white p-3 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-bold text-neutral-800">Dr R. Ben Salah</span>
          <BadgeCheck className="h-3.5 w-3.5 text-[#1FBF9A]" />
        </div>
        <div className="space-y-1.5">
          {['Augmentin 500mg — 2×/jour', 'Paracétamol — si douleur', 'Vitamine D — 1×/jour'].map((line) => (
            <div key={line} className="flex items-center gap-2 rounded-lg bg-neutral-50 px-2 py-1.5 text-[9px] text-neutral-600">
              <Pill className="h-3 w-3 text-primary-strong" /> {line}
            </div>
          ))}
        </div>
        <div className="mt-2.5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[7px] uppercase text-neutral-400">Code</span>
            <span className="text-[10px] font-bold tracking-widest text-[#0F6F73]">RX-2048-K</span>
          </div>
          <Receipt className="h-4 w-4 text-[#1FBF9A]" />
        </div>
      </div>
    </div>
  );
}

function NotificationsScreen({ heading }: { heading: string }) {
  return (
    <div>
      <PhoneHeader icon={Bell} title={heading} />
      <div className="space-y-2">
        {[
          { icon: CalendarCheck, color: 'text-primary-strong bg-[#1FBF9A]/15', text: 'Consultation dans 2 heures', sub: 'Aujourd’hui — 14:30' },
          { icon: Pill, color: 'text-primary-strong bg-[#1FBF9A]/15', text: 'Rappel : prendre votre traitement', sub: 'Ce matin' },
          { icon: Stethoscope, color: 'text-primary-strong bg-[#1FBF9A]/15', text: 'Nouveau message de Dr S. Amri', sub: 'Hier' },
        ].map((n, i) => (
          <div key={i} className="flex items-center gap-2.5 rounded-xl bg-white px-3 py-2.5 shadow-sm">
            <span className={`flex h-8 w-8 items-center justify-center rounded-full ${n.color}`}>
              <n.icon className="h-4 w-4" />
            </span>
            <span className="flex flex-col">
              <span className="text-[10px] font-bold text-neutral-800">{n.text}</span>
              <span className="text-[8px] text-neutral-400">{n.sub}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PaymentScreen({ heading }: { heading: string }) {
  return (
    <div>
      <PhoneHeader icon={CreditCard} title={heading} />
      <div className="mb-2 rounded-2xl bg-gradient-to-br from-[#0F6F73] to-[#1FBF9A] p-3 text-white">
        <div className="text-[8px] uppercase tracking-wide text-white/70">Paiement</div>
        <div className="mt-1 text-lg font-bold tracking-wider">•••• 4242</div>
        <div className="mt-1 flex justify-between text-[8px] text-white/80">
          <span>SARRA AHMED</span>
          <span>09/28</span>
        </div>
      </div>
      <div className="space-y-2">
        <PayRow icon={Wallet} label="Consultation médicale" amount="— 45 DT" />
        <PayRow icon={HomeIcon} label="Visite à domicile" amount="— 60 DT" />
      </div>
      <div className="mt-2 flex items-center gap-2 rounded-xl bg-success/10 px-3 py-2">
        <BadgeCheck className="h-4 w-4 text-success" /> Paiement sécurisé
      </div>
    </div>
  );
}

function PayRow({
  icon: Icon,
  label,
  amount,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  amount: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-white px-3 py-2 shadow-sm">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1FBF9A]/15 text-[#0F6F73]">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="text-[10px] font-semibold text-neutral-700">{label}</span>
      <span className="ml-auto text-[10px] font-bold text-neutral-800">{amount}</span>
    </div>
  );
}

function HomeCareScreen({ heading }: { heading: string }) {
  return (
    <div>
      <PhoneHeader icon={HomeIcon} title={heading} />
      <div className="mb-2 flex items-center gap-2.5 rounded-xl bg-white px-3 py-2.5 shadow-sm">
        <Avatar initials="ST" className="h-9 w-9 text-[10px]" />
        <span className="flex flex-col">
          <span className="text-[10px] font-bold text-neutral-800">Samir Trabelsi, infirmier</span>
          <span className="text-[8px] text-neutral-400">Profil vérifié</span>
        </span>
        <BadgeCheck className="ml-auto h-3.5 w-3.5 text-[#1FBF9A]" />
      </div>
      <div className="rounded-xl bg-white p-3 shadow-sm">
        <div className="mb-1 text-[9px] font-semibold text-neutral-500">Arrivée estimée dans 25 min</div>
        <div className="flex items-center justify-between">
          {[0, 1, 2, 3].map((s) => (
            <span key={s} className="h-1 w-12 rounded-full bg-[#6BE3B2]" />
          ))}
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[9px] text-neutral-500">
          <MapPin className="h-3 w-3 text-primary-strong" /> Lac 2, Tunis
        </div>
      </div>
    </div>
  );
}

function FollowUpScreen({ heading }: { heading: string }) {
  return (
    <div>
      <PhoneHeader icon={Activity} title={heading} />
      <div className="flex items-end gap-1 rounded-xl bg-white px-3 pb-2 pt-4 shadow-sm">
        {[40, 55, 45, 70, 62, 80, 74].map((h, i) => (
          <div
            key={i}
            style={{ height: `${h * 0.7}px` }}
            className={`flex-1 rounded-t ${i === 5 ? 'bg-[#1FBF9A]' : 'bg-[#6BE3B2]/60'}`}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 shadow-sm">
        <HeartPulse className="h-4 w-4 text-error" />
        <span className="flex flex-col">
          <span className="text-[9px] text-neutral-400">Tension artérielle</span>
          <span className="text-[11px] font-bold text-neutral-800">12 / 7.5 — stable</span>
        </span>
      </div>
    </div>
  );
}

function DashboardScreen({ heading }: { heading: string }) {
  return (
    <div>
      <PhoneHeader icon={Stethoscope} title={heading} />
      <div className="grid grid-cols-2 gap-2">
        {[
          { icon: CalendarDays, label: 'Rendez-vous', value: '12' },
          { icon: FileText, label: 'Dossiers', value: '38' },
          { icon: HeartPulse, label: 'Patients', value: '210' },
          { icon: Clock, label: 'Disponible', value: 'Oui' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-white p-2.5 shadow-sm">
            <s.icon className="mb-1 h-4 w-4 text-[#0F6F73]" />
            <div className="text-sm font-bold text-neutral-800">{s.value}</div>
            <div className="text-[8px] text-neutral-400">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-sm">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1FBF9A]/15">
          <FileText className="h-4 w-4 text-[#0F6F73]" />
        </span>
        <span className="flex flex-col">
          <span className="text-[10px] font-bold text-neutral-800">Ordonnance à valider</span>
          <span className="text-[8px] text-neutral-400">Il y a 5 min</span>
        </span>
      </div>
    </div>
  );
}