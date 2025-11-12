import React, { useEffect, useState } from "react";
import PickupTable from "./PickupTable";
import FilterTabs from "./FilterTabs";
import SearchBar from "./SearchBar";

export default function PickupDashboard() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ready_for_pickup");
  const [search, setSearch] = useState("");

  // ✅ Polling every 10 seconds (or replace with WebSocket)
  useEffect(() => {
    fetchPrescriptions();
    const interval = setInterval(fetchPrescriptions, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchPrescriptions = async () => {
    const res = await fetch(`/api/prescriptions?status=${statusFilter}`);
    const data = await res.json();
    setPrescriptions(data);
  };

  const filtered = prescriptions.filter((p) =>
    p.patientName.toLowerCase().includes(search.toLowerCase()) ||
    p.rxNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Pickup Dashboard</h1>
      </div>

      <FilterTabs status={statusFilter} setStatus={setStatusFilter} setData={setPrescriptions} />

      <div className="flex justify-between items-center">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      <PickupTable prescriptions={filtered} />
    </div>
  );
}