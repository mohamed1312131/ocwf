import { Link } from 'react-router';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { 
  Stethoscope, 
  Syringe, 
  Brain, 
  Bone,
  Ambulance,
  Video,
  Calendar,
  FileText,
  Shield,
  Clock,
  Users,
  Smartphone
} from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import professionalImage from '../../assets/28fc02230563e1f2d34dd1e5166d4228df0706d1.png';
import heroBackgroundImage from '../../assets/6c7b1377f77072f2a4d2b940684d817198c53b75.png';
import appStoreLogo from '../../assets/App-Store-Logo-2020.png';
import googlePlayLogo from '../../assets/Google-Play-Emblem.png';

export function Home() {
  const { t } = useTranslation();
  
  const professions = [
    { icon: Stethoscope, label: t('preInscription.doctor'), emoji: '🩺' },
    { icon: Syringe, label: t('preInscription.nurse'), emoji: '💉' },
    { icon: Brain, label: t('preInscription.psychologist'), emoji: '🧠' },
    { icon: Bone, label: t('preInscription.physiotherapist'), emoji: '🦴' },
    { icon: Ambulance, label: t('home.ambulance'), emoji: '🚑' },
  ];

  const steps = [
    {
      number: '01',
      title: t('professionals.howItWorks.step1.title'),
      description: t('professionals.howItWorks.step1.description'),
      icon: Users,
    },
    {
      number: '02',
      title: t('professionals.howItWorks.step2.title'),
      description: t('professionals.howItWorks.step2.description'),
      icon: Calendar,
    },
    {
      number: '03',
      title: t('professionals.howItWorks.step3.title'),
      description: t('professionals.howItWorks.step3.description'),
      icon: Video,
    },
  ];

  const features = [
    {
      icon: Video,
      title: t('home.features.consultation.title'),
      description: t('home.features.consultation.description'),
    },
    {
      icon: Calendar,
      title: t('home.features.appointment.title'),
      description: t('home.features.appointment.description'),
    },
    {
      icon: FileText,
      title: t('features.medicalRecords.title'),
      description: t('features.medicalRecords.description'),
    },
    {
      icon: Shield,
      title: t('home.features.secure.title'),
      description: t('home.features.secure.description'),
    },
    {
      icon: Clock,
      title: t('home.stats.availability'),
      description: t('home.features.professionals.description'),
    },
    {
      icon: Smartphone,
      title: t('features.notifications.title'),
      description: t('features.notifications.description'),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${heroBackgroundImage})`,
            filter: 'brightness(0.4)',
          }}
        ></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F6F73]/80 via-[#1FBF9A]/70 to-[#6BE3B2]/60"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              {t('home.hero.title')}
            </h1>
            <p className="text-xl text-white/95 mb-8 max-w-2xl mx-auto leading-relaxed">
              {t('home.hero.subtitle')}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                to="/professionnels"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#1FBF9A] to-[#6BE3B2] text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#1FBF9A]/30 hover:-translate-y-0.5 inline-block"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                {t('professionals.hero.title')}
              </Link>
            </div>

            {/* Profession Badges */}
            <div className="flex flex-wrap justify-center gap-3">
              {professions.map((prof, idx) => (
                <motion.div
                  key={prof.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: 0.8 + idx * 0.1,
                    type: "spring",
                    stiffness: 200
                  }}
                  whileHover={{ 
                    scale: 1.1, 
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200 cursor-pointer"
                >
                  <span className="text-xl">{prof.emoji}</span>
                  <span className="text-sm font-medium text-[#718096]">{prof.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F4F5F7]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A202C] mb-4">
              {t('professionals.howItWorks.title')}
            </h2>
            <p className="text-lg text-[#718096] max-w-2xl mx-auto">
              {t('home.hero.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute -top-4 left-8 w-12 h-12 rounded-xl bg-gradient-to-br from-[#1FBF9A] to-[#6BE3B2] flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {step.number}
                </div>
                <div className="mt-8 mb-4">
                  <step.icon className="w-12 h-12 text-[#1FBF9A] mb-4" />
                  <h3 className="text-xl font-bold text-[#1A202C] mb-2">{step.title}</h3>
                  <p className="text-[#718096] leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A202C] mb-4">
              {t('home.features.title')}
            </h2>
            <p className="text-lg text-[#718096] max-w-2xl mx-auto">
              {t('home.features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1FBF9A]/10 to-[#6BE3B2]/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-[#1FBF9A]" />
                </div>
                <h3 className="text-lg font-bold text-[#1A202C] mb-2">{feature.title}</h3>
                <p className="text-[#718096] text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* For Professionals */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0F6F73] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                {t('footer.professionalsSection')}
              </h2>
              <p className="text-lg text-white/90 mb-8 leading-relaxed">
                {t('professionals.hero.subtitle')}
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  t('features.appointment.description'),
                  t('professionals.benefits.patients.description'),
                  t('features.videoConsultation.description'),
                  t('features.payment.description'),
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#1FBF9A] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-white/90">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/professionnels"
                className="inline-block px-8 py-4 rounded-xl bg-white text-[#0F6F73] font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                {t('home.hero.learnMore')}
              </Link>
            </div>
            <div>
              <ImageWithFallback
                src={professionalImage}
                alt="Professionnel de santé avec stéthoscope"
                className="w-full h-auto object-cover rounded-3xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <Smartphone className="w-16 h-16 text-[#1FBF9A] mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1A202C] mb-4">
            {t('home.mobileApp.title')}
          </h2>
          <p className="text-lg text-[#718096] mb-8 max-w-2xl mx-auto leading-relaxed">
            {t('home.mobileApp.description')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-[#1FBF9A] to-[#6BE3B2] rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-white border-2 border-[#1FBF9A] text-[#1A202C] px-8 py-4 rounded-xl flex items-center gap-4 hover:bg-[#1FBF9A]/5 transition-all duration-300 transform hover:scale-105 shadow-lg">
                <img 
                  src={appStoreLogo} 
                  alt="App Store" 
                  className="w-10 h-10 object-contain"
                />
                <div className="text-left">
                  <div className="text-xs text-[#718096]">{t('home.mobileApp.comingSoonAppStore')}</div>
                  <div className="text-lg font-bold text-[#0F6F73]">App Store</div>
                </div>
              </div>
            </div>
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-[#1FBF9A] to-[#6BE3B2] rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-white border-2 border-[#1FBF9A] text-[#1A202C] px-8 py-4 rounded-xl flex items-center gap-4 hover:bg-[#1FBF9A]/5 transition-all duration-300 transform hover:scale-105 shadow-lg">
                <img 
                  src={googlePlayLogo} 
                  alt="Google Play" 
                  className="w-10 h-10 object-contain"
                />
                <div className="text-left">
                  <div className="text-xs text-[#718096]">{t('home.mobileApp.comingSoonGooglePlay')}</div>
                  <div className="text-lg font-bold text-[#0F6F73]">Google Play</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#0F6F73] via-[#1FBF9A] to-[#6BE3B2]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            {t('home.cta.title')}
          </h2>
          <p className="text-xl mb-8 text-white/90 leading-relaxed">
            {t('home.cta.subtitle')}
          </p>
          <Link
            to="/pre-inscription"
            className="inline-block px-8 py-4 rounded-xl bg-white text-[#0F6F73] font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            {t('nav.preRegister')}
          </Link>
        </div>
      </section>
    </div>
  );
}