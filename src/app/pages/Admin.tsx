import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Search, Download, Filter, Stethoscope, Syringe, Brain, Bone, ArrowUpDown, BarChart3, LogOut } from 'lucide-react';
import { usePreInscription } from '../context/PreInscriptionContext';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function Admin() {
  const { preInscriptions, fetchPreInscriptions } = usePreInscription();
  const { logout } = useAuth();

  useEffect(() => {
    fetchPreInscriptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProfession, setFilterProfession] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const professionConfig = {
    medecin: { label: 'Médecin', emoji: '🩺', icon: Stethoscope, color: 'bg-blue-100 text-blue-700 border-blue-200' },
    infirmier: { label: 'Infirmier(e)', emoji: '💉', icon: Syringe, color: 'bg-green-100 text-green-700 border-green-200' },
    psychologue: { label: 'Psychologue', emoji: '🧠', icon: Brain, color: 'bg-purple-100 text-purple-700 border-purple-200' },
    kinesitherapeute: { label: 'Kinésithérapeute', emoji: '🦴', icon: Bone, color: 'bg-orange-100 text-orange-700 border-orange-200' },
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...preInscriptions];

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (p) =>
          p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.phone.includes(searchTerm)
      );
    }

    // Filter by profession
    if (filterProfession !== 'all') {
      result = result.filter((p) => p.profession === filterProfession);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'date') {
        const comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        return sortOrder === 'asc' ? comparison : -comparison;
      } else {
        const nameA = `${a.lastName} ${a.firstName}`.toLowerCase();
        const nameB = `${b.lastName} ${b.firstName}`.toLowerCase();
        const comparison = nameA.localeCompare(nameB);
        return sortOrder === 'asc' ? comparison : -comparison;
      }
    });

    return result;
  }, [preInscriptions, searchTerm, filterProfession, sortBy, sortOrder]);

  const stats = useMemo(() => {
    const total = preInscriptions.length;
    const medecins = preInscriptions.filter((p) => p.profession === 'medecin').length;
    const infirmiers = preInscriptions.filter((p) => p.profession === 'infirmier').length;
    const psychologues = preInscriptions.filter((p) => p.profession === 'psychologue').length;
    const kinesitherapeutes = preInscriptions.filter((p) => p.profession === 'kinesitherapeute').length;

    return { total, medecins, infirmiers, psychologues, kinesitherapeutes };
  }, [preInscriptions]);

  const exportToCSV = () => {
    const headers = ['Nom complet', 'Date de naissance', 'E-mail', 'Téléphone', 'Profession', 'Date d\'inscription'];
    const rows = filteredAndSorted.map((p) => [
      `${p.firstName} ${p.lastName}`,
      p.dateOfBirth,
      p.email,
      p.phone,
      professionConfig[p.profession].label,
      format(new Date(p.createdAt), 'dd/MM/yyyy HH:mm', { locale: fr }),
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `preinscriptions_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  const toggleSort = (newSortBy: 'date' | 'name') => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-[#F4F5F7]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-[#1A202C] mb-2">Membres pré-inscrits</h1>
            <p className="text-lg text-[#718096]">
              Gestion des professionnels ayant soumis une pré-inscription
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/dashboard"
              className="px-6 py-3 bg-white border border-gray-300 text-[#1A202C] font-semibold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2"
              style={{ minHeight: '44px' }}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <button
              onClick={logout}
              className="px-6 py-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center gap-2"
              style={{ minHeight: '44px' }}
            >
              <LogOut className="w-5 h-5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="text-3xl font-bold text-[#1FBF9A] mb-1">{stats.total}</div>
            <div className="text-sm text-[#718096]">Total inscrits</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-bold text-blue-600">{stats.medecins}</span>
              <span className="text-xl">🩺</span>
            </div>
            <div className="text-sm text-[#718096]">Médecins</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-bold text-green-600">{stats.infirmiers}</span>
              <span className="text-xl">💉</span>
            </div>
            <div className="text-sm text-[#718096]">Infirmiers</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-bold text-purple-600">{stats.psychologues}</span>
              <span className="text-xl">🧠</span>
            </div>
            <div className="text-sm text-[#718096]">Psychologues</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-bold text-orange-600">{stats.kinesitherapeutes}</span>
              <span className="text-xl">🦴</span>
            </div>
            <div className="text-sm text-[#718096]">Kinés</div>
          </motion.div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#718096]" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, e-mail ou téléphone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FBF9A] focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter by Profession */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#718096]" />
              <select
                value={filterProfession}
                onChange={(e) => setFilterProfession(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FBF9A] focus:border-transparent"
              >
                <option value="all">Toutes les professions</option>
                <option value="medecin">🩺 Médecin</option>
                <option value="infirmier">💉 Infirmier(e)</option>
                <option value="psychologue">🧠 Psychologue</option>
                <option value="kinesitherapeute">🦴 Kinésithérapeute</option>
              </select>
            </div>

            {/* Export Button */}
            <button
              onClick={exportToCSV}
              className="px-6 py-3 bg-gradient-to-r from-[#1FBF9A] to-[#6BE3B2] text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2"
              style={{ minHeight: '44px' }}
            >
              <Download className="w-5 h-5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F4F5F7] border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => toggleSort('name')}
                      className="flex items-center gap-2 font-semibold text-[#1A202C] hover:text-[#1FBF9A] transition-colors"
                    >
                      <span>Nom complet</span>
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-[#1A202C]">Date de naissance</th>
                  <th className="px-6 py-4 text-left font-semibold text-[#1A202C]">E-mail</th>
                  <th className="px-6 py-4 text-left font-semibold text-[#1A202C]">Téléphone</th>
                  <th className="px-6 py-4 text-left font-semibold text-[#1A202C]">Profession</th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => toggleSort('date')}
                      className="flex items-center gap-2 font-semibold text-[#1A202C] hover:text-[#1FBF9A] transition-colors"
                    >
                      <span>Date d'inscription</span>
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSorted.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-[#718096]">
                      Aucune pré-inscription trouvée
                    </td>
                  </tr>
                ) : (
                  filteredAndSorted.map((inscription, idx) => (
                    <tr
                      key={inscription.id}
                      className={`border-b border-gray-100 hover:bg-[#F4F5F7]/50 transition-colors ${
                        idx % 2 === 1 ? 'bg-[#F4F5F7]/30' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-[#1A202C]">
                          {inscription.firstName} {inscription.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#718096]">{inscription.dateOfBirth}</td>
                      <td className="px-6 py-4 text-[#718096]">{inscription.email}</td>
                      <td className="px-6 py-4 text-[#718096]">{inscription.phone}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${
                            professionConfig[inscription.profession].color
                          }`}
                        >
                          <span>{professionConfig[inscription.profession].emoji}</span>
                          <span>{professionConfig[inscription.profession].label}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#718096]">
                        {format(new Date(inscription.createdAt), 'dd/MM/yyyy HH:mm', { locale: fr })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results Count */}
        {filteredAndSorted.length > 0 && (
          <div className="mt-4 text-center text-sm text-[#718096]">
            Affichage de {filteredAndSorted.length} résultat{filteredAndSorted.length > 1 ? 's' : ''} sur {preInscriptions.length} au total
          </div>
        )}
      </div>
    </div>
  );
}