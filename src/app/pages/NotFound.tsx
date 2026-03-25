import { Link } from 'react-router';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-[#F4F5F7]">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold text-[#1FBF9A] mb-4">404</div>
          <h1 className="text-4xl font-bold text-[#1A202C] mb-4">Page non trouvée</h1>
          <p className="text-xl text-[#718096] mb-8">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#1FBF9A] to-[#6BE3B2] text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#1FBF9A]/30 hover:-translate-y-0.5"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <Home className="w-5 h-5" />
            <span>Retour à l'accueil</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-[#1FBF9A] text-[#1FBF9A] font-semibold transition-all duration-300 hover:bg-[#1FBF9A] hover:text-white"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Page précédente</span>
          </button>
        </div>
      </div>
    </div>
  );
}
