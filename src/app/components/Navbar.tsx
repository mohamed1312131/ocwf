import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import logoImage from '../../assets/app_logo.png';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { CONTACT_EMAIL } from '../../config/appLinks';

type NavLinkDef = {
  href: string;
  labelKey: string;
  /** On the home page these items scroll to the matching deck slide instead. */
  homeHash?: string;
};

const links: NavLinkDef[] = [
  { href: '/', labelKey: 'nav.home' },
  { href: '/fonctionnalites', labelKey: 'nav.features', homeHash: '#fonctionnalites' },
  { href: '/professionnels', labelKey: 'nav.professionals', homeHash: '#professionnels' },
  { href: '/a-propos', labelKey: 'nav.about' },
  { href: '/contact', labelKey: 'nav.contact' },
];

const desktopClass = (active: boolean) =>
  `relative rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors after:absolute after:inset-x-3.5 after:-bottom-0.5 after:h-[2px] after:origin-left after:rounded-full after:bg-primary after:transition-transform after:duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rtl:after:origin-right ${
    active
      ? 'text-primary-strong after:scale-x-100'
      : 'text-text-secondary after:scale-x-0 hover:text-primary-strong hover:after:scale-x-100'
  }`;

const mobileClass = (active: boolean) =>
  `rounded-lg px-4 py-3 text-base font-semibold transition-colors ${
    active ? 'bg-[#1FBF9A]/10 text-primary-strong' : 'text-text-secondary hover:bg-mist hover:text-text-primary'
  }`;

/**
 * Nav item. On the home page, items mapped to a deck slide render as in-page
 * anchors (`#fonctionnalites`, `#professionnels`) which the deck turns into
 * slide changes; elsewhere they keep routing to the dedicated pages.
 */
function NavItem({
  link,
  classNameFor,
  onNavigate,
}: {
  link: NavLinkDef;
  classNameFor: (active: boolean) => string;
  onNavigate?: () => void;
}) {
  const { t } = useTranslation();
  const { pathname, hash } = useLocation();

  if (link.homeHash && pathname === '/') {
    const active = hash === link.homeHash;
    return (
      <a
        href={link.homeHash}
        onClick={onNavigate}
        aria-current={active ? 'page' : undefined}
        className={classNameFor(active)}
      >
        {t(link.labelKey)}
      </a>
    );
  }

  return (
    <NavLink to={link.href} onClick={onNavigate} className={({ isActive }) => classNameFor(isActive)}>
      {t(link.labelKey)}
    </NavLink>
  );
}

export function Navbar() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <nav
      aria-label={t('nav.ariaLabel')}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 shadow-soft backdrop-blur-md' : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      {/* Skip link */}
      <a
        href="#main"
        className="absolute -top-20 left-4 z-[60] rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-all focus-visible:top-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {t('nav.skipToContent')}
      </a>

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label={`OmniCare — ${t('nav.home')}`}>
          <img src={logoImage} alt="" className="h-11 w-11 object-contain" />
          <span className="text-2xl font-bold tracking-tight text-[#0F6F73]">OmniCare</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <NavItem key={link.href} link={link} classNameFor={desktopClass} />
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          <Link
            to="/pre-inscription"
            className="inline-flex min-h-11 items-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {t('nav.preRegister')}
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {isOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            id="mobile-menu"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: reduce ? 0.001 : 0.2 }}
            className="border-t border-border bg-white lg:hidden"
          >
            <div className="flex max-h-[calc(100dvh-5rem)] flex-col gap-1 overflow-y-auto px-4 py-4">
              {links.map((link) => (
                <NavItem
                  key={link.href}
                  link={link}
                  classNameFor={mobileClass}
                  onNavigate={() => setIsOpen(false)}
                />
              ))}
              <Link
                to="/pre-inscription"
                onClick={() => setIsOpen(false)}
                className="mt-2 inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-5 py-3 text-base font-semibold text-white transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {t('nav.preRegister')}
              </Link>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="px-4 py-2 text-center text-sm text-text-secondary"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </nav>
  );
}