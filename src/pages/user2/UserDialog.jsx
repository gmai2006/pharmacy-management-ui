import { X } from "lucide-react";
import { useState } from "react";

const UserDialog = ({ title, endtitle, roles, formData, loading, handleAddOrUpdate, setShowDialog }) => {
    const [errors, setErrors] = useState({});
    const [local, setLocal] = useState(formData);

    const handleButtonClick = (e) => {
        if (!validateForm()) return;
        setErrors({});
        handleAddOrUpdate(local);
    }

    // Handle dialog close
    const handleCloseDialog = () => {
        setShowDialog(false);
        // setFormData({
        //     username: '',
        //     displayName: '',
        //     email: '',
        //     roleId: 1,
        //     isActive: true
        // });
        // setErrors({});
    };

    // Validation function
    const validateForm = () => {
        const newErrors = {};

        if (!local.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (local.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        } else if (!/^[a-zA-Z0-9_-]+$/.test(local.username)) {
            newErrors.username = 'Username can only contain letters, numbers, hyphens, and underscores';
        }

        if (!local.displayName.trim()) {
            newErrors.displayName = 'Display name is required';
        }

        if (!local.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(local.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLocal(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    return (
        <div>
             {/* Dialog Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                    <button
                        onClick={handleCloseDialog}
                        disabled={loading}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-50 transition"
                    >
                        <X size={24} />
                    </button>
                </div>


            <div className="px-6 py-4 space-y-4">
                {/* Username Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                    </label>
                    <input
                        type="text"
                        name="username"
                        value={local.username}
                        onChange={handleInputChange}
                        placeholder="e.g., john_doe"
                        disabled={loading}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100 ${errors.username ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                    {errors.username && (
                        <p className="text-red-600 text-sm mt-1">{errors.username}</p>
                    )}
                </div>

                {/* Display Name Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Display Name
                    </label>
                    <input
                        type="text"
                        name="displayName"
                        value={local.displayName}
                        onChange={handleInputChange}
                        placeholder="e.g., John Doe"
                        disabled={loading}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100 ${errors.displayName ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                    {errors.displayName && (
                        <p className="text-red-600 text-sm mt-1">{errors.displayName}</p>
                    )}
                </div>

                {/* Email Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={local.email}
                        onChange={handleInputChange}
                        placeholder="e.g., john@example.com"
                        disabled={loading}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100 ${errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                    {errors.email && (
                        <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                    )}
                </div>

                {/* Role Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                    </label>
                    <select
                        name="roleId"
                        value={local.roleId}
                        onChange={handleInputChange}
                        disabled={loading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100"
                    >
                        {roles.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.name}
                            </option>
                        ))}

                    </select>
                </div>

                {/* Active Status Checkbox */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="isActive"
                        id="isActive"
                        checked={local.isActive}
                        onChange={handleInputChange}
                        disabled={loading}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
                    />
                    <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
                        Active user
                    </label>
                </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                    onClick={handleCloseDialog}
                    disabled={loading}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition font-medium"
                >
                    Cancel
                </button>
                <button
                    onClick={handleButtonClick}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
                >
                    {loading ? 'Loading...' : endtitle}
                </button>
            </div>
        </div>

    )
}
export default UserDialog;