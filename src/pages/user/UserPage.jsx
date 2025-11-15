import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

import init from "../../init";
import UserSummary from '../user/UserSummary';
import Notification from './Notification';
import UserDialog from './UserDialog';

const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};
const userSelectUrl = '/' + init.appName + '/api/' + 'users/select/100';
const roleUrl = '/' + init.appName + '/api/' + 'roles/selectAll';
const userUrl = `/${init.appName}/api/users/`;

const roleOptions = {
    1: { color: 'bg-red-100 text-red-800' },
    2: { color: 'bg-blue-100 text-blue-800' },
    3: { color: 'bg-green-100 text-green-800' },
    4: { color: 'bg-gray-100 text-gray-800' },
    5: { color: 'bg-amber-100 text-amber-800' },
    6: { color: 'bg-yellow-100 text-yellow-800' },
    7: { color: 'bg-lime-100 text-lime-800' },
    8: { color: 'bg-teal-100 teal-gray-800' },
};

const UserPage = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [notification, setNotification] = useState(null);
    const [searchFilter, setSearchFilter] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        displayName: '',
        email: '',
        roleId: 1,
        isActive: true,
    });

    const getRoles = async () => {
        try {
            const response = await fetch(roleUrl, { headers: headers });
            if (!response.ok) throw new Error('Failed to fetch users');
            const jsonData = await response.json();
            const userRoles = jsonData.toSorted((a, b) => a.name - b.name);
            setRoles(userRoles);
            console.log('Roles fetched:', userRoles);
        } catch (error) {
            console.error('Error fetching data:', error);
            showNotification('Failed to load users', 'error');
        } finally {

        }
    };

    // Fetch all users
    const getUsers = async () => {
        try {
            const response = await fetch(userSelectUrl, { headers: headers });
            if (!response.ok) throw new Error('Failed to fetch users');
            const jsonData = await response.json();
            setUsers(jsonData);
            console.log('Users fetched:', jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
            showNotification('Failed to load users', 'error');
        } finally {

        }
    };

    useEffect(() => {
        getRoles();
        getUsers();
    }, []);

    // Auto-dismiss notification after 3 seconds
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
    };

    const generateId = () => {
        return `${Math.random().toString(36).substr(2, 9)}-${Math.random().toString(36).substr(2, 9)}-${Math.random().toString(36).substr(2, 9)}-${Math.random().toString(36).substr(2, 9)}-${Math.random().toString(36).substr(2, 9)}`;
    };

    const handleSubmit = (formData) => {
        // // e.preventDefault();
        // if (!formData.username || !formData.displayName || !formData.email) {
        //     showNotification('Username, display name, and email are required', 'error');
        //     return;
        // }

        // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // if (!emailRegex.test(formData.email)) {
        //     showNotification('Please enter a valid email address', 'error');
        //     return;
        // }

        if (formData.id) {
            setUsers(
                users.map((u) =>
                    u.id === editingId
                        ? { ...formData, id: editingId, createdAt: u.createdAt, lastLoginAt: u.lastLoginAt }
                        : u
                )
            );
            setEditingId(null);
            showNotification('User updated successfully', 'success');
        } else {
            const now = Date.now();
            setUsers([
                ...users,
                {
                    ...formData,
                    id: generateId(),
                    createdAt: now,
                    lastLoginAt: now,
                },
            ]);
            showNotification('User created successfully', 'success');
        }

        resetForm();
        setShowModal(false);
        setCurrentPage(1);
    };

    const resetForm = () => {
        setFormData({
            username: '',
            displayName: '',
            email: '',
            roleId: 1,
            isActive: true,
        });
    };

    const handleEdit = (user) => {
        setFormData({
            username: user.username,
            displayName: user.displayName,
            email: user.email,
            roleId: user.roleId,
            isActive: user.isActive,
        });
        setEditingId(user.id);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        setDeleteConfirmId(id);
    };

    const confirmDelete = (id) => {
        setUsers(users.filter((u) => u.id !== id));
        setDeleteConfirmId(null);
        showNotification('User deleted successfully', 'success');
    };

    // Filter users based on search
    const filteredUsers = users.filter((user) => {
        const searchLower = searchFilter.toLowerCase();
        return (
            user.username.toLowerCase().includes(searchLower) ||
            user.displayName.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower)
        );
    });

    // Pagination calculations
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentUsers = filteredUsers.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(Math.min(Math.max(page, 1), totalPages));
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-8">
            {/* Notification Toast */}
            {notification && (
                <Notification notification={notification} />
            )}
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">User Management</h1>
                    <p className="text-gray-600">Manage application users and their roles</p>
                </div>

                {/* Action Buttons and Search */}
                <div className="flex gap-4 mb-8 flex-wrap items-center">
                    <button
                        onClick={() => {
                            resetForm();
                            setEditingId(null);
                            setShowModal(true);
                        }}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
                    >
                        <Plus size={20} />
                        Add User
                    </button>
                    <input
                        type="text"
                        placeholder="Search by username, name, or email..."
                        value={searchFilter}
                        onChange={(e) => {
                            setSearchFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="flex-1 min-w-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <div className="text-lg font-semibold text-gray-700">
                        Total Users: <span className="text-indigo-600">{users.length}</span>
                    </div>
                </div>

                {/* Form Modal */}
                {showModal && (
                    // <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    //     <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
                    //         <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                    //             <h2 className="text-2xl font-bold text-gray-900">
                    //                 {editingId ? 'Edit User' : 'Add New User'}
                    //             </h2>
                    //             <button
                    //                 onClick={() => {
                    //                     setShowModal(false);
                    //                     setEditingId(null);
                    //                     resetForm();
                    //                 }}
                    //                 className="text-gray-500 hover:text-gray-700 text-2xl"
                    //             >
                    //                 ×
                    //             </button>
                    //         </div>

                    //         <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    //             {/* Username and Display Name */}
                    //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    //                 <div>
                    //                     <label className="block text-sm font-medium text-gray-700 mb-2">
                    //                         Username *
                    //                     </label>
                    //                     <input
                    //                         type="text"
                    //                         name="username"
                    //                         value={formData.username}
                    //                         onChange={handleInputChange}
                    //                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    //                         placeholder="e.g., jdoe"
                    //                         required
                    //                     />
                    //                 </div>
                    //                 <div>
                    //                     <label className="block text-sm font-medium text-gray-700 mb-2">
                    //                         Display Name *
                    //                     </label>
                    //                     <input
                    //                         type="text"
                    //                         name="displayName"
                    //                         value={formData.displayName}
                    //                         onChange={handleInputChange}
                    //                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    //                         placeholder="e.g., John Doe"
                    //                         required
                    //                     />
                    //                 </div>
                    //             </div>

                    //             {/* Email */}
                    //             <div>
                    //                 <label className="block text-sm font-medium text-gray-700 mb-2">
                    //                     Email Address *
                    //                 </label>
                    //                 <input
                    //                     type="email"
                    //                     name="email"
                    //                     value={formData.email}
                    //                     onChange={handleInputChange}
                    //                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    //                     placeholder="user@pharmacy.com"
                    //                     required
                    //                 />
                    //             </div>

                    //             {/* Role and Status */}
                    //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    //                 <div>
                    //                     <label className="block text-sm font-medium text-gray-700 mb-2">
                    //                         Role
                    //                     </label>
                    //                     <select
                    //                         name="roleId"
                    //                         value={formData.roleId}
                    //                         onChange={handleInputChange}
                    //                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    //                     >
                    //                         <option value={1}>Admin</option>
                    //                         <option value={2}>Pharmacist</option>
                    //                         <option value={3}>Technician</option>
                    //                         <option value={4}>Viewer</option>
                    //                     </select>
                    //                 </div>
                    //                 <div className="flex items-end">
                    //                     <label className="flex items-center gap-3 cursor-pointer">
                    //                         <input
                    //                             type="checkbox"
                    //                             name="isActive"
                    //                             checked={formData.isActive}
                    //                             onChange={handleInputChange}
                    //                             className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                    //                         />
                    //                         <span className="text-gray-700 font-medium">Active User</span>
                    //                     </label>
                    //                 </div>
                    //             </div>

                    //             {/* Form Actions */}
                    //             <div className="flex gap-4 justify-end pt-6 border-t border-gray-200">
                    //                 <button
                    //                     type="button"
                    //                     onClick={() => {
                    //                         setShowModal(false);
                    //                         setEditingId(null);
                    //                         resetForm();
                    //                     }}
                    //                     className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                    //                 >
                    //                     Cancel
                    //                 </button>
                    //                 <button
                    //                     type="submit"
                    //                     className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                    //                 >
                    //                     {editingId ? 'Update User' : 'Create User'}
                    //                 </button>
                    //             </div>
                    //         </form>
                    //     </div>
                    // </div>

                    <UserDialog user={formData} editingId={editingId} setShowModal={setShowModal} showNotification={showNotification} addOrUpdate={handleSubmit} />
                )}

                {/* Delete Confirmation Modal */}
                {deleteConfirmId && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-sm w-full">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete User</h3>
                                <p className="text-gray-600 mb-6">
                                    Are you sure you want to delete this user? This action cannot be undone.
                                </p>
                                <div className="flex gap-3 justify-end">
                                    <button
                                        onClick={() => setDeleteConfirmId(null)}
                                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => confirmDelete(deleteConfirmId)}
                                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {users.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-gray-500 text-lg">No users yet. Add one to get started!</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-100 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                            Display Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                            Username
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                            Created
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                            Last Login
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentUsers.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="border-b border-gray-200 hover:bg-gray-50 transition"
                                        >
                                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                                {user.displayName}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {user.username}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span
                                                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${roleOptions[user.roleId].color
                                                        }`}
                                                >
                                                    {roles.filter(r => r.id === user.roleId)[0].name}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span
                                                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${user.isActive
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                >
                                                    {user.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {formatDate(user.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {formatDate(user.lastLoginAt)}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(user)}
                                                        className="text-indigo-600 hover:text-indigo-800 transition"
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        className="text-red-600 hover:text-red-800 transition"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Pagination Controls */}
                {users.length > 0 && (
                    <div className="mt-6 bg-white rounded-lg shadow p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            {/* Items Per Page Selector */}
                            <div className="flex items-center gap-3">
                                <label htmlFor="itemsPerPage" className="text-sm font-medium text-gray-700">
                                    Rows per page:
                                </label>
                                <select
                                    id="itemsPerPage"
                                    value={itemsPerPage}
                                    onChange={handleItemsPerPageChange}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={15}>15</option>
                                    <option value={20}>20</option>
                                </select>
                            </div>

                            {/* Page Info */}
                            <div className="text-sm text-gray-600 font-medium">
                                Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
                            </div>

                            {/* Pagination Buttons */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-medium"
                                >
                                    First
                                </button>
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-medium"
                                >
                                    Previous
                                </button>

                                {/* Page Numbers */}
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                        if (
                                            page === 1 ||
                                            page === totalPages ||
                                            (page >= currentPage - 1 && page <= currentPage + 1)
                                        ) {
                                            return (
                                                <button
                                                    key={page}
                                                    onClick={() => handlePageChange(page)}
                                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${currentPage === page
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            );
                                        } else if (
                                            (page === 2 && currentPage > 3) ||
                                            (page === totalPages - 1 && currentPage < totalPages - 2)
                                        ) {
                                            return (
                                                <span key={page} className="px-2 text-gray-500">
                                                    ...
                                                </span>
                                            );
                                        }
                                        return null;
                                    })}
                                </div>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-medium"
                                >
                                    Next
                                </button>
                                <button
                                    onClick={() => handlePageChange(totalPages)}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-medium"
                                >
                                    Last
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Role Summary */}
                {users.length > 0 && (
                    //   <div className="mt-8 bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                    //     <h3 className="text-lg font-semibold text-indigo-900 mb-3">User Role Summary</h3>
                    //     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    //       {roles.map((role) => {
                    //         const count = users.filter((u) => u.roleId === role.id).length;
                    //         return (
                    //           <div key={role.id} className="bg-white rounded-lg p-4 border border-indigo-100">
                    //             <p className="text-sm text-gray-600 mb-1">{role.name}</p>
                    //             <p className="text-2xl font-bold text-indigo-600">{count}</p>
                    //           </div>
                    //         );
                    //       })}
                    //     </div>
                    //   </div>
                    <UserSummary roles={roles} users={users} />
                )}
            </div>
        </div>
    );
};

export default UserPage;