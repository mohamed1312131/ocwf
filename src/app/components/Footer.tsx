import { Link } from 'react-router';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import logoImage from '../../assets/app_logo.png';

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0F6F73] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-lg p-1 flex items-center justify-center">
                <img 
                  src={logoImage} 
                  alt="OmniCare Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-2xl font-bold">OmniCare</span>
            </Link>
            <p className="text-white/80 text-sm leading-relaxed mb-4">
              {t('footer.description')}
            </p>
            
            {/* Social Media Links */}
            <div className="flex gap-4">
              <a 
                href="https://www.facebook.com/profile.php?id=61576014832405" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://www.instagram.com/omnilinks.tn/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://www.linkedin.com/company/omnilinks-tn/posts/?feedView=all" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('footer.navigation')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/80 hover:text-white transition-colors text-sm">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/fonctionnalites" className="text-white/80 hover:text-white transition-colors text-sm">
                  {t('nav.features')}
                </Link>
              </li>
              <li>
                <Link to="/professionnels" className="text-white/80 hover:text-white transition-colors text-sm">
                  {t('nav.professionals')}
                </Link>
              </li>
              <li>
                <Link to="/a-propos" className="text-white/80 hover:text-white transition-colors text-sm">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/80 hover:text-white transition-colors text-sm">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Pour les Professionnels */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('footer.professionalsSection')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/professionnels" className="text-white/80 hover:text-white transition-colors text-sm">
                  {t('footer.advantages')}
                </Link>
              </li>
              <li>
                <Link to="/pre-inscription" className="text-white/80 hover:text-white transition-colors text-sm">
                  {t('nav.preRegister')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('footer.contactSection')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Mail size={18} className="mt-0.5 flex-shrink-0" />
                <a href="mailto:contact@omnicare.tn" className="text-white/80 hover:text-white transition-colors text-sm">
                  contact@omnicare.tn
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={18} className="mt-0.5 flex-shrink-0" />
                <a href="tel:+21655618060" className="text-white/80 hover:text-white transition-colors text-sm">
                  +216 55 618 060
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                <span className="text-white/80 text-sm">Tunis, Tunisie</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col items-center md:items-start gap-2">
              <p className="text-white/70 text-sm">
                © {currentYear} OmniCare. {t('footer.rights')}
              </p>
              <p className="text-white/50 text-xs">
                {t('footer.poweredBy')}
              </p>
            </div>
            <div className="flex gap-6">
              <Link to="#" className="text-white/70 hover:text-white transition-colors text-sm">
                {t('footer.privacy')}
              </Link>
              <Link to="#" className="text-white/70 hover:text-white transition-colors text-sm">
                {t('footer.terms')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}