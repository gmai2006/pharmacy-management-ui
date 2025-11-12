import React from "react";
import StatusBadge from "./StatusBadge";

export default function PickupTable({ prescriptions }) {
  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg">
      <table className="min-w-full text-left">
        <thead className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
          <tr>
            <th className="px-4 py-3">Rx#</th>
            <th className="px-4 py-3">Patient</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Last Updated</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {prescriptions.map((rx) => (
            <tr key={rx.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3 font-medium">{rx.rxNumber}</td>
              <td className="px-4 py-3">{rx.patientName}</td>
              <td className="px-4 py-3">{rx.patientPhone}</td>
              <td className="px-4 py-3">
                <StatusBadge status={rx.workflowStatus} />
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">
                {new Date(rx.lastStatusUpdate).toLocaleString()}
              </td>
              <td className="px-4 py-3 text-right">
                <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                  View Details
                </button>
              </td>
            </tr>
          ))}

          {prescriptions.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center py-6 text-gray-500">
                No prescriptions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}