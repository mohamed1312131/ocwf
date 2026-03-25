import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { usePreInscription } from '../context/PreInscriptionContext';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import { TrendingUp, Users, Calendar, Eye, Table, LogOut } from 'lucide-react';

export function Dashboard() {
  const { preInscriptions, fetchPreInscriptions } = usePreInscription();
  const { logout } = useAuth();
  const [visitorStats, setVisitorStats] = useState({ total: 0, unique: 0 });

  useEffect(() => {
    // Fetch pre-inscriptions from backend
    fetchPreInscriptions();
    
    // Get visitor statistics
    const totalVisits = localStorage.getItem('omnicare_visits');
    const uniqueVisits = localStorage.getItem('omnicare_unique_visits');
    setVisitorStats({
      total: totalVisits ? parseInt(totalVisits, 10) : 0,
      unique: uniqueVisits ? parseInt(uniqueVisits, 10) : 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const professionConfig = {
    medecin: { label: 'Médecin', emoji: '🩺', color: '#3B82F6' },
    infirmier: { label: 'Infirmier(e)', emoji: '💉', color: '#10B981' },
    psychologue: { label: 'Psychologue', emoji: '🧠', color: '#8B5CF6' },
    kinesitherapeute: { label: 'Kinésithérapeute', emoji: '🦴', color: '#F59E0B' },
  };

  // Stats
  const stats = useMemo(() => {
    const total = preInscriptions.length;
    const medecins = preInscriptions.filter((p) => p.profession === 'medecin').length;
    const infirmiers = preInscriptions.filter((p) => p.profession === 'infirmier').length;
    const psychologues = preInscriptions.filter((p) => p.profession === 'psychologue').length;
    const kinesitherapeutes = preInscriptions.filter((p) => p.profession === 'kinesitherapeute').length;

    return { total, medecins, infirmiers, psychologues, kinesitherapeutes };
  }, [preInscriptions]);

  // Bar Chart Data - Profession Distribution
  const professionData = useMemo(() => {
    return [
      { id: 'medecin', profession: 'Médecin', count: stats.medecins, emoji: '🩺' },
      { id: 'infirmier', profession: 'Infirmier(e)', count: stats.infirmiers, emoji: '💉' },
      { id: 'psychologue', profession: 'Psychologue', count: stats.psychologues, emoji: '🧠' },
      { id: 'kinesitherapeute', profession: 'Kinésithérapeute', count: stats.kinesitherapeutes, emoji: '🦴' },
    ];
  }, [stats]);

  // Line Chart Data - Inscriptions over time
  const inscriptionsByDate = useMemo(() => {
    if (preInscriptions.length === 0) return [];

    const dates = preInscriptions.map((p) => parseISO(p.createdAt));
    const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));

    const allDates = eachDayOfInterval({ start: minDate, end: maxDate });

    return allDates.map((date, index) => {
      const count = preInscriptions.filter((p) => {
        const pDate = parseISO(p.createdAt);
        return format(pDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
      }).length;

      return {
        id: `date-${index}`,
        date: format(date, 'dd/MM', { locale: fr }),
        fullDate: format(date, 'dd MMMM yyyy', { locale: fr }),
        count,
      };
    });
  }, [preInscriptions]);

  // Pie Chart Data - Percentage by profession
  const pieData = useMemo(() => {
    return [
      { name: 'Médecin', value: stats.medecins, color: '#3B82F6' },
      { name: 'Infirmier(e)', value: stats.infirmiers, color: '#10B981' },
      { name: 'Psychologue', value: stats.psychologues, color: '#8B5CF6' },
      { name: 'Kinésithérapeute', value: stats.kinesitherapeutes, color: '#F59E0B' },
    ].filter((item) => item.value > 0);
  }, [stats]);

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-[#F4F5F7]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-[#1A202C] mb-2">Tableau de bord — Pré-inscriptions</h1>
            <p className="text-lg text-[#718096]">
              Visualisation des données de pré-inscription des professionnels
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="px-6 py-3 bg-white border border-gray-300 text-[#1A202C] font-semibold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2"
              style={{ minHeight: '44px' }}
            >
              <Table className="w-5 h-5" />
              <span>Tableau</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#1FBF9A] to-[#6BE3B2] rounded-2xl p-6 shadow-lg text-white"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm opacity-90 mb-1">Total inscrits</div>
                <div className="text-4xl font-bold">{stats.total}</div>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm opacity-90">
              <TrendingUp className="w-4 h-4" />
              <span>Professionnels</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-gradient-to-br from-[#0F6F73] to-[#1FBF9A] rounded-2xl p-6 shadow-lg text-white"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm opacity-90 mb-1">Visiteurs</div>
                <div className="text-4xl font-bold">{visitorStats.unique}</div>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm opacity-90">
              <Calendar className="w-4 h-4" />
              <span>{visitorStats.total} visites totales</span>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm text-[#718096] mb-1">Médecins</div>
                <div className="text-3xl font-bold text-blue-600">{stats.medecins}</div>
              </div>
              <div className="text-3xl">🩺</div>
            </div>
            <div className="text-sm text-[#718096]">
              {stats.total > 0 ? Math.round((stats.medecins / stats.total) * 100) : 0}% du total
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm text-[#718096] mb-1">Infirmiers</div>
                <div className="text-3xl font-bold text-green-600">{stats.infirmiers}</div>
              </div>
              <div className="text-3xl">💉</div>
            </div>
            <div className="text-sm text-[#718096]">
              {stats.total > 0 ? Math.round((stats.infirmiers / stats.total) * 100) : 0}% du total
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm text-[#718096] mb-1">Psychologues</div>
                <div className="text-3xl font-bold text-purple-600">{stats.psychologues}</div>
              </div>
              <div className="text-3xl">🧠</div>
            </div>
            <div className="text-sm text-[#718096]">
              {stats.total > 0 ? Math.round((stats.psychologues / stats.total) * 100) : 0}% du total
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm text-[#718096] mb-1">Kinésithérapeutes</div>
                <div className="text-3xl font-bold text-orange-600">{stats.kinesitherapeutes}</div>
              </div>
              <div className="text-3xl">🦴</div>
            </div>
            <div className="text-sm text-[#718096]">
              {stats.total > 0 ? Math.round((stats.kinesitherapeutes / stats.total) * 100) : 0}% du total
            </div>
          </motion.div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Bar Chart - Profession Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
          >
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#1A202C] mb-1">Répartition par profession</h3>
              <p className="text-sm text-[#718096]">Nombre de pré-inscriptions par catégorie</p>
            </div>
            {stats.total > 0 ? (
              <ResponsiveContainer width="100%" height={300} key="bar-chart">
                <BarChart data={professionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis
                    dataKey="profession"
                    tick={{ fill: '#718096', fontSize: 12 }}
                    tickFormatter={(value) => {
                      const item = professionData.find((p) => p.profession === value);
                      return item ? `${item.emoji} ${value}` : value;
                    }}
                  />
                  <YAxis tick={{ fill: '#718096', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #E2E8F0',
                      borderRadius: '12px',
                      padding: '12px',
                    }}
                  />
                  <Bar dataKey="count" fill="#1FBF9A" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-[#718096]">
                Aucune donnée disponible
              </div>
            )}
          </motion.div>

          {/* Pie Chart - Percentage by profession */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
          >
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#1A202C] mb-1">Pourcentage par profession</h3>
              <p className="text-sm text-[#718096]">Distribution en pourcentage</p>
            </div>
            {stats.total > 0 ? (
              <ResponsiveContainer width="100%" height={300} key="pie-chart">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #E2E8F0',
                      borderRadius: '12px',
                      padding: '12px',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-[#718096]">
                Aucune donnée disponible
              </div>
            )}
          </motion.div>
        </div>

        {/* Line Chart - Inscriptions over time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
        >
          <div className="mb-6">
            <h3 className="text-xl font-bold text-[#1A202C] mb-1">Inscriptions au fil du temps</h3>
            <p className="text-sm text-[#718096]">Évolution du nombre de pré-inscriptions par jour</p>
          </div>
          {stats.total > 0 ? (
            <ResponsiveContainer width="100%" height={300} key="line-chart">
              <LineChart data={inscriptionsByDate}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#718096', fontSize: 12 }}
                />
                <YAxis tick={{ fill: '#718096', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '12px',
                  }}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                      return payload[0].payload.fullDate;
                    }
                    return label;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#1FBF9A"
                  strokeWidth={3}
                  dot={{ fill: '#1FBF9A', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-[#718096]">
              Aucune donnée disponible
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}