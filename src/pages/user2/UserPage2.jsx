import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, MoreVertical, X, AlertCircle, CheckCircle } from 'lucide-react';

import init from "../../init";
import AddUserDialog2 from './AddUserDialog2';
import EditUserDialog2 from './EditUserDialog2';

const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};



const UserPage2 = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [roles, setRoles] = useState([]);
    const itemsPerPage = 10;

    
    const userSelectUrl = '/' + init.appName + '/api/' + 'users/select/100';
    const roleUrl = '/' + init.appName + '/api/' + 'roles/selectAll';

    const userUrl = `/${init.appName}/api/users/`;

    // Show notification
    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const getRoles = async () => {
        setLoading(true);
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
            setLoading(false);
        }
    };

    // Fetch all users
    const getUsers = async () => {
        setLoading(true);
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
            setLoading(false);
        }
    };

    useEffect(() => {
        getRoles();
        getUsers();
    }, []);

    // Filter users based on search term
    useEffect(() => {
        const filtered = users.filter(user =>
            user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
        setCurrentPage(1);
    }, [searchTerm, users]);

    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getRoleLabel = (roleId) => {
        const roles = { 1: 'User', 2: 'Admin', 3: 'Moderator' };
        return roles[roleId] || 'Unknown';
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxButtons = 5;

        if (totalPages <= maxButtons) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= maxButtons; i++) pages.push(i);
            } else if (currentPage >= totalPages - 2) {
                for (let i = totalPages - maxButtons + 1; i <= totalPages; i++) pages.push(i);
            } else {
                for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
            }
        }
        return pages;
    };

    // Handle edit user
    const handleEditUser = (user) => {
        setSelectedUser(user);
        setShowEditDialog(true);
        setOpenMenuId(null);
        setErrors({});
    };

    // Handle delete confirmation
    const handleDeleteConfirm = (user) => {
        setSelectedUser(user);
        setShowDeleteConfirm(true);
        setOpenMenuId(null);
    };

    // Handle delete user
    const handleDeleteUser = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${userUrl}${selectedUser.id}`, {
                method: 'DELETE',
                headers: headers
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete user');
            }

            setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
            setShowDeleteConfirm(false);
            setSelectedUser(null);
            showNotification('User deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting user:', error);
            showNotification(error.message || 'Failed to delete user', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Handle kebab menu click
    const handleMenuClick = (e, user) => {
        e.stopPropagation();
        if (openMenuId === user.id) {
            setOpenMenuId(null);
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            setMenuPosition({
                top: rect.bottom + 8,
                left: rect.left - 180
            });
            setOpenMenuId(user.id);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50" onClick={() => setOpenMenuId(null)}>
            {/* Notification Toast */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${notification.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                    {notification.type === 'success' ? (
                        <CheckCircle size={20} />
                    ) : (
                        <AlertCircle size={20} />
                    )}
                    <span className="text-sm font-medium">{notification.message}</span>
                </div>
            )}

            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Users</h1>
                            <p className="text-gray-600 mt-1">Manage and view all system users</p>
                        </div>
                        <button
                            onClick={() => setShowDialog(true)}
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            Add User
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search Bar */}
                <div className="mb-6 relative">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by username, display name, or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Username</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Display Name</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Last Login</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Created</th>
                                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {loading && users.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                                            Loading users...
                                        </td>
                                    </tr>
                                ) : paginatedUsers.length > 0 ? (
                                    paginatedUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.username}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{user.displayName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{getRoleLabel(user.roleId)}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isActive
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                >
                                                    {user.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {formatDate(user.lastLoginAt)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{formatDate(user.createdAt)}</td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={(e) => handleMenuClick(e, user)}
                                                    className="inline-flex items-center justify-center text-gray-400 hover:text-gray-600 transition"
                                                >
                                                    <MoreVertical size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                                            No users found matching your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {filteredUsers.length > 0 && (
                        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} results
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 1}
                                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    <ChevronLeft size={18} />
                                </button>

                                {getPageNumbers().map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-3 py-2 rounded-lg transition ${currentPage === page
                                            ? 'bg-blue-600 text-white'
                                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Dropdown Menu */}
            {openMenuId && (
                <div
                    className="fixed w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-40"
                    style={{
                        top: `${menuPosition.top}px`,
                        left: `${menuPosition.left}px`
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={() => handleEditUser(users.find(u => u.id === openMenuId))}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition border-b border-gray-100"
                    >
                        Edit User
                    </button>
                    <button
                        onClick={() => handleDeleteConfirm(users.find(u => u.id === openMenuId))}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                        Delete User
                    </button>
                </div>
            )}

            {/* Add User Dialog */}
            {showDialog && (
               <AddUserDialog2 roles={roles} setUsers={setUsers} setShowDialog={setShowDialog} loading={loading} setLoading={setLoading} showNotification={showNotification} />
            )}

            {/* Edit User Dialog */}
            {showEditDialog && (
                // <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                //     <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                //         {/* Dialog Header */}
                //         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                //             <h2 className="text-lg font-semibold text-gray-900">Edit User</h2>
                //             <button
                //                 onClick={handleCloseEditDialog}
                //                 disabled={loading}
                //                 className="text-gray-400 hover:text-gray-600 disabled:opacity-50 transition"
                //             >
                //                 <X size={24} />
                //             </button>
                //         </div>

                //         {/* Dialog Body */}
                //         <div className="px-6 py-4 space-y-4">
                //             {/* Username Field */}
                //             <div>
                //                 <label className="block text-sm font-medium text-gray-700 mb-1">
                //                     Username
                //                 </label>
                //                 <input
                //                     type="text"
                //                     name="username"
                //                     value={formData.username}
                //                     onChange={handleInputChange}
                //                     placeholder="e.g., john_doe"
                //                     disabled={loading}
                //                     className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100 ${errors.username ? 'border-red-500' : 'border-gray-300'
                //                         }`}
                //                 />
                //                 {errors.username && (
                //                     <p className="text-red-600 text-sm mt-1">{errors.username}</p>
                //                 )}
                //             </div>

                //             {/* Display Name Field */}
                //             <div>
                //                 <label className="block text-sm font-medium text-gray-700 mb-1">
                //                     Display Name
                //                 </label>
                //                 <input
                //                     type="text"
                //                     name="displayName"
                //                     value={formData.displayName}
                //                     onChange={handleInputChange}
                //                     placeholder="e.g., John Doe"
                //                     disabled={loading}
                //                     className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100 ${errors.displayName ? 'border-red-500' : 'border-gray-300'
                //                         }`}
                //                 />
                //                 {errors.displayName && (
                //                     <p className="text-red-600 text-sm mt-1">{errors.displayName}</p>
                //                 )}
                //             </div>

                //             {/* Email Field */}
                //             <div>
                //                 <label className="block text-sm font-medium text-gray-700 mb-1">
                //                     Email
                //                 </label>
                //                 <input
                //                     type="email"
                //                     name="email"
                //                     value={formData.email}
                //                     onChange={handleInputChange}
                //                     placeholder="e.g., john@example.com"
                //                     disabled={loading}
                //                     className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100 ${errors.email ? 'border-red-500' : 'border-gray-300'
                //                         }`}
                //                 />
                //                 {errors.email && (
                //                     <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                //                 )}
                //             </div>

                //             {/* Role Field */}
                //             <div>
                //                 <label className="block text-sm font-medium text-gray-700 mb-1">
                //                     Role
                //                 </label>
                //                 <select
                //                     name="roleId"
                //                     value={formData.roleId}
                //                     onChange={handleInputChange}
                //                     disabled={loading}
                //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100"
                //                 >
                //                     {/* {
                //                         roles.map(r => {
                //                             <option key="{r.id}" value="{r.id}">{r.name}</option>
                //                         })
                //                     } */}
                //                     {/* <option value="1">User</option>
                //                     <option value="2">Admin</option>
                //                     <option value="3">Moderator</option> */}
                //                 </select>
                //             </div>

                //             {/* Active Status Checkbox */}
                //             <div className="flex items-center">
                //                 <input
                //                     type="checkbox"
                //                     name="isActive"
                //                     id="edit_is_active"
                //                     checked={formData.isActive}
                //                     onChange={handleInputChange}
                //                     disabled={loading}
                //                     className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
                //                 />
                //                 <label htmlFor="edit_is_active" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
                //                     Active user
                //                 </label>
                //             </div>
                //         </div>

                //         {/* Dialog Footer */}
                //         <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
                //             <button
                //                 onClick={handleCloseEditDialog}
                //                 disabled={loading}
                //                 className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition font-medium"
                //             >
                //                 Cancel
                //             </button>
                //             <button
                //                 onClick={handleUpdateUser}
                //                 disabled={loading}
                //                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
                //             >
                //                 {loading ? 'Updating...' : 'Update User'}
                //             </button>
                //         </div>
                //     </div>
                // </div>
                <EditUserDialog2 user={selectedUser} roles={roles} setUsers={setUsers} setShowDialog={setShowEditDialog} loading={loading} setLoading={setLoading} showNotification={showNotification} />
            )}

            {/* Delete Confirmation Dialog */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4">
                        {/* Dialog Header */}
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Delete User</h2>
                        </div>

                        {/* Dialog Body */}
                        <div className="px-6 py-4">
                            <p className="text-gray-700">
                                Are you sure you want to delete <strong>{selectedUser?.displayName}</strong>? This action cannot be undone.
                            </p>
                        </div>

                        {/* Dialog Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={loading}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteUser}
                                disabled={loading}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
                            >
                                {loading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserPage2;