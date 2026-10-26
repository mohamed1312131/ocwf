import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Download, UserPlus, ShieldCheck, KeyRound, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Tabs } from '../Tabs';
import { Photo } from '../Photo';
import { EASE, VIEWPORT } from '../../../lib/motion';

type Step = { icon: LucideIcon; titleKey: string; descKey: string };

const PATIENT_STEPS: Step[] = [
  { icon: Download, titleKey: 'home.how.patients.step1.title', descKey: 'home.how.patients.step1.description' },
  { icon: UserPlus, titleKey: 'home.how.patients.step2.title', descKey: 'home.how.patients.step2.description' },
  { icon: ArrowRight, titleKey: 'home.how.patients.step3.title', descKey: 'home.how.patients.step3.description' },
];

const PRO_STEPS: Step[] = [
  { icon: UserPlus, titleKey: 'home.how.professionals.step1.title', descKey: 'home.how.professionals.step1.description' },
  { icon: ShieldCheck, titleKey: 'home.how.professionals.step2.title', descKey: 'home.how.professionals.step2.description' },
  { icon: Download, titleKey: 'home.how.professionals.step3.title', descKey: 'home.how.professionals.step3.description' },
  { icon: KeyRound, titleKey: 'home.how.professionals.step4.title', descKey: 'home.how.professionals.step4.description' },
];

export function HowItWorksSlide() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const rawId = useId();
  const idPrefix = rawId.replace(/:/g, '');
  const [tab, setTab] = useState<'patients' | 'professionals'>('patients');

  const steps = tab === 'patients' ? PATIENT_STEPS : PRO_STEPS;

  return (
    <div className="mx-auto w-full max-w-[1200px] px-6 py-10 sm:px-8 lg:px-10 lg:py-14">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-ink text-white shadow-elevated">
        <MeshBackground />

        <div className="relative z-10 mx-auto max-w-[1100px] px-5 py-14 sm:px-8 lg:py-16">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-base font-semibold backdrop-blur">
            {t('home.how.eyebrow')}
          </span>
          <h2 className="text-balance text-4xl font-bold leading-tight sm:text-5xl">{t('home.how.title')}</h2>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/85 sm:text-xl">{t('home.how.subtitle')}</p>
        </div>

        <div className="mt-10 flex justify-center">
          <Tabs
            idPrefix={idPrefix}
            ariaLabel={t('home.how.title')}
            tabs={[
              { id: 'patients', label: t('home.how.patientsTitle') },
              { id: 'professionals', label: t('home.how.professionalsTitle') },
            ]}
            active={tab}
            onChange={(id) => setTab(id as 'patients' | 'professionals')}
          />
        </div>

        <div className={`mt-12 grid gap-12 ${tab === 'professionals' ? 'lg:grid-cols-[1fr_360px] lg:gap-16' : ''}`}>
          <div className={tab === 'professionals' ? '' : 'mx-auto w-full max-w-3xl'}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={tab}
                role="tabpanel"
                id={`${idPrefix}-panel-${tab}`}
                aria-labelledby={`${idPrefix}-tab-${tab}`}
                initial={reduce ? { opacity: 0.001 } : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0.001 } : { opacity: 0, y: -12 }}
                transition={{ duration: reduce ? 0.001 : 0.4, ease: EASE }}
              >
                <Timeline steps={steps} />
              </motion.div>
            </AnimatePresence>
          </div>

          {tab === 'professionals' ? (
            <motion.div
              initial={reduce ? { opacity: 0.001 } : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: reduce ? 0.001 : 0.5, ease: EASE, delay: reduce ? 0 : 0.1 }}
              className="mx-auto w-full max-w-sm lg:max-w-none"
            >
              <Photo
                id="pro-nurse"
                altKey="photos.proNurse"
                className="aspect-[4/5] rounded-3xl border border-white/10 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.8)]"
                imgClassName="object-[50%_25%]"
              />
            </motion.div>
          ) : null}
        </div>
      </div>
      </div>
      </div>
  );
}

/** Rotating conic mesh + blurred blobs on the one dark teal section. */
function MeshBackground() {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute left-1/2 top-1/2 h-[160%] w-[160%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(from_20deg,#06282C,#0F6F73,#1FBF9A,#2C3E3E,#06282C)] opacity-40 blur-3xl"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
      />
      <div className="absolute -left-24 top-16 h-80 w-80 rounded-full bg-[#6BE3B2]/20 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-[#1FBF9A]/20 blur-3xl" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-transparent to-[#06282C]/90" />
    </div>
  );
}

/** Vertical timeline: big outline numbers + self-drawing connector line. */
function Timeline({ steps }: { steps: Step[] }) {
  const reduce = useReducedMotion();

  return (
    <div className="relative">
      {/* Skeleton rail */}
      <div
        aria-hidden="true"
        className="absolute bottom-10 start-6 top-2 w-px -translate-x-1/2 bg-gradient-to-b from-[#6BE3B2]/60 to-transparent opacity-30"
      />

      {/* Self-drawing rail */}
      <motion.div
        aria-hidden="true"
        className="absolute bottom-10 start-6 top-2 w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#6BE3B2] to-[#1FBF9A] shadow-[0_0_18px_rgba(107,227,178,0.7)]"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={VIEWPORT}
        style={{ originY: 0 }}
        transition={{ duration: reduce ? 0.001 : 1.4, ease: EASE }}
      />

      <div className="space-y-8">
        {steps.map((step, i) => (
          <StepCard key={step.titleKey} step={step} index={i + 1} />
        ))}
      </div>
    </div>
  );
}

function StepCard({ step, index }: { step: Step; index: number }) {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.6, ease: EASE, delay: index * 0.1 }}
      className="group relative flex items-center gap-6"
    >
      {/* Outline number */}
      <span
        className="w-16 shrink-0 select-none text-end text-6xl font-extrabold leading-none tracking-tight text-transparent sm:w-20"
        style={{ WebkitTextStroke: '1.5px rgba(107,227,178,0.45)' }}
      >
        {String(index).padStart(2, '0')}
      </span>

      <div className="flex flex-1 flex-col gap-2 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur transition-colors group-hover:border-white/25 sm:p-6">
        <span className="flex items-center gap-2 text-[#6BE3B2]">
          <step.icon className="h-5 w-5" aria-hidden="true" />
          <span className="text-lg font-semibold text-white">{t(step.titleKey)}</span>
        </span>
        <span className="text-base leading-relaxed text-white/80">{t(step.descKey)}</span>
      </div>
    </motion.div>
  );
}
