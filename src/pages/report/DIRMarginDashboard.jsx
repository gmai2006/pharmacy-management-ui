import React, { useState, useMemo, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";


import init from "../../init";

const getUrl = `/${init.appName}/api/view/prescriptiondirsummary/100`;
const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};


// CSV Export Helper
const exportCSV = (rows) => {
  const header = Object.keys(rows[0]).join(",");
  const body = rows.map(r => Object.values(r).join(",")).join("\n");
  const csv = header + "\n" + body;

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "dir_margin_export.csv";
  a.click();
};

export default function DirMarginDashboard() {
  const [search, setSearch] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [page, setPage] = useState(1);
  const [dirFee, setDirFee] = useState([]);

  const rowsPerPage = 10;

  const fetchData = async () => {
    try {
      const response = await fetch(getUrl, { headers: headers });
      const jsonData = await response.json();

      // Ensure data is an array
      const dirFees = Array.isArray(jsonData) ? jsonData : [jsonData];
      setDirFee(dirFees);
      console.log('DIR fees loaded:', dirFees);
    } catch (error) {
      console.error('Error fetching data:', error);
      setDirFee([]);
    } finally {
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtering Logic
  const filtered = useMemo(() => {
    return dirFee.filter(row => {
      const matchesSearch = search.length === 0 ? true : row.prescriptionId.toLowerCase().includes(search.toLowerCase());

      const rowDate = new Date(row.posCreatedAt);

      const matchesStart = dateStart ? rowDate >= new Date(dateStart) : true;
      const matchesEnd = dateEnd ? rowDate <= new Date(dateEnd) : true;

      return matchesSearch && matchesStart && matchesEnd;
    });
  }, [dirFee, search, dateStart, dateEnd]);

  // Pagination Logic
  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  return (
    <div className="p-6 space-y-8">

      {/* ---------------- HEADER ---------------- */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">DIR Margin Dashboard</h1>
        <button
          onClick={() => exportCSV(filtered)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Export CSV
        </button>
      </div>

      {/* ---------------- FILTER BAR ---------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-100 p-4 rounded shadow">
        <input
          type="text"
          placeholder="Search Rx ID..."
          value={search}
          onChange={(e) => { setPage(1); setSearch(e.target.value); }}
          className="border rounded px-3 py-2 w-full"
        />
        <input
          type="date"
          value={dateStart}
          onChange={(e) => { setPage(1); setDateStart(e.target.value); }}
          className="border rounded px-3 py-2 w-full"
        />
        <input
          type="date"
          value={dateEnd}
          onChange={(e) => { setPage(1); setDateEnd(e.target.value); }}
          className="border rounded px-3 py-2 w-full"
        />
      </div>

      {/* ---------------- TREND GRAPH ---------------- */}
      <div className="bg-white shadow p-4 rounded">
        <h2 className="text-xl font-semibold mb-4">DIR Margin Trend</h2>

        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={filtered}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="netAfterDirFees" stroke="#2563eb" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ---------------- TABLE ---------------- */}
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="px-4 py-2">Rx ID</th>
              <th className="px-4 py-2">POS Total</th>
              <th className="px-4 py-2">Payments</th>
              <th className="px-4 py-2">DIR Fees</th>
              <th className="px-4 py-2">Net Margin</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((row) => (
              <tr key={row.prescriptionId} className="border-b">
                <td className="px-4 py-2">{row.prescriptionId}</td>
                <td className="px-4 py-2">${row.totalPosAmount.toFixed(2)}</td>
                <td className="px-4 py-2">${row.totalPayments.toFixed(2)}</td>
                <td className="px-4 py-2">${row.totalDirFees.toFixed(2)}</td>
                <td className="px-4 py-2 font-semibold text-green-700">
                  ${row.netAfterDirFees.toFixed(2)}
                </td>
                <td className="px-4 py-2">{new Date(row.posCreatedAt).toDateString()}</td>
              </tr>
            ))}

            {paginated.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ---------------- PAGINATION ---------------- */}
      <div className="flex justify-center items-center space-x-4 pt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className={`px-4 py-2 rounded ${page === 1 ? "bg-gray-300" : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
        >
          Prev
        </button>

        <span className="font-semibold">
          Page {page} / {totalPages || 1}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className={`px-4 py-2 rounded ${page === totalPages ? "bg-gray-300" : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
