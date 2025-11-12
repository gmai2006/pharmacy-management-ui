import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, MoreVertical, X } from 'lucide-react';

const UserPage = () => {
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
  const [formData, setFormData] = useState({
    username: '',
    display_name: '',
    email: '',
    role_id: 1,
    is_active: true
  });
  const [errors, setErrors] = useState({});
  const itemsPerPage = 10;

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockUsers = [
      {
        id: '1',
        username: 'john_doe',
        display_name: 'John Doe',
        email: 'john@example.com',
        role_id: 1,
        is_active: true,
        created_at: '2024-01-15T10:30:00Z',
        last_login_at: '2025-11-10T14:22:00Z'
      },
      {
        id: '2',
        username: 'jane_smith',
        display_name: 'Jane Smith',
        email: 'jane@example.com',
        role_id: 2,
        is_active: true,
        created_at: '2024-02-20T08:15:00Z',
        last_login_at: '2025-11-09T09:45:00Z'
      },
      {
        id: '3',
        username: 'bob_wilson',
        display_name: 'Bob Wilson',
        email: 'bob@example.com',
        role_id: 1,
        is_active: false,
        created_at: '2024-03-10T12:00:00Z',
        last_login_at: '2025-10-15T16:30:00Z'
      },
      {
        id: '4',
        username: 'alice_johnson',
        display_name: 'Alice Johnson',
        email: 'alice@example.com',
        role_id: 3,
        is_active: true,
        created_at: '2024-04-05T11:20:00Z',
        last_login_at: '2025-11-08T13:15:00Z'
      },
      {
        id: '5',
        username: 'charlie_brown',
        display_name: 'Charlie Brown',
        email: 'charlie@example.com',
        role_id: 1,
        is_active: true,
        created_at: '2024-05-12T09:50:00Z',
        last_login_at: '2025-11-07T10:20:00Z'
      },
      {
        id: '6',
        username: 'diana_prince',
        display_name: 'Diana Prince',
        email: 'diana@example.com',
        role_id: 2,
        is_active: true,
        created_at: '2024-06-18T14:30:00Z',
        last_login_at: '2025-11-05T15:45:00Z'
      },
      {
        id: '7',
        username: 'evan_davis',
        display_name: 'Evan Davis',
        email: 'evan@example.com',
        role_id: 1,
        is_active: false,
        created_at: '2024-07-22T10:10:00Z',
        last_login_at: '2025-09-20T11:30:00Z'
      },
      {
        id: '8',
        username: 'fiona_green',
        display_name: 'Fiona Green',
        email: 'fiona@example.com',
        role_id: 3,
        is_active: true,
        created_at: '2024-08-30T13:40:00Z',
        last_login_at: '2025-11-06T12:00:00Z'
      },
      {
        id: '9',
        username: 'george_harris',
        display_name: 'George Harris',
        email: 'george@example.com',
        role_id: 1,
        is_active: true,
        created_at: '2024-09-14T11:25:00Z',
        last_login_at: '2025-11-04T14:50:00Z'
      },
      {
        id: '10',
        username: 'hannah_miller',
        display_name: 'Hannah Miller',
        email: 'hannah@example.com',
        role_id: 2,
        is_active: true,
        created_at: '2024-10-08T15:15:00Z',
        last_login_at: '2025-11-09T16:20:00Z'
      },
      {
        id: '11',
        username: 'isaac_taylor',
        display_name: 'Isaac Taylor',
        email: 'isaac@example.com',
        role_id: 1,
        is_active: true,
        created_at: '2024-11-01T09:30:00Z',
        last_login_at: '2025-11-10T10:15:00Z'
      },
      {
        id: '12',
        username: 'julia_anderson',
        display_name: 'Julia Anderson',
        email: 'julia@example.com',
        role_id: 3,
        is_active: false,
        created_at: '2024-12-05T12:45:00Z',
        last_login_at: '2025-11-01T13:30:00Z'
      },
    ];
    setUsers(mockUsers);
  }, []);

  // Filter users based on search term
  useEffect(() => {
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, users]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateString) => {
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

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, hyphens, and underscores';
    }

    if (!formData.display_name.trim()) {
      newErrors.display_name = 'Display name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
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

  // Handle add user
  const handleAddUser = () => {
    if (!validateForm()) return;

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      role_id: parseInt(formData.role_id),
      created_at: new Date().toISOString(),
      last_login_at: null
    };

    setUsers(prev => [newUser, ...prev]);
    setFormData({
      username: '',
      display_name: '',
      email: '',
      role_id: 1,
      is_active: true
    });
    setErrors({});
    setShowDialog(false);
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setShowDialog(false);
    setFormData({
      username: '',
      display_name: '',
      email: '',
      role_id: 1,
      is_active: true
    });
    setErrors({});
  };

  // Handle edit user
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      display_name: user.display_name,
      email: user.email,
      role_id: user.role_id,
      is_active: user.is_active
    });
    setShowEditDialog(true);
    setOpenMenuId(null);
  };

  // Handle update user
  const handleUpdateUser = () => {
    if (!validateForm()) return;

    setUsers(prev =>
      prev.map(user =>
        user.id === selectedUser.id
          ? { ...user, ...formData, role_id: parseInt(formData.role_id) }
          : user
      )
    );
    setShowEditDialog(false);
    setSelectedUser(null);
    setFormData({
      username: '',
      display_name: '',
      email: '',
      role_id: 1,
      is_active: true
    });
    setErrors({});
  };

  // Handle delete confirmation
  const handleDeleteConfirm = (user) => {
    setSelectedUser(user);
    setShowDeleteConfirm(true);
    setOpenMenuId(null);
  };

  // Handle delete user
  const handleDeleteUser = () => {
    setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
    setShowDeleteConfirm(false);
    setSelectedUser(null);
  };

  // Handle close edit dialog
  const handleCloseEditDialog = () => {
    setShowEditDialog(false);
    setSelectedUser(null);
    setFormData({
      username: '',
      display_name: '',
      email: '',
      role_id: 1,
      is_active: true
    });
    setErrors({});
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
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
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.username}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{user.display_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{getRoleLabel(user.role_id)}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {user.last_login_at ? formatDate(user.last_login_at) : 'Never'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{formatDate(user.created_at)}</td>
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
                    className={`px-3 py-2 rounded-lg transition ${
                      currentPage === page
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            {/* Dialog Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Add New User</h2>
              <button
                onClick={handleCloseDialog}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Dialog Body */}
            <div className="px-6 py-4 space-y-4">
              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="e.g., john_doe"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                    errors.username ? 'border-red-500' : 'border-gray-300'
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
                  name="display_name"
                  value={formData.display_name}
                  onChange={handleInputChange}
                  placeholder="e.g., John Doe"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                    errors.display_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.display_name && (
                  <p className="text-red-600 text-sm mt-1">{errors.display_name}</p>
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
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g., john@example.com"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
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
                  name="role_id"
                  value={formData.role_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                >
                  <option value="1">User</option>
                  <option value="2">Admin</option>
                  <option value="3">Moderator</option>
                </select>
              </div>

              {/* Active Status Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_active"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="is_active" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
                  Active user
                </label>
              </div>
            </div>

            {/* Dialog Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={handleCloseDialog}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Dialog */}
      {showEditDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            {/* Dialog Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Edit User</h2>
              <button
                onClick={handleCloseEditDialog}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Dialog Body */}
            <div className="px-6 py-4 space-y-4">
              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="e.g., john_doe"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                    errors.username ? 'border-red-500' : 'border-gray-300'
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
                  name="display_name"
                  value={formData.display_name}
                  onChange={handleInputChange}
                  placeholder="e.g., John Doe"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                    errors.display_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.display_name && (
                  <p className="text-red-600 text-sm mt-1">{errors.display_name}</p>
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
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g., john@example.com"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
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
                  name="role_id"
                  value={formData.role_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                >
                  <option value="1">User</option>
                  <option value="2">Admin</option>
                  <option value="3">Moderator</option>
                </select>
              </div>

              {/* Active Status Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_active"
                  id="edit_is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="edit_is_active" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
                  Active user
                </label>
              </div>
            </div>

            {/* Dialog Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={handleCloseEditDialog}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Update User
              </button>
            </div>
          </div>
        </div>
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
                Are you sure you want to delete <strong>{selectedUser?.display_name}</strong>? This action cannot be undone.
              </p>
            </div>

            {/* Dialog Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;