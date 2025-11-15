import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
const UserDialog = ({ user, editingId, setShowModal, showNotification, addOrUpdate }) => {
    const [localUser, setLocalUser] = useState(user);

    useEffect(() => {
        setLocalUser(user);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!localUser.username || !localUser.displayName || !localUser.email) {
            showNotification('Username, display name, and email are required', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(localUser.email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        addOrUpdate(localUser);
    }

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLocalUser({
            ...localUser,
            [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {editingId ? 'Edit User' : 'Add New User'}
                    </h2>
                    <button
                        onClick={() => {
                            setShowModal(false);
                            setEditingId(null);
                            resetForm();
                        }}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Username and Display Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Username *
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={localUser.username}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="e.g., jdoe"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Display Name *
                            </label>
                            <input
                                type="text"
                                name="displayName"
                                value={localUser.displayName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="e.g., John Doe"
                                required
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={localUser.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="user@pharmacy.com"
                            required
                        />
                    </div>

                    {/* Role and Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Role
                            </label>
                            <select
                                name="roleId"
                                value={localUser.roleId}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value={1}>Admin</option>
                                <option value={2}>Pharmacist</option>
                                <option value={3}>Technician</option>
                                <option value={4}>Viewer</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={localUser.isActive}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                                />
                                <span className="text-gray-700 font-medium">Active User</span>
                            </label>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-4 justify-end pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => {
                                setShowModal(false);
                                setEditingId(null);
                                resetForm();
                            }}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                        >
                            {editingId ? 'Update User' : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default UserDialog;