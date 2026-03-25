import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Turnstile } from '@marsidev/react-turnstile';
import { TURNSTILE_SITE_KEY } from '../../config/turnstile';
import { contactAPI } from '../../services/api';

export function Contact() {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error(t('contact.fillAll'));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error(t('contact.invalidEmail'));
      return;
    }

    // Captcha validation
    if (!captchaToken) {
      toast.error(t('contact.captchaError'));
      return;
    }

    try {
      await contactAPI.create({
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });
      setIsSubmitted(true);
      toast.success(t('contact.success'));
    } catch (error) {
      toast.error(t('contact.error'));
      console.error('Contact submission error:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: t('contact.email'),
      content: 'contact@omnicare.tn',
      href: 'mailto:contact@omnicare.tn',
    },
    {
      icon: Phone,
      title: t('contact.phone'),
      content: '+216 12 345 678',
      href: 'tel:+21612345678',
    },
    {
      icon: MapPin,
      title: t('contact.location'),
      content: 'Tunis, Tunisie',
      href: null,
    },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-[#F4F5F7]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl w-full bg-white rounded-3xl p-12 shadow-xl text-center"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1FBF9A] to-[#6BE3B2] flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#1A202C] mb-4">
            {t('contact.success')}
          </h1>
          <p className="text-lg text-[#718096] mb-8 leading-relaxed">
            {t('contact.successMessage')}
          </p>
          <a
            href="/contact"
            onClick={(e) => {
              e.preventDefault();
              setIsSubmitted(false);
              setFormData({ name: '', email: '', message: '' });
            }}
            className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-[#1FBF9A] to-[#6BE3B2] text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#1FBF9A]/30 hover:-translate-y-0.5"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            {t('contact.sendAnother')}
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#0F6F73] via-[#1FBF9A] to-[#6BE3B2]">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              {t('contact.title')}
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              {t('contact.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F4F5F7]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#1A202C] mb-4">
                  {t('contact.contactInfo')}
                </h2>
                <p className="text-[#718096] leading-relaxed mb-6">
                  {t('contact.contactInfoDesc')}
                </p>
              </div>

              {contactInfo.map((info) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1FBF9A] to-[#6BE3B2] flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1A202C] mb-1">{info.title}</h3>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-[#718096] hover:text-[#1FBF9A] transition-colors"
                        >
                          {info.content}
                        </a>
                      ) : (
                        <p className="text-[#718096]">{info.content}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Additional Info */}
              <div className="bg-gradient-to-r from-[#1FBF9A]/10 to-[#6BE3B2]/10 border border-[#1FBF9A]/20 rounded-2xl p-6">
                <MessageSquare className="w-8 h-8 text-[#1FBF9A] mb-3" />
                <h3 className="font-bold text-[#1A202C] mb-2">{t('contact.customerSupport')}</h3>
                <p className="text-sm text-[#718096] leading-relaxed">
                  {t('contact.supportHours')}
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl"
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-[#1A202C] mb-3">
                    {t('contact.title')}
                  </h2>
                  <p className="text-[#718096] leading-relaxed">
                    {t('contact.formSubtitle')}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-[#1A202C] mb-2">
                      {t('contact.name')} <span className="text-[#EF4444]">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FBF9A] focus:border-transparent transition-all"
                      placeholder="Jean Dupont"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-[#1A202C] mb-2">
                      {t('contact.email')} <span className="text-[#EF4444]">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FBF9A] focus:border-transparent transition-all"
                      placeholder="jean.dupont@exemple.tn"
                      required
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-[#1A202C] mb-2">
                      {t('contact.message')} <span className="text-[#EF4444]">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FBF9A] focus:border-transparent transition-all resize-none"
                      placeholder="Écrivez votre message ici..."
                      required
                    />
                  </div>

                  {/* Captcha */}
                  <div className="mt-4">
                    <Turnstile
                      siteKey={TURNSTILE_SITE_KEY}
                      onVerify={(token: string) => setCaptchaToken(token)}
                      onError={() => setCaptchaToken(null)}
                      onExpire={() => setCaptchaToken(null)}
                      options={{
                        theme: 'light',
                        size: 'normal',
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-[#1FBF9A] to-[#6BE3B2] text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#1FBF9A]/30 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    style={{ minHeight: '44px' }}
                  >
                    <Send className="w-5 h-5" />
                    <span>{t('contact.send')}</span>
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A202C] mb-4">
              Questions fréquentes
            </h2>
            <p className="text-lg text-[#718096]">
              Trouvez rapidement des réponses aux questions les plus courantes
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Comment puis-je prendre rendez-vous ?',
                a: 'Une fois la plateforme lancée, vous pourrez créer un compte et réserver directement en ligne avec le professionnel de votre choix.',
              },
              {
                q: 'Les consultations en ligne sont-elles sécurisées ?',
                a: 'Oui, toutes nos consultations sont chiffrées de bout en bout et respectent les normes de confidentialité médicale.',
              },
              {
                q: 'Quels sont les moyens de paiement acceptés ?',
                a: 'Nous accepterons les cartes bancaires, les paiements mobile et d\'autres moyens de paiement tunisiens. Les détails seront communiqués au lancement.',
              },
              {
                q: 'Puis-je consulter mon dossier médical ?',
                a: 'Oui, vous aurez accès à votre dossier médical complet incluant vos consultations et documents médicaux.',
              },
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-[#F4F5F7] rounded-xl p-6"
              >
                <h4 className="font-bold text-[#1A202C] mb-2">{faq.q}</h4>
                <p className="text-[#718096] leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}