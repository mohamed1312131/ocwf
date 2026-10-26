import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  Clock,
  Copy,
  ExternalLink,
  FileText,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Pencil,
  QrCode,
  Save,
  ShieldCheck,
  ShieldOff,
  Table,
  UploadCloud,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { SharedDocumentResponse, sharedDocumentAPI } from '../../services/api';
import { useAuth } from '../context/AuthContext';

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} octets`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

function formatDate(value?: string) {
  if (!value) return 'Sans expiration';
  return new Intl.DateTimeFormat('fr-TN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function currentLocalDateTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

function getErrorMessage(error: any) {
  return error?.response?.data?.message || 'Une erreur est survenue. Vérifiez la configuration Cloudinary.';
}

export function SharedFiles() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<SharedDocumentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [editing, setEditing] = useState<SharedDocumentResponse | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editExpiresAt, setEditExpiresAt] = useState('');

  const loadDocuments = async () => {
    try {
      setDocuments(await sharedDocumentAPI.getAll());
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  const handleUpload = async (event: FormEvent) => {
    event.preventDefault();
    if (!file) {
      toast.error('Choisissez un fichier.');
      return;
    }

    setSubmitting(true);
    try {
      const created = await sharedDocumentAPI.create({ file, title, expiresAt: expiresAt || undefined });
      setDocuments((current) => [created, ...current]);
      setTitle('');
      setExpiresAt('');
      setFile(null);
      const input = document.getElementById('shared-file') as HTMLInputElement | null;
      if (input) input.value = '';
      toast.success('Document envoyé et lien QR créé.');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const copyLink = async (document: SharedDocumentResponse) => {
    await navigator.clipboard.writeText(document.shareUrl);
    toast.success('Lien copié.');
  };

  const downloadQr = async (document: SharedDocumentResponse) => {
    try {
      const blob = await sharedDocumentAPI.downloadQr(document.id);
      const url = URL.createObjectURL(blob);
      const anchor = window.document.createElement('a');
      anchor.href = url;
      anchor.download = `qr-${document.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.png`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const toggleRevoked = async (document: SharedDocumentResponse) => {
    try {
      const updated = document.revoked
        ? await sharedDocumentAPI.restore(document.id)
        : await sharedDocumentAPI.revoke(document.id);
      setDocuments((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      toast.success(updated.revoked ? 'Accès révoqué.' : 'Accès réactivé.');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const beginEdit = (document: SharedDocumentResponse) => {
    setEditing(document);
    setEditTitle(document.title);
    setEditExpiresAt(document.expiresAt ? document.expiresAt.slice(0, 16) : '');
  };

  const saveEdit = async (event: FormEvent) => {
    event.preventDefault();
    if (!editing) return;

    try {
      const updated = await sharedDocumentAPI.update(editing.id, {
        title: editTitle,
        expiresAt: editExpiresAt || undefined,
        clearExpiry: !editExpiresAt,
      });
      setDocuments((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setEditing(null);
      toast.success('Paramètres enregistrés.');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#0F6F73]">Espace administrateur</p>
            <h1 className="text-4xl font-bold text-[#1A202C]">Documents et QR codes</h1>
            <p className="mt-2 text-lg text-[#718096]">Partagez vos pitch decks avec une date d’expiration et un accès révocable.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/admin/dashboard" className="flex min-h-11 items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 font-semibold text-[#1A202C] hover:shadow-md">
              <LayoutDashboard className="h-5 w-5" /> Dashboard
            </Link>
            <Link to="/admin/pre-inscriptions" className="flex min-h-11 items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 font-semibold text-[#1A202C] hover:shadow-md">
              <Table className="h-5 w-5" /> Pré-inscriptions
            </Link>
            <button onClick={handleLogout} className="flex min-h-11 items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 font-semibold text-red-700 hover:bg-red-100">
              <LogOut className="h-5 w-5" /> Déconnexion
            </button>
          </div>
        </header>

        <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-[#1FBF9A]/10 p-3 text-[#0F6F73]"><UploadCloud className="h-6 w-6" /></div>
            <div>
              <h2 className="text-xl font-bold text-[#1A202C]">Créer un partage</h2>
              <p className="text-sm text-[#718096]">PDF, PowerPoint, Word, Excel, TXT ou ZIP — 50 Mo maximum.</p>
            </div>
          </div>
          <form onSubmit={handleUpload} className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#1A202C]">Titre</span>
              <input value={title} onChange={(event) => setTitle(event.target.value)} required placeholder="Pitch deck OmniCare" className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#1FBF9A]" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#1A202C]">Fichier</span>
              <input id="shared-file" type="file" required accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.txt,.zip" onChange={(event) => setFile(event.target.files?.[0] || null)} className="block w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-[#1FBF9A]/10 file:px-3 file:py-1.5 file:font-semibold file:text-[#0F6F73]" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#1A202C]">Expiration (optionnelle)</span>
              <input type="datetime-local" value={expiresAt} min={currentLocalDateTime()} onChange={(event) => setExpiresAt(event.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#1FBF9A]" />
            </label>
            <button disabled={submitting} className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1FBF9A] to-[#6BE3B2] px-6 py-3 font-semibold text-white hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60">
              {submitting ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <QrCode className="h-5 w-5" />}
              Générer
            </button>
          </form>
        </section>

        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-5">
            <h2 className="text-xl font-bold text-[#1A202C]">Partages créés</h2>
            <p className="text-sm text-[#718096]">Le QR reste identique même si vous modifiez l’expiration ou révoquez l’accès.</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 px-6 py-16 text-[#718096]"><LoaderCircle className="h-5 w-5 animate-spin" /> Chargement…</div>
          ) : documents.length === 0 ? (
            <div className="px-6 py-16 text-center text-[#718096]"><FileText className="mx-auto mb-3 h-10 w-10" />Aucun document partagé.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {documents.map((document) => {
                const inactive = document.revoked || document.expired;
                return (
                  <article key={document.id} className="p-6">
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-lg font-bold text-[#1A202C]">{document.title}</h3>
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${inactive ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                            {document.revoked ? 'Révoqué' : document.expired ? 'Expiré' : 'Actif'}
                          </span>
                        </div>
                        <p className="truncate text-sm text-[#718096]">{document.originalFilename} · {formatBytes(document.sizeBytes)}</p>
                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#718096]">
                          <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {formatDate(document.expiresAt)}</span>
                          <span className="flex items-center gap-1.5"><ExternalLink className="h-4 w-4" /> {document.accessCount} ouverture{document.accessCount === 1 ? '' : 's'}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => copyLink(document)} className="flex min-h-10 items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold hover:bg-gray-50"><Copy className="h-4 w-4" /> Copier</button>
                        <a href={document.shareUrl} target="_blank" rel="noreferrer" className="flex min-h-10 items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold hover:bg-gray-50"><ExternalLink className="h-4 w-4" /> Tester</a>
                        <button onClick={() => downloadQr(document)} className="flex min-h-10 items-center gap-2 rounded-lg bg-[#0F6F73] px-3 py-2 text-sm font-semibold text-white hover:bg-[#0b5558]"><QrCode className="h-4 w-4" /> QR PNG</button>
                        <button onClick={() => beginEdit(document)} className="flex min-h-10 items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold hover:bg-gray-50"><Pencil className="h-4 w-4" /> Modifier</button>
                        <button onClick={() => toggleRevoked(document)} className={`flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${document.revoked ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                          {document.revoked ? <ShieldCheck className="h-4 w-4" /> : <ShieldOff className="h-4 w-4" />}
                          {document.revoked ? 'Réactiver' : 'Révoquer'}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
          <form onSubmit={saveEdit} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#1A202C]">Modifier le partage</h2>
              <button type="button" onClick={() => setEditing(null)} className="rounded-lg p-2 text-[#718096] hover:bg-gray-100" aria-label="Fermer"><X className="h-5 w-5" /></button>
            </div>
            <label className="mb-4 block">
              <span className="mb-2 block text-sm font-semibold">Titre</span>
              <input value={editTitle} onChange={(event) => setEditTitle(event.target.value)} required className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1FBF9A]" />
            </label>
            <label className="mb-6 block">
              <span className="mb-2 block text-sm font-semibold">Expiration</span>
              <input type="datetime-local" value={editExpiresAt} min={currentLocalDateTime()} onChange={(event) => setEditExpiresAt(event.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1FBF9A]" />
              <span className="mt-2 block text-xs text-[#718096]">Laissez vide pour supprimer l’expiration.</span>
            </label>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setEditing(null)} className="rounded-xl border border-gray-300 px-5 py-3 font-semibold">Annuler</button>
              <button className="flex items-center gap-2 rounded-xl bg-[#1FBF9A] px-5 py-3 font-semibold text-white"><Save className="h-4 w-4" /> Enregistrer</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
