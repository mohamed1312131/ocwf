import { useState } from 'react';
import { Mail, MapPin, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { contactAPI } from '../../services/api';
import { PageHero } from '../components/PageHero';
import { Section } from '../components/Section';
import { SectionHeading } from '../components/SectionHeading';
import { Accordion } from '../components/Accordion';
import type { AccordionItem } from '../components/Accordion';
import { Field, inputClass } from '../components/form/Field';
import { Reveal } from '../components/motion/Reveal';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { CONTACT_EMAIL } from '../../config/appLinks';

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Contact() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const [form, setForm] = useState<ContactForm>({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useDocumentMeta({ title: t('contact.metaTitle'), description: t('contact.metaDescription') });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error(t('contact.fillAll'));
      return;
    }
    if (!EMAIL_RE.test(form.email.trim())) {
      toast.error(t('contact.invalidEmail'));
      return;
    }

    try {
      await contactAPI.create({ name: form.name, email: form.email, message: form.message });
      setIsSubmitted(true);
      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error(t('contact.error'));
      console.error('Contact submission error:', error);
    }
  };

  const set = (key: keyof ContactForm, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mist px-4 pb-24 pt-36">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduce ? 0.001 : 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-xl rounded-3xl bg-white p-10 text-center shadow-card sm:p-12"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#1FBF9A] to-[#6BE3B2]">
            <Mail className="h-10 w-10 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary">{t('contact.success')}</h1>
          <p className="mt-4 text-lg leading-relaxed text-text-secondary">{t('contact.successMessage')}</p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={() => setIsSubmitted(false)}
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-7 py-3.5 font-semibold text-white transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {t('contact.sendAnother')}
            </button>
            <Link
              to="/"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border px-7 py-3.5 font-semibold text-text-primary transition hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t('preInscription.backHome')}
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const faqItems = t('contact.faq.items', { returnObjects: true }) as AccordionItem[];
  const infoCards = [
    { icon: Mail, title: t('contact.email'), content: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
    { icon: MessageSquare, title: t('contact.customerSupport'), content: t('contact.supportHours'), href: null },
    { icon: MapPin, title: t('contact.location'), content: 'Tunis, Tunisie', href: null },
  ];

  return (
    <>
      <PageHero eyebrow={t('contact.heroBadge')} title={t('contact.title')} subtitle={t('contact.subtitle')} />

      <Section className="bg-mist py-28 lg:py-32">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Info */}
          <div className="space-y-5">
            <SectionHeading
              align="left"
              eyebrow={t('contact.contactInfo')}
              title={t('contact.contactInfoDesc')}
              className="mb-8"
            />
            {infoCards.map((info, i) => (
              <Reveal key={info.title} delay={i * 0.06}>
                <div className="flex items-start gap-4 rounded-3xl bg-white p-6 shadow-soft">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1FBF9A]/15 text-primary-strong">
                    <info.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div>
                    <div className="font-semibold text-text-primary">{info.title}</div>
                    {info.href ? (
                      <a href={info.href} className="mt-1 block text-text-secondary underline-offset-2 hover:underline">
                        {info.content}
                      </a>
                    ) : (
                      <p className="mt-1 text-text-secondary">{info.content}</p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Form */}
          <Reveal delay={0.06}>
            <form onSubmit={handleSubmit} noValidate className="rounded-[2rem] bg-white p-6 shadow-[0_36px_80px_-40px_rgba(15,111,115,0.45)] sm:p-10">
              <h2 className="text-xl font-bold text-text-primary">{t('contact.formTitle')}</h2>
              <p className="mt-1 text-text-secondary">{t('contact.formSubtitle')}</p>

              <div className="mt-7 space-y-5">
                <Field id="name" label={t('contact.name')} required>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    className={inputClass(false)}
                    placeholder="Jean Dupont"
                    autoComplete="name"
                  />
                </Field>
                <Field id="email" label={t('contact.email')} required>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    className={inputClass(false)}
                    placeholder="jean.dupont@exemple.tn"
                    autoComplete="email"
                  />
                </Field>
                <Field id="message" label={t('contact.message')} required>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={form.message}
                    onChange={(e) => set('message', e.target.value)}
                    className={`${inputClass(false)} resize-none`}
                    placeholder={t('contact.messagePlaceholder')}
                  />
                </Field>
              </div>

              <button
                type="submit"
                className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-primary px-7 py-3.5 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {t('contact.send')}
              </button>
            </form>
          </Reveal>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="bg-white py-28 lg:py-32">
        <SectionHeading eyebrow={t('home.faq.eyebrow')} title={t('contact.faq.title')} subtitle={t('contact.faq.subtitle')} />
        <div className="mx-auto mt-12 max-w-3xl">
          <Reveal>
            <Accordion items={faqItems} />
          </Reveal>
        </div>
      </Section>
    </>
  );
}