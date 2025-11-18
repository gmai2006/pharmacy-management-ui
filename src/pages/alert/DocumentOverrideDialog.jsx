import { X } from "lucide-react";

const DocumentOverrideDialog = ({ formData, setFormData, closeModal, handleModalSubmit }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Document Override</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Document the clinical rationale for overriding this alert
                        </p>
                    </div>
                    <button
                        onClick={closeModal}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-yellow-800">
                            <strong>⚠️ Override Alert:</strong> This action documents that the
                            prescriber was aware of the alert and has chosen to proceed.
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Override Reason *
                        </label>
                        <textarea
                            value={formData.reason}
                            onChange={e => setFormData({ ...formData, reason: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                            rows="4"
                            placeholder="e.g., Patient requires aggressive pain management..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Monitoring Plan
                        </label>
                        <textarea
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                            rows="3"
                            placeholder="Describe follow-up monitoring..."
                        />
                    </div>
                </div>
                <div className="flex gap-3 p-6 border-t border-gray-200 justify-end">
                    <button
                        onClick={closeModal}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleModalSubmit}
                        className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-medium"
                    >
                        Document Override
                    </button>
                </div>
            </div>
        </div>
    )
};
export default DocumentOverrideDialog;