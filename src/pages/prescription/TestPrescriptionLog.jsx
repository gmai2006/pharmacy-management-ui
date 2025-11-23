export const dummyContactLog = {
  id: "log-001",
  prescriptionId: "rx-2025-001",
  prescriberId: "prescriber-100",
  contactMethod: "ncpdp_rxchange",
  contactReason: "dose_issue",
  contactDetails: "AI detected unusually high dosage for pediatric patient. Requested prescriber clarification.",
  aiTriggerId: "ai-7788",
  status: "resolved",
  sentAt: "2025-01-15T10:22:00Z",
  acknowledgedAt: "2025-01-15T12:10:00Z",
  resolvedAt: "2025-01-15T13:45:00Z",
  createdBy: "pharmacist-22",
  createdAt: "2025-01-15T10:20:00Z",
  updatedAt: "2025-01-15T13:45:00Z"
};


export const dummyActions = [
  {
    id: "action-01",
    contactLogId: "log-001",
    actionType: "message_sent",
    details: "Sent RxChangeRequest to prescriber for dosage clarification.",
    createdBy: "pharmacist-22",
    createdAt: "2025-01-15T10:22:00Z"
  },
  {
    id: "action-02",
    contactLogId: "log-001",
    actionType: "fax_sent",
    details: "Auto-generated fax sent due to no response on initial RxChange request.",
    createdBy: "tech-11",
    createdAt: "2025-01-15T10:40:00Z"
  },
  {
    id: "action-03",
    contactLogId: "log-001",
    actionType: "message_received",
    details: "Prescriber responded: 'Reduce dose to 250mg BID'.",
    createdBy: null,
    createdAt: "2025-01-15T12:10:00Z"
  },
  {
    id: "action-04",
    contactLogId: "log-001",
    actionType: "pharmacy_updated_rx",
    details: "Updated prescription to new clarified dose. Updated workflow logs.",
    createdBy: "pharmacist-22",
    createdAt: "2025-01-15T13:45:00Z"
  }
];

export const dummyAttachments = [
  {
    id: "att-01",
    contactLogId: "log-001",
    fileName: "DoseClarificationFax.pdf",
    fileType: "pdf",
    metadata: { pages: 2, sender: "Pharmacy Fax Service" },
    createdAt: "2025-01-15T10:41:00Z"
  },
  {
    id: "att-02",
    contactLogId: "log-001",
    fileName: "PrescriberReply.txt",
    fileType: "text",
    metadata: { encoding: "utf-8" },
    createdAt: "2025-01-15T12:15:00Z"
  }
];

import ContactLogTimeline from './ContactLogTimeline';

export default function ContactLogTestPage() {
  return (
    <div className="p-6">
      <ContactLogTimeline
        log={dummyContactLog}
        actions={dummyActions}
        attachments={dummyAttachments}
      />
    </div>
  );
}