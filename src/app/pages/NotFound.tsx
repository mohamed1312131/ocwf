import { ArrowLeft, Home } from 'lucide-react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export function NotFound() {
  const { t } = useTranslation();

  useDocumentMeta({ title: t('notfound.title'), description: t('notfound.metaDescription') });

  return (
    <div className="flex min-h-screen items-center justify-center bg-mist px-4 pb-24 pt-36">
      <div className="w-full max-w-2xl text-center">
        <p className="text-9xl font-extrabold text-[#1FBF9A]/20">404</p>
        <h1 className="-mt-6 text-4xl font-bold text-text-primary sm:text-5xl">{t('notfound.title')}</h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-text-secondary">{t('notfound.subtitle')}</p>

        <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            to="/"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Home className="h-5 w-5" aria-hidden="true" />
            {t('notfound.backHome')}
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-white px-7 py-3.5 font-semibold text-text-primary transition hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="h-5 w-5 rtl:-scale-x-100" aria-hidden="true" />
            {t('notfound.goBack')}
          </button>
        </div>
      </div>
    </div>
  );
}