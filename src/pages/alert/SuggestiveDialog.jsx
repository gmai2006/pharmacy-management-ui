import { X } from "lucide-react";

const SuggestiveDialog = ({ formData, setFormData, closeModal, handleModalSubmit }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">
                            Suggest Alternative Medication
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Propose a safer alternative medication
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Alternative Medication *
                        </label>
                        <textarea
                            value={formData.alternative}
                            onChange={e => setFormData({ ...formData, alternative: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                            rows="4"
                            placeholder="e.g., Recommend switching to Ibuprofen 400mg..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Clinical Justification
                        </label>
                        <textarea
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                            rows="3"
                            placeholder="Explain why this alternative is safer..."
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
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
                    >
                        Suggest Alternative
                    </button>
                </div>
            </div>
        </div>
    )
};
export default SuggestiveDialog;