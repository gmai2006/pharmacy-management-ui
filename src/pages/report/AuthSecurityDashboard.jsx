import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Activity,
  TrendingUp,
  Users,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Globe2,
  Filter
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';

// Dummy mock data for initial testing
const mockDailyStats = [
  { date: '2025-11-12', successes: 180, failures: 4 },
  { date: '2025-11-13', successes: 210, failures: 5 },
  { date: '2025-11-14', successes: 220, failures: 6 },
  { date: '2025-11-15', successes: 205, failures: 7 },
  { date: '2025-11-16', successes: 198, failures: 8 },
  { date: '2025-11-17', successes: 250, failures: 15 }, // spike
  { date: '2025-11-18', successes: 260, failures: 18 }, // spike
];

const mockTopUsers = [
  { username: 'jpharm01', successes: 48, failures: 1, lastLogin: '2025-11-18 08:15', anomaly: false },
  { username: 'tech_maria', successes: 52, failures: 3, lastLogin: '2025-11-18 08:31', anomaly: false },
  { username: 'night_admin', successes: 5, failures: 12, lastLogin: '2025-11-18 02:07', anomaly: true },
  { username: 'student_worker', successes: 20, failures: 7, lastLogin: '2025-11-18 19:42', anomaly: true },
];

const mockTopIps = [
  { ip: '10.0.0.12', location: 'On-prem LAN', successes: 150, failures: 2, anomaly: false },
  { ip: '10.0.0.21', location: 'On-prem LAN', successes: 90, failures: 1, anomaly: false },
  { ip: '203.0.113.5', location: 'Unknown / External', successes: 2, failures: 14, anomaly: true },
  { ip: '198.51.100.9', location: 'VPN Endpoint', successes: 12, failures: 6, anomaly: true },
];

const mockAnomalies = [
  {
    id: 1,
    type: 'FAILED_LOGIN_SPIKE',
    severity: 'high',
    message: 'Failed logins increased 3x vs baseline in last 24 hours.',
    window: 'Last 24 hours',
    detectedAt: '2025-11-18 08:25',
  },
  {
    id: 2,
    type: 'AFTER_HOURS_ACCESS',
    severity: 'medium',
    message: 'Multiple logins between 01:00–03:00 from user "night_admin".',
    window: 'Last 7 days',
    detectedAt: '2025-11-18 02:15',
  },
  {
    id: 3,
    type: 'EXTERNAL_IP',
    severity: 'medium',
    message: 'Failed logins from external IP 203.0.113.5 (not in allowed ranges).',
    window: 'Last 24 hours',
    detectedAt: '2025-11-18 07:51',
  },
];

