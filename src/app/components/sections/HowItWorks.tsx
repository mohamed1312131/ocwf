import { Download, UserPlus, ShieldCheck, KeyRound, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Section } from '../Section';
import { EASE, VIEWPORT } from '../../../lib/motion';

type Step = { icon: LucideIcon; titleKey: string; descKey: string };

export function HowItWorks() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();

  const patientSteps: Step[] = [
    { icon: Download, titleKey: 'home.how.patients.step1.title', descKey: 'home.how.patients.step1.description' },
    { icon: UserPlus, titleKey: 'home.how.patients.step2.title', descKey: 'home.how.patients.step2.description' },
    { icon: ArrowRight, titleKey: 'home.how.patients.step3.title', descKey: 'home.how.patients.step3.description' },
  ];

  const proSteps: Step[] = [
    { icon: UserPlus, titleKey: 'home.how.professionals.step1.title', descKey: 'home.how.professionals.step1.description' },
    { icon: ShieldCheck, titleKey: 'home.how.professionals.step2.title', descKey: 'home.how.professionals.step2.description' },
    { icon: Download, titleKey: 'home.how.professionals.step3.title', descKey: 'home.how.professionals.step3.description' },
    { icon: KeyRound, titleKey: 'home.how.professionals.step4.title', descKey: 'home.how.professionals.step4.description' },
  ];

  return (
    <Section id="comment-ca-marche" className="relative overflow-hidden bg-ink py-28 text-white lg:py-32">
      <MeshBackground />

      <div className="relative z-10 mx-auto max-w-[1200px]">
        <div className="flex flex-col items-center gap-4 text-center xl:items-start xl:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-base font-semibold backdrop-blur">
            {t('home.how.eyebrow')}
          </span>
          <h2 className="text-balance text-4xl font-bold leading-tight sm:text-5xl">{t('home.how.title')}</h2>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/85 sm:text-xl xl:mx-0">{t('home.how.subtitle')}</p>
        </div>

        <div className="mt-16 grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <h3 className="mb-8 text-2xl font-bold text-white lg:text-left">{t('home.how.patientsTitle')}</h3>
            <Timeline steps={patientSteps} />
          </div>
          <div>
            <h3 className="mb-8 text-2xl font-bold text-white lg:text-left">{t('home.how.professionalsTitle')}</h3>
            <Timeline steps={proSteps} />
          </div>
        </div>
      </div>
    </Section>
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
        className="w-16 shrink-0 select-none text-right text-6xl font-extrabold leading-none tracking-tight text-transparent sm:w-20"
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