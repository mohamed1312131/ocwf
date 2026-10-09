import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Link } from 'react-router';
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Bone,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Stethoscope,
  Syringe,
  UserPlus,
} from 'lucide-react';
import { usePreInscription } from '../context/PreInscriptionContext';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { StepIndicator } from '../components/form/StepIndicator';
import { Field, inputClass } from '../components/form/Field';
import { RadioCards, type RadioOption } from '../components/form/RadioCards';

type Profession = 'medecin' | 'infirmier' | 'psychologue' | 'kinesitherapeute';

const TOTAL_STEPS = 4;

interface FormState {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  profession: Profession | '';
  /** UI-only fields — never sent to the API (see submit). */
  orderNumber: string; // TODO: send this field if the backend ever supports licence numbers.
  city: string; // TODO: send this field if the backend ever supports location.
}

const INITIAL_FORM: FormState = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  email: '',
  phone: '',
  profession: '',
  orderNumber: '',
  city: '',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function PreInscription() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const { addPreInscription } = usePreInscription();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  useDocumentMeta({ title: t('preInscription.title'), description: t('preInscription.metaDescription') });

  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  const professions: RadioOption[] = [
    { value: 'medecin', label: t('preInscription.doctor'), icon: Stethoscope },
    { value: 'infirmier', label: t('preInscription.nurse'), icon: Syringe },
    { value: 'psychologue', label: t('preInscription.psychologist'), icon: Brain },
    { value: 'kinesitherapeute', label: t('preInscription.physiotherapist'), icon: Bone },
  ];

  const stepTitles = [
    t('preInscription.steps.identity'),
    t('preInscription.steps.profession'),
    t('preInscription.steps.contact'),
    t('preInscription.steps.review'),
  ];

  const stepTitlesInner = {
    0: t('preInscription.identityTitle'),
    1: t('preInscription.professionTitle'),
    2: t('preInscription.contactTitle'),
    3: t('preInscription.reviewTitle'),
  };
  const stepSubtitles = {
    0: t('preInscription.identitySubtitle'),
    1: t('preInscription.professionSubtitle'),
    2: t('preInscription.contactSubtitle'),
    3: t('preInscription.reviewSubtitle'),
  };

  // ---- validation -----------------------------------------------------------
  function validateIdentity() {
    const errs: Record<string, string> = {};
    if (!form.firstName.trim()) errs.firstName = t('preInscription.required');
    if (!form.lastName.trim()) errs.lastName = t('preInscription.required');
    if (!form.dateOfBirth) {
      errs.dateOfBirth = t('preInscription.required');
    } else if (new Date(form.dateOfBirth) > new Date()) {
      errs.dateOfBirth = t('preInscription.invalidDateOfBirth');
    }
    return errs;
  }

  function validateProfession() {
    return form.profession ? {} : { profession: t('preInscription.required') };
  }

  function validateContact() {
    const errs: Record<string, string> = {};
    if (!form.email.trim() || !EMAIL_RE.test(form.email.trim())) errs.email = t('preInscription.invalidEmail');
    const digits = form.phone.replace(/[^+\d]/g, '');
    if (!/^\+?\d{8,15}$/.test(digits)) errs.phone = t('preInscription.invalidPhone');
    return errs;
  }

  const validateStep = (s: number): Record<string, string> => {
    if (s === 0) return validateIdentity();
    if (s === 1) return validateProfession();
    if (s === 2) return validateContact();
    return {};
  };

  // ---- navigation -----------------------------------------------------------
  const goTo = (next: number) => {
    setErrors({});
    setStep(next);
  };

  const handleNext = () => {
    const errs = validateStep(step);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    goTo(step + 1);
  };

  const handleBack = () => goTo(step - 1);

  // ---- submit ---------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot: real users never see this field — silently drop bot submissions.
    if (honeypotRef.current?.value) {
      setIsSubmitted(true);
      return;
    }

    const errs = { ...validateIdentity(), ...validateProfession(), ...validateContact() };
    if (!consent) errs.consent = t('preInscription.consentRequired');
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      // Only the API-supported fields are sent. orderNumber & city stay local.
      await addPreInscription({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        dateOfBirth: form.dateOfBirth,
        email: form.email.trim(),
        phone: form.phone.trim(),
        profession: form.profession as Profession,
      });
      setIsSubmitted(true);
    } catch (error) {
      toast.error(t('preInscription.error'));
      console.error('Submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key as string]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  if (isSubmitted) {
    return <SuccessScreen />;
  }

  return (
    <div className="bg-mist px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">{t('preInscription.title')}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-text-secondary">{t('preInscription.subtitle')}</p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="hidden lg:block">
            <SidePanel />
          </aside>

          <div className="max-w-2xl">
            <StepIndicator steps={stepTitles} current={step} onStepClick={goTo} labels={{ aria: t('common.step') }} />

            <div className="mt-6 rounded-3xl bg-white p-6 shadow-card sm:p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, x: -24 }}
                  transition={{ duration: reduce ? 0.001 : 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h2 ref={headingRef} tabIndex={-1} className="text-xl font-bold text-text-primary outline-none">
                    {stepTitlesInner[step as keyof typeof stepTitlesInner]}
                  </h2>
                  <p className="mt-1 text-text-secondary">{stepSubtitles[step as keyof typeof stepSubtitles]}</p>

                  <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-6">
                    {/* Honeypot — invisible to humans */}
                    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                      <label htmlFor="company_website">Website</label>
                      <input ref={honeypotRef} id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
                    </div>

                    {step === 0 ? <IdentityStep form={form} errors={errors} set={set} t={t} /> : null}
                    {step === 1 ? (
                      <>
                        <RadioCards
                          name="profession"
                          legend={t('preInscription.profession')}
                          options={professions}
                          value={form.profession}
                          onChange={(v) => set('profession', v as Profession)}
                          error={errors.profession}
                        />
                        <UiOnlyFields form={form} errors={errors} set={set} t={t} />
                      </>
                    ) : null}
                    {step === 2 ? <ContactStep form={form} errors={errors} set={set} t={t} /> : null}
                    {step === 3 ? (
                      <ReviewStep form={form} consent={consent} setConsent={setConsent} error={errors.consent} t={t} />
                    ) : null}

                    <div className="flex items-center justify-between gap-3 pt-2">
                      {step > 0 ? (
                        <button
                          type="button"
                          onClick={handleBack}
                          className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 font-semibold text-text-primary transition hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
                          {t('common.back')}
                        </button>
                      ) : (
                        <span />
                      )}

                      {step < TOTAL_STEPS - 1 ? (
                        <button
                          type="button"
                          onClick={handleNext}
                          className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3 font-semibold text-white transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          {t('common.next')}
                          <ArrowRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={submitting}
                          className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3 font-semibold text-white transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                          {t('common.submitRequest')}
                        </button>
                      )}
                    </div>
                  </form>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-6 rounded-2xl bg-white p-4 text-center shadow-soft lg:hidden">
              <p className="text-sm text-text-secondary">{t('preInscription.privacyNote')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step bodies
// ---------------------------------------------------------------------------

function IdentityStep({
  form,
  errors,
  set,
  t,
}: {
  form: FormState;
  errors: Record<string, string>;
  set: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  t: (key: string) => string;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field id="firstName" label={t('preInscription.firstName')} required error={errors.firstName}>
        <input
          id="firstName"
          name="firstName"
          type="text"
          value={form.firstName}
          onChange={(e) => set('firstName', e.target.value)}
          className={inputClass(!!errors.firstName)}
          aria-invalid={!!errors.firstName}
          aria-describedby={errors.firstName ? 'firstName-error' : undefined}
          autoComplete="given-name"
        />
      </Field>
      <Field id="lastName" label={t('preInscription.lastName')} required error={errors.lastName}>
        <input
          id="lastName"
          name="lastName"
          type="text"
          value={form.lastName}
          onChange={(e) => set('lastName', e.target.value)}
          className={inputClass(!!errors.lastName)}
          aria-invalid={!!errors.lastName}
          aria-describedby={errors.lastName ? 'lastName-error' : undefined}
          autoComplete="family-name"
        />
      </Field>
      <Field id="dateOfBirth" label={t('preInscription.dateOfBirth')} required error={errors.dateOfBirth}>
        <input
          id="dateOfBirth"
          name="dateOfBirth"
          type="date"
          value={form.dateOfBirth}
          onChange={(e) => set('dateOfBirth', e.target.value)}
          className={inputClass(!!errors.dateOfBirth)}
          aria-invalid={!!errors.dateOfBirth}
          aria-describedby={errors.dateOfBirth ? 'dateOfBirth-error' : undefined}
          max={new Date().toISOString().split('T')[0]}
        />
      </Field>
    </div>
  );
}

/** UI-only fields (licence number + city). Never part of the API payload. */
function UiOnlyFields({
  form,
  errors,
  set,
  t,
}: {
  form: FormState;
  errors: Record<string, string>;
  set: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  t: (key: string) => string;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field id="orderNumber" label={t('preInscription.orderNumber')} hint={t('preInscription.orderNumberHint')}>
        <input
          id="orderNumber"
          name="orderNumber"
          type="text"
          inputMode="numeric"
          value={form.orderNumber}
          onChange={(e) => set('orderNumber', e.target.value)}
          className={inputClass(!!errors.orderNumber)}
          placeholder={t('preInscription.orderNumberPlaceholder')}
        />
      </Field>
      <Field id="city" label={t('preInscription.city')} hint={t('preInscription.cityHint')}>
        <input
          id="city"
          name="city"
          type="text"
          value={form.city}
          onChange={(e) => set('city', e.target.value)}
          className={inputClass(!!errors.city)}
          placeholder={t('preInscription.cityPlaceholder')}
        />
      </Field>
    </div>
  );
}

function ContactStep({
  form,
  errors,
  set,
  t,
}: {
  form: FormState;
  errors: Record<string, string>;
  set: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  t: (key: string) => string;
}) {
  return (
    <div className="grid gap-5">
      <Field id="email" label={t('preInscription.email')} required error={errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={(e) => set('email', e.target.value)}
          className={inputClass(!!errors.email)}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          autoComplete="email"
          placeholder="exemple@omnicare.tn"
        />
      </Field>
      <Field id="phone" label={t('preInscription.phone')} required error={errors.phone}>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={(e) => set('phone', e.target.value)}
          className={inputClass(!!errors.phone)}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
          autoComplete="tel"
          placeholder="+216 12 345 678"
        />
      </Field>
    </div>
  );
}

function ReviewStep({
  form,
  consent,
  setConsent,
  error,
  t,
}: {
  form: FormState;
  consent: boolean;
  setConsent: (v: boolean) => void;
  error?: string;
  t: (key: string) => string;
}) {
  const rows: [string, string][] = [
    [t('preInscription.firstName'), form.firstName],
    [t('preInscription.lastName'), form.lastName],
    [t('preInscription.dateOfBirth'), form.dateOfBirth],
    [t('preInscription.profession'), t(`preInscription.${form.profession}`)],
    [t('preInscription.email'), form.email],
    [t('preInscription.phone'), form.phone],
  ];
  if (form.orderNumber) rows.push([t('preInscription.orderNumber'), form.orderNumber]);
  if (form.city) rows.push([t('preInscription.city'), form.city]);

  return (
    <>
      <dl className="divide-y divide-border rounded-2xl border border-border">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 px-4 py-3">
            <dt className="text-sm text-text-secondary">{label}</dt>
            <dd className="text-right font-semibold text-text-primary">{value || '—'}</dd>
          </div>
        ))}
      </dl>

      <div className={error ? 'space-y-1' : 'space-y-1'}>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-text-primary">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded accent-[#1FBF9A]"
            aria-invalid={!!error}
            aria-describedby={error ? 'consent-error' : undefined}
          />
          <span>{t('preInscription.consent')}</span>
        </label>
        {error ? (
          <p id="consent-error" role="alert" className="text-sm font-medium text-error">
            {error}
          </p>
        ) : null}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Side panel + success screen
// ---------------------------------------------------------------------------

function SidePanel() {
  const { t } = useTranslation();
  const benefits = [
    'home.showcase.professionals.morePatients.title',
    'home.showcase.professionals.flexibleSchedule.title',
    'home.showcase.professionals.managementTools.title',
    'home.showcase.professionals.dedicatedSupport.title',
  ];

  return (
    <div className="sticky top-24 space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-card">
        <h3 className="mb-4 text-lg font-bold text-text-primary">{t('preInscription.benefitsTitle')}</h3>
        <ul className="space-y-3">
          {benefits.map((b) => (
            <li key={b} className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 shrink-0 text-primary-strong" aria-hidden="true" />
              <span className="text-text-primary">{t(b)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-3xl bg-[#0F6F73] p-6 text-white shadow-card">
        <h3 className="mb-5 text-lg font-bold">{t('home.pro.onboardingTitle')}</h3>
        <ol className="space-y-4">
          {[1, 2, 3, 4].map((n) => (
            <li key={n} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#6BE3B2] text-xs font-bold text-[#0F6F73]">
                {n}
              </span>
              <span className="text-sm text-white/90">{t(`home.how.professionals.step${n}.title`)}</span>
            </li>
          ))}
        </ol>
        <Link
          to="/fonctionnalites"
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#6BE3B2] hover:text-white"
        >
          {t('preInscription.learnMore')}
          <ArrowRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
        </Link>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-card">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1FBF9A]/15 text-primary-strong">
            <UserPlus className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="text-sm leading-relaxed text-text-secondary">{t('preInscription.privacyNote')}</p>
        </div>
      </div>
    </div>
  );
}

function SuccessScreen() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();

  useDocumentMeta({ title: t('preInscription.successTitle'), description: t('preInscription.successMessage') });

  return (
    <div className="flex min-h-screen items-center justify-center bg-mist px-4 pb-24 pt-28 sm:px-6">
      <div className="w-full max-w-xl rounded-3xl bg-white p-10 text-center shadow-card sm:p-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: reduce ? 'tween' : 'spring', stiffness: 220, damping: 14, duration: reduce ? 0.001 : 0.5 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#1FBF9A] to-[#6BE3B2]"
        >
          <CheckCircle2 className="h-11 w-11 text-white" aria-hidden="true" />
        </motion.div>

        <h1 className="text-3xl font-bold text-text-primary">{t('preInscription.successTitle')}</h1>
        <p className="mt-4 text-lg leading-relaxed text-text-secondary">{t('preInscription.successMessage')}</p>
        <p className="mt-2 text-sm text-text-secondary">{t('preInscription.securityNote')}</p>

        <div className="mt-8 rounded-2xl bg-[#F4F5F7] p-4 text-sm text-text-secondary">
          <p>{t('preInscription.consentReceipt')}</p>
        </div>

        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-semibold text-white transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {t('preInscription.backHome')}
        </Link>
      </div>
    </div>
  );
}