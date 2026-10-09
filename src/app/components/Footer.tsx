import { Link } from 'react-router';
import { Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import logoImage from '../../assets/app_logo.png';
import { StoreBadges } from './StoreBadges';
import { CONTACT_EMAIL } from '../../config/appLinks';

const socials = [
  {
    href: 'https://www.facebook.com/profile.php?id=61576014832405',
    label: 'Facebook',
    icon: Facebook,
  },
  {
    href: 'https://www.instagram.com/omnilinks.tn/',
    label: 'Instagram',
    icon: Instagram,
  },
  {
    href: 'https://www.linkedin.com/company/omnilinks-tn/posts/?feedView=all',
    label: 'LinkedIn',
    icon: Linkedin,
  },
];

const navigation = [
  { href: '/', labelKey: 'nav.home' },
  { href: '/fonctionnalites', labelKey: 'nav.features' },
  { href: '/professionnels', labelKey: 'nav.professionals' },
  { href: '/a-propos', labelKey: 'nav.about' },
  { href: '/contact', labelKey: 'nav.contact' },
];

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0C5456] text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white p-1">
                <img src={logoImage} alt="" className="h-full w-full object-contain" />
              </span>
              <span className="text-2xl font-bold tracking-tight">OmniCare</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/80">{t('footer.description')}</p>
            <div className="mt-5 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <s.icon className="h-4.5 w-4.5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <nav aria-label={t('footer.navigation')}>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white/60">{t('footer.navigation')}</h3>
            <ul className="mt-4 space-y-2.5">
              {navigation.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-white/80 transition hover:text-white">
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Professionals */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white/60">{t('footer.professionalsSection')}</h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link to="/professionnels" className="text-sm text-white/80 transition hover:text-white">
                  {t('footer.advantages')}
                </Link>
              </li>
              <li>
                <Link to="/pre-inscription" className="text-sm text-white/80 transition hover:text-white">
                  {t('nav.preRegister')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact + download */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white/60">{t('footer.contactSection')}</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#6BE3B2]" aria-hidden="true" />
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-white/80 transition hover:text-white">
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#6BE3B2]" aria-hidden="true" />
                <span className="text-white/80">Tunis, Tunisie</span>
              </li>
            </ul>
            <div className="mt-5">
              <p className="mb-3 text-sm font-semibold text-white/90">{t('common.downloadApp')}</p>
              <StoreBadges size="sm" />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-7 md:flex-row">
          <p className="text-sm text-white/70">
            © {currentYear} OmniCare. {t('footer.rights')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link to="/contact" className="text-sm text-white/70 transition hover:text-white">
              {t('footer.privacy')}
            </Link>
            <Link to="/contact" className="text-sm text-white/70 transition hover:text-white">
              {t('footer.terms')}
            </Link>
            <span className="text-sm text-white/60">{t('footer.poweredBy')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}