export default function AuthSecurityDashboard() {
  const [dateRange, setDateRange] = useState('7d');
  const [dailyStats, setDailyStats] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [topIps, setTopIps] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Replace this later with your real API calls
  const loadData = async () => {
    try {
      setLoading(true);

      // Example: you could do fetch('/api/security/auth/summary?range=7d')
      // For now we just set mock data.
      setDailyStats(mockDailyStats);
      setTopUsers(mockTopUsers);
      setTopIps(mockTopIps);
      setAnomalies(mockAnomalies);
    } catch (e) {
      console.error('Error loading auth dashboard data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [dateRange]);

  const totalSuccess = dailyStats.reduce((sum, d) => sum + d.successes, 0);
  const totalFailures = dailyStats.reduce((sum, d) => sum + d.failures, 0);
  const failureRate = totalSuccess + totalFailures > 0
    ? (totalFailures / (totalSuccess + totalFailures)) * 100
    : 0;

  const totalUsers = topUsers.length;
  const highSeverityCount = anomalies.filter(a => a.severity === 'high').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 mx-auto mb-3 text-indigo-600 animate-spin" />
          <p className="text-gray-700 font-medium">Loading authentication security dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 text-indigo-700 rounded-xl p-2">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Auth & Security Dashboard
              </h1>
              <p className="text-xs text-gray-500">
                Monitor login trends, failures, and potential security anomalies
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-gray-100 rounded-lg px-2">
              <Filter className="w-4 h-4 text-gray-500 mr-1" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-gray-100 text-xs text-gray-700 py-1 px-1 focus:outline-none"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* KPI Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total logins */}
          <div className="bg-white rounded-xl shadow-sm border p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-gray-500">Total Logins</p>
              <div className="bg-indigo-50 text-indigo-600 rounded-lg p-1.5">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {totalSuccess + totalFailures}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Success: <span className="text-green-600 font-semibold">{totalSuccess}</span> •
              Failures: <span className="text-red-600 font-semibold">{totalFailures}</span>
            </p>
          </div>

          {/* Failure rate */}
          <div className="bg-white rounded-xl shadow-sm border p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-gray-500">Failure Rate</p>
              <div className="bg-red-50 text-red-600 rounded-lg p-1.5">
                <XCircle className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {failureRate.toFixed(2)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Threshold: <span className={failureRate > 5 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
                {failureRate > 5 ? 'Above normal' : 'Within normal'}
              </span>
            </p>
          </div>

          {/* Active users */}
          <div className="bg-white rounded-xl shadow-sm border p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-gray-500">Active Users</p>
              <div className="bg-sky-50 text-sky-600 rounded-lg p-1.5">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {totalUsers}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Users with at least one login in the selected period
            </p>
          </div>

          {/* Anomalies */}
          <div className="bg-white rounded-xl shadow-sm border p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-gray-500">Security Anomalies</p>
              <div className="bg-amber-50 text-amber-600 rounded-lg p-1.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {anomalies.length}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              High severity: <span className={highSeverityCount > 0 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
                {highSeverityCount}
              </span>
            </p>
          </div>
        </section>

        {/* Charts row */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Login trend */}
          <div className="bg-white rounded-xl shadow-sm border p-4 lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                <h2 className="text-sm font-semibold text-gray-900">Login Trend</h2>
              </div>
              <p className="text-xs text-gray-500">
                Success vs failed login attempts over time
              </p>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="successes" stroke="#16A34A" strokeWidth={2} name="Successes" />
                  <Line type="monotone" dataKey="failures" stroke="#EF4444" strokeWidth={2} name="Failures" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Failures by IP */}
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-purple-600" />
                <h2 className="text-sm font-semibold text-gray-900">Top Failing IPs</h2>
              </div>
              <p className="text-xs text-gray-500">Potential brute-force or external attacks</p>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mockTopIps.map(ip => ({
                    name: ip.ip,
                    failures: ip.failures,
                    successes: ip.successes,
                  }))}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis type="number" stroke="#6B7280" fontSize={12} />
                  <YAxis type="category" dataKey="name" stroke="#6B7280" fontSize={11} width={90} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="failures" fill="#EF4444" name="Failures" />
                  <Bar dataKey="successes" fill="#22C55E" name="Successes" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Anomalies + Top Users */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Anomaly list */}
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <h2 className="text-sm font-semibold text-gray-900">Security Anomalies</h2>
              </div>
              <span className="text-xs text-gray-500">
                {anomalies.length} detected
              </span>
            </div>
            <div className="space-y-3">
              {anomalies.length === 0 && (
                <p className="text-xs text-gray-500 py-4 text-center">
                  No anomalies detected for the selected period
                </p>
              )}
              {anomalies.map((a) => (
                <div
                  key={a.id}
                  className="border rounded-lg px-3 py-2 bg-gray-50 flex items-start gap-3"
                >
                  <div className={`mt-0.5 rounded-full p-1.5 ${
                    a.severity === 'high'
                      ? 'bg-red-100 text-red-700'
                      : a.severity === 'medium'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {a.severity === 'high' ? (
                      <AlertTriangle className="w-3 h-3" />
                    ) : (
                      <Activity className="w-3 h-3" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-gray-900">
                        {a.type.replace(/_/g, ' ')}
                      </p>
                      <span className="text-[10px] text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {a.detectedAt}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{a.message}</p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      Window: {a.window}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top users table */}
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-sky-600" />
                <h2 className="text-sm font-semibold text-gray-900">Top Users (by activity)</h2>
              </div>
              <span className="text-xs text-gray-500">
                Focus on users with high failure counts
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-2 px-2 font-semibold text-gray-600">User</th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-600">Success</th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-600">Fail</th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-600">Last Login</th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {topUsers.map(u => {
                    const failRate = (u.failures / Math.max(1, u.successes + u.failures)) * 100;
                    const isSuspicious = u.anomaly || failRate > 10;
                    return (
                      <tr key={u.username} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-2 px-2 font-medium text-gray-800">{u.username}</td>
                        <td className="py-2 px-2 text-center text-green-700">{u.successes}</td>
                        <td className="py-2 px-2 text-center text-red-600">{u.failures}</td>
                        <td className="py-2 px-2 text-center text-gray-600">{u.lastLogin}</td>
                        <td className="py-2 px-2 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                              isSuspicious
                                ? 'bg-red-100 text-red-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {isSuspicious ? (
                              <>
                                <AlertTriangle className="w-3 h-3" />
                                Suspicious
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-3 h-3" />
                                Normal
                              </>
                            )}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {topUsers.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-gray-500">
                        No user activity in the selected range
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
