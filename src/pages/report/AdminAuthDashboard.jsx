import React, { useState, useEffect } from 'react';
import { Download, AlertTriangle, CheckCircle, Clock, Shield } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

export default function AuthLogDashboard() {
  const [activeTab, setActiveTab] = useState('logs');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Fetch dummy logs (replace with API)
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const dummyLogs = Array.from({ length: 65 }).map((_, i) => ({
        id: i + 1,
        username: `user${(i % 5) + 1}`,
        ip: `192.168.0.${(i % 20) + 1}`,
        status: i % 7 === 0 ? 'FAILURE' : 'SUCCESS',
        timestamp: Date.now() - i * 3600 * 1000
      }));
      setLogs(dummyLogs);
      setLoading(false);
    }, 500);
  }, []);

  const paginatedLogs = logs.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(logs.length / pageSize);

  // Login trend chart data
  const trendData = Object.values(
    logs.reduce((acc, log) => {
      const date = new Date(log.timestamp).toLocaleDateString();
      if (!acc[date]) acc[date] = { date, success: 0, failure: 0 };
      log.status === 'SUCCESS' ? acc[date].success++ : acc[date].failure++;
      return acc;
    }, {})
  );

  // Export CSV
  const exportCSV = () => {
    const csv = [
      ['ID', 'Username', 'IP', 'Status', 'Timestamp'].join(','),
      ...logs.map(l =>
        [l.id, l.username, l.ip, l.status, new Date(l.timestamp).toISOString()].join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auth_logs_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-600">
        Loading authentication logs...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
       {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Authentication Log Dashboard</h1>
          <p className="text-sm text-gray-500">System Authentication Monitoring</p>
        </div>
      </div>

     


      <div className="max-w-7xl mx-auto mt-6 px-4">

        {/* Tabs */}
        <div className="flex border-b mb-6">
          {['logs', 'trends', 'security'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === tab
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              {tab === 'logs' && 'Auth Logs'}
              {tab === 'trends' && 'Login Trends'}
              {tab === 'security' && 'Security Alerts'}
            </button>
          ))}
        </div>

        {/* Export Button */}
        <button
          onClick={exportCSV}
          className="mb-4 px-4 py-2 bg-black text-white rounded shadow hover:bg-gray-800 flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Export Logs CSV
        </button>

        {/* TAB 1: Authentication Logs */}
        {activeTab === 'logs' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Authentication Logs</h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="text-left p-3">User</th>
                    <th className="text-left p-3">IP Address</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLogs.map(log => (
                    <tr
                      key={log.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-3">{log.username}</td>
                      <td className="p-3">{log.ip}</td>

                      <td className="p-3">
                        {log.status === 'SUCCESS' ? (
                          <span className="text-green-700 bg-green-100 px-2 py-1 rounded-full text-xs flex items-center gap-1 w-fit">
                            <CheckCircle className="w-3 h-3" /> SUCCESS
                          </span>
                        ) : (
                          <span className="text-red-700 bg-red-100 px-2 py-1 rounded-full text-xs flex items-center gap-1 w-fit">
                            <AlertTriangle className="w-3 h-3" /> FAILURE
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-gray-700">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>

              <span className="text-gray-700">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Login Trends */}
        {activeTab === 'trends' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Login Trend Chart</h2>
            <div className="height-64" style={{ height: '350px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="success"
                    stroke="#16a34a"
                    strokeWidth={2}
                    name="Successful Logins"
                  />
                  <Line
                    type="monotone"
                    dataKey="failure"
                    stroke="#dc2626"
                    strokeWidth={2}
                    name="Failed Logins"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* TAB 3: Security Alerts (Failure Insights) */}
        {activeTab === 'security' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Security Anomalies</h2>

            <div className="space-y-3">
              {logs.filter(l => l.status === 'FAILURE').slice(0, 10).map(l => (
                <div
                  key={l.id}
                  className="p-3 bg-red-50 border-l-4 border-red-600 rounded"
                >
                  <p className="text-red-700 font-semibold">
                    Failed login attempt
                  </p>
                  <p className="text-sm text-red-700">
                    User: {l.username} • IP: {l.ip} • Time:{' '}
                    {new Date(l.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
