import React from 'react';

export default function StatusBadge({ status }) {
  const map = {
    ready_for_pickup: "bg-green-100 text-green-800",
    picked_up: "bg-blue-100 text-blue-800",
    complete: "bg-gray-200 text-gray-700",
  };

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${map[status] || "bg-gray-100 text-gray-600"}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}