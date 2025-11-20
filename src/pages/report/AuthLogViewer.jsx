
import init from "../../init";
const getUrl = `/${init.appName}/api/authlogs/select/100`;


import React, { useState, useEffect } from 'react';
import { Search, Calendar, ChevronLeft, ChevronRight, AlertCircle, CheckCircle, LogOut } from 'lucide-react';

export default function AuthLogAdmin() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState('7');
  const [loading, setLoading] = useState(false);

  const pageSize = 10;

  const fetchLogs = async () => {
    setLoading(true);
    try {
    //   const response = await fetch(`/api/authlogs?page=${page}&size=${pageSize}&search=${search}&days=${dateRange}`);
      const response = await fetch(getUrl);
      const json = await response.json();
      setLogs(json);
    //   setTotalPages(json.totalPages);
    } catch (e) {
      console.error("Error loading logs", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, [page, search, dateRange]);

  const badge = (event) => {
    if (event === 'success')
      return <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700 flex items-center gap-1">
        <CheckCircle className="w-3 h-3" /> Success
      </span>;

    if (event === 'failure')
      return <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-700 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" /> Failed
      </span>;

    return <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-700 flex items-center gap-1">
      <LogOut className="w-3 h-3" /> Logout
    </span>;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Authentication Logs</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex items-center bg-white px-3 py-2 rounded shadow">
          <Search className="text-gray-500 w-5 h-5 mr-2" />
          <input
            type="text"
            className="outline-none"
            placeholder="Search user or IP..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        <div className="flex items-center bg-white px-3 py-2 rounded shadow">
          <Calendar className="text-gray-500 w-5 h-5 mr-2" />
          <select
            className="outline-none bg-transparent"
            value={dateRange}
            onChange={(e) => { setDateRange(e.target.value); setPage(1); }}
          >
            <option value="1">Last 24 Hours</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="365">Last Year</option>
            <option value="9999">All Time</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">IP</th>
              <th className="px-4 py-3">User Agent</th>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">Reason</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-4 py-4 text-center" colSpan="6">Loading…</td></tr>
            ) : logs.length === 0 ? (
              <tr><td className="px-4 py-4 text-center" colSpan="6">No logs found</td></tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{log.username}</td>
                  <td className="px-4 py-3">{log.eventType}</td>
                  <td className="px-4 py-3">{badge(log.status)}</td>
                  <td className="px-4 py-3">{log.idAddress}</td>
                  <td className="px-4 py-3 text-xs max-w-xs truncate">{log.userAgent}</td>
                  <td className="px-4 py-3">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3 text-red-600">{JSON.stringify(log.metadata)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 flex items-center gap-1"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          <ChevronLeft className="w-4 h-4" /> Prev
        </button>

        <span className="text-sm text-gray-700">Page {page} of {totalPages}</span>

        <button
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 flex items-center gap-1"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
