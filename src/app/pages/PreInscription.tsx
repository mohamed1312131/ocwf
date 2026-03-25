import { useState } from 'react';
import { motion } from 'motion/react';
import { Stethoscope, Syringe, Brain, Bone, CheckCircle, ArrowRight } from 'lucide-react';
import { usePreInscription } from '../context/PreInscriptionContext';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Turnstile } from '@marsidev/react-turnstile';
import { TURNSTILE_SITE_KEY } from '../../config/turnstile';

export function PreInscription() {
  const { t } = useTranslation();
  const { addPreInscription } = usePreInscription();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    profession: '' as 'medecin' | 'infirmier' | 'psychologue' | 'kinesitherapeute' | '',
  });

  const professions = [
    { value: 'medecin', label: t('preInscription.doctor'), icon: Stethoscope, emoji: '🩺' },
    { value: 'infirmier', label: t('preInscription.nurse'), icon: Syringe, emoji: '💉' },
    { value: 'psychologue', label: t('preInscription.psychologist'), icon: Brain, emoji: '🧠' },
    { value: 'kinesitherapeute', label: t('preInscription.physiotherapist'), icon: Bone, emoji: '🦴' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.dateOfBirth || 
        !formData.email || !formData.phone || !formData.profession) {
      toast.error(t('preInscription.fillAll'));
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error(t('preInscription.invalidEmail'));
      return;
    }

    // Phone validation (basic)
    if (formData.phone.length < 8) {
      toast.error(t('preInscription.invalidPhone'));
      return;
    }

    // Captcha validation
    if (!captchaToken) {
      toast.error(t('preInscription.captchaError'));
      return;
    }

    // Submit
    try {
      await addPreInscription({
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        email: formData.email,
        phone: formData.phone,
        profession: formData.profession as 'medecin' | 'infirmier' | 'psychologue' | 'kinesitherapeute',
      });

      setIsSubmitted(true);
      toast.success(t('preInscription.success'));
    } catch (error) {
      toast.error(t('preInscription.error'));
      console.error('Submission error:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
            {t('preInscription.successTitle')}
          </h1>
          <p className="text-lg text-[#718096] mb-8 leading-relaxed">
            {t('preInscription.successMessage')}
          </p>
          <div className="bg-gradient-to-r from-[#1FBF9A]/10 to-[#6BE3B2]/10 border border-[#1FBF9A]/20 rounded-2xl p-6 mb-8">
            <p className="text-[#718096]">
              {t('preInscription.emailConfirmation')} <br />
              <span className="font-semibold text-[#1A202C]">{formData.email}</span>
            </p>
          </div>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#1FBF9A] to-[#6BE3B2] text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#1FBF9A]/30 hover:-translate-y-0.5"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <span>{t('preInscription.backHome')}</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 py-16 px-4 sm:px-6 lg:px-8 bg-[#F4F5F7]">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1A202C] mb-4">
            {t('preInscription.title')}
          </h1>
          <p className="text-xl text-[#718096] leading-relaxed">
            {t('preInscription.subtitle')}
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-[#1A202C] mb-2">
                  {t('preInscription.firstName')} <span className="text-[#EF4444]">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FBF9A] focus:border-transparent transition-all"
                  placeholder="Jean"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-[#1A202C] mb-2">
                  {t('preInscription.lastName')} <span className="text-[#EF4444]">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FBF9A] focus:border-transparent transition-all"
                  placeholder="Dupont"
                  required
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-[#1A202C] mb-2">
                {t('preInscription.dateOfBirth')} <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FBF9A] focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#1A202C] mb-2">
                {t('preInscription.email')} <span className="text-[#EF4444]">*</span>
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

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-[#1A202C] mb-2">
                {t('preInscription.phone')} <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FBF9A] focus:border-transparent transition-all"
                placeholder="+216 12 345 678"
                required
              />
            </div>

            {/* Profession */}
            <div>
              <label className="block text-sm font-semibold text-[#1A202C] mb-4">
                {t('preInscription.profession')} <span className="text-[#EF4444]">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {professions.map((prof) => (
                  <label
                    key={prof.value}
                    className={`relative flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      formData.profession === prof.value
                        ? 'border-[#1FBF9A] bg-gradient-to-r from-[#1FBF9A]/10 to-[#6BE3B2]/10 shadow-md'
                        : 'border-gray-300 hover:border-[#1FBF9A]/50 bg-white'
                    }`}
                    style={{ minHeight: '44px' }}
                  >
                    <input
                      type="radio"
                      name="profession"
                      value={prof.value}
                      checked={formData.profession === prof.value}
                      onChange={handleChange}
                      className="sr-only"
                      required
                    />
                    <div className="text-3xl">{prof.emoji}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-[#1A202C]">{prof.label}</div>
                    </div>
                    {formData.profession === prof.value && (
                      <CheckCircle className="w-6 h-6 text-[#1FBF9A]" />
                    )}
                  </label>
                ))}
              </div>
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
              className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-[#1FBF9A] to-[#6BE3B2] text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#1FBF9A]/30 hover:-translate-y-0.5"
              style={{ minHeight: '44px' }}
            >
              {t('preInscription.submit')}
            </button>
          </form>

          {/* Note */}
          <div className="mt-8 p-4 bg-[#F4F5F7] rounded-xl">
            <p className="text-sm text-[#718096] text-center leading-relaxed">
              {t('preInscription.privacyNote')}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}