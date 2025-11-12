import React from "react";

export default function FilterTabs({ status, setStatus }) {
  const tabs = [
    { key: "ready_for_pickup", label: "Ready for Pickup" },
    { key: "picked_up", label: "Completed" }
  ];

  return (
    <div className="flex space-x-4 border-b mb-4">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => setStatus(t.key)}
          className={`pb-2 px-2 border-b-2 text-sm font-medium 
            ${
              status === t.key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}