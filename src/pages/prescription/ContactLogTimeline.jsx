import React from "react";
import {
  Mail,
  Phone,
  FileText,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";

const ContactLogTimeline = ({ log, actions, attachments }) => {
  if (!log) return <div>No contact log found.</div>;

  const getMethodIcon = (method) => {
    switch (method) {
      case "phone": return <Phone className="text-blue-600" size={18} />;
      case "fax": return <FileText className="text-purple-600" size={18} />;
      case "secure_msg": return <MessageSquare className="text-green-600" size={18} />;
      case "ncpdp_rxchange": return <Mail className="text-orange-500" size={18} />;
      default: return <AlertCircle className="text-gray-500" size={18} />;
    }
  };

  const statusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      sent: "bg-blue-100 text-blue-800",
      acknowledged: "bg-purple-100 text-purple-800",
      resolved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="p-4">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
          {getMethodIcon(log.contactMethod)}
          Contact Prescriber
        </h2>
        <div className="text-sm text-gray-500">
          Reason: {log.contactReason.replace("_", " ")}
        </div>
        <div className="mt-2">{statusBadge(log.status)}</div>
      </div>

      {/* Timeline */}
      <div className="relative border-l border-gray-300 ml-4">

        {/* Primary Log Entry */}
        <div className="mb-8 ml-4 relative">
          <div className="absolute -left-5 top-0 w-3 h-3 rounded-full bg-blue-600"></div>

          <div className="bg-white shadow-sm rounded-lg p-4 border">
            <div className="flex justify-between mb-2">
              <div className="font-medium">Initial Contact</div>
              <div className="text-sm text-gray-500">{log.createdAt}</div>
            </div>

            <div className="text-sm text-gray-700">
              {log.contactDetails}
            </div>

            {(log.sentAt || log.acknowledgedAt || log.resolvedAt) && (
              <div className="mt-3 space-y-1 text-xs text-gray-500">
                {log.sentAt && <div>📤 Sent: {log.sentAt}</div>}
                {log.acknowledgedAt && <div>📨 Acknowledged: {log.acknowledgedAt}</div>}
                {log.resolvedAt && <div>✔ Resolved: {log.resolvedAt}</div>}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        {actions && actions.map((a) => (
          <div key={a.id} className="mb-8 ml-4 relative">
            <div className="absolute -left-5 top-0 w-3 h-3 rounded-full bg-gray-500"></div>

            <div className="bg-white shadow-sm rounded-lg p-3 border">
              <div className="flex justify-between mb-1">
                <div className="font-medium text-sm">
                  {a.actionType.replace("_", " ").toUpperCase()}
                </div>
                <div className="text-xs text-gray-500">{a.createdAt}</div>
              </div>

              <div className="text-sm text-gray-700">{a.details}</div>
            </div>
          </div>
        ))}

        {/* Attachments */}
        {attachments && attachments.length > 0 && (
          <div className="ml-4 relative mb-8">
            <div className="absolute -left-5 top-0 w-3 h-3 rounded-full bg-purple-600"></div>

            <div className="bg-white shadow-sm rounded-lg p-4 border">
              <div className="font-medium mb-2">Attachments</div>
              <ul className="text-sm">
                {attachments.map((att) => (
                  <li key={att.id} className="mb-1">
                    <a
                      href={`/download/${att.id}`}
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <FileText size={14} /> {att.fileName}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ContactLogTimeline;