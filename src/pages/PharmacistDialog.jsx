import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const PharmacistDialog = ({ data, setShowModal, showNotification, addOrUpdate }) => {
  const [formData, setFormData] = useState({
    user_id: '',
    license_number: '',
    license_state: '',
    active: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (data) {
      setFormData(data);
    } else {
      setFormData({
        user_id: '',
        license_number: '',
        license_state: '',
        active: true,
      });
    }
    setErrors({});
  }, [data]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.user_id.trim()) {
      newErrors.user_id = 'User ID is required';
    }

    if (!formData.license_number.trim()) {
      newErrors.license_number = 'License Number is required';
    }

    if (!formData.license_state) {
      newErrors.license_state = 'License State is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    addOrUpdate(formData);
  };

  const handleClose = () => {
    setShowModal(false);
    setErrors({});
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {data?.id ? 'Edit Pharmacist' : 'Add New Pharmacist'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* User ID */}
          <div>
            <label htmlFor="user_id" className="block text-sm font-medium text-gray-700 mb-1">
              User ID <span className="text-red-500">*</span>
            </label>
            <input
              id="user_id"
              type="text"
              name="user_id"
              value={formData.user_id}
              onChange={handleInputChange}
              placeholder="e.g., user-123"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                errors.user_id ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.user_id && (
              <p className="mt-1 text-sm text-red-500">{errors.user_id}</p>
            )}
          </div>

          {/* License Number */}
          <div>
            <label htmlFor="license_number" className="block text-sm font-medium text-gray-700 mb-1">
              License Number <span className="text-red-500">*</span>
            </label>
            <input
              id="license_number"
              type="text"
              name="license_number"
              value={formData.license_number}
              onChange={handleInputChange}
              placeholder="e.g., RxPH-2024-001"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                errors.license_number ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.license_number && (
              <p className="mt-1 text-sm text-red-500">{errors.license_number}</p>
            )}
          </div>

          {/* License State */}
          <div>
            <label htmlFor="license_state" className="block text-sm font-medium text-gray-700 mb-1">
              License State <span className="text-red-500">*</span>
            </label>
            <select
              id="license_state"
              name="license_state"
              value={formData.license_state}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                errors.license_state ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a state...</option>
              {US_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {errors.license_state && (
              <p className="mt-1 text-sm text-red-500">{errors.license_state}</p>
            )}
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <input
              id="active"
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="active" className="text-sm font-medium text-gray-700">
              Active License
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
            >
              {data?.id ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PharmacistDialog;