import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, CheckCircle, AlertCircle, XCircle, X, Download } from 'lucide-react';

import init from '../init';
import PharmacistDialog from './PharmacistDialog';
import Notification from '../components/Notification';

const getdataTarget = '/' + init.appName + '/api/' + 'pharmacists/select/100';
const pharmacistUrl = `/${init.appName}/api/pharmacists/`;
const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

const PharmacistPage = () => {

  const [pharmacists, setPharmacists] = useState([]);
  const [selectedPharmacist, setSelectedPharmacist] = useState(undefined);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [filterActive, setFilterActive] = useState('all');
  const [formData, setFormData] = useState({
    userId: '',
    licenseNumber: '',
    licenseState: '',
    active: true,
  });

  const fetchData = async () => {
    try {
      const response = await fetch(getdataTarget, { headers: headers, });
      const jsonData = await response.json();
      setPharmacists(jsonData);
      console.log(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
      showNotification('Failed to load pharmacists', 'error');
    }
  };

  useEffect(() => {
    fetchData();
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

  const handleSubmit = (pharmacistData) => {
    if (pharmacistData.id) handleUpdatePharmacist(pharmacistData);
    else handleAddPharmacist(pharmacistData);
    setShowModal(false);
    setCurrentPage(1);
  };

  const handleEdit = (pharmacist) => {
    setSelectedPharmacist(pharmacist);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = (id) => {
    handleDeletePharmacist(id);
  };

  // Filter pharmacists based on search and status
  const filteredPharmacists = pharmacists.filter((pharmacist) => {
    const searchLower = searchFilter.toLowerCase();
    const matchesSearch =
      pharmacist.userId.toLowerCase().includes(searchLower) ||
      pharmacist.licenseNumber.toLowerCase().includes(searchLower) ||
      pharmacist.licenseState.toLowerCase().includes(searchLower);

    const matchesFilter =
      filterActive === 'all' ||
      (filterActive === 'active' && pharmacist.active) ||
      (filterActive === 'inactive' && !pharmacist.active);

    return matchesSearch && matchesFilter;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredPharmacists.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPharmacists = filteredPharmacists.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  // Handle delete pharmacist
  const handleDeletePharmacist = async (id) => {
    try {
      const response = await fetch(`${pharmacistUrl}${id}`, {
        method: 'DELETE',
        headers: headers
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete pharmacist');
      }

      setPharmacists(prev => prev.filter(pharmacist => pharmacist.id !== id));
      setDeleteConfirmId(undefined);
      showNotification('Pharmacist deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting pharmacist:', error);
      showNotification(error.message || 'Failed to delete pharmacist', 'error');
    }
  };

  // Handle add pharmacist
  const handleAddPharmacist = async (pharmacistData) => {
    try {
      const response = await fetch(pharmacistUrl, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({
          ...pharmacistData
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create pharmacist');
      }

      const newPharmacist = await response.json();
      setPharmacists(prev => [newPharmacist, ...prev]);
      setShowModal(false);
      setSelectedPharmacist(undefined);
      showNotification('Pharmacist created successfully', 'success');
    } catch (error) {
      console.error('Error adding pharmacist:', error);
      showNotification(error.message || 'Failed to create pharmacist', 'error');
    }
  };

  const handleUpdatePharmacist = async (data) => {
    try {
      const response = await fetch(`${pharmacistUrl}`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          ...data
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update pharmacist');
      }

      const updatedPharmacist = await response.json();
      setPharmacists(prev =>
        prev.map(pharmacist =>
          pharmacist.id === data.id ? updatedPharmacist : pharmacist
        )
      );
      setShowModal(false);
      setSelectedPharmacist(undefined);
      showNotification('Pharmacist updated successfully', 'success');
    } catch (error) {
      console.error('Error updating pharmacist:', error);
      showNotification(error.message || 'Failed to update pharmacist', 'error');
    }
  };

  // Export pharmacists to CSV
  const exportToCSV = () => {
    if (pharmacists.length === 0) {
      showNotification('No pharmacists to export', 'error');
      return;
    }

    // Prepare CSV headers
    const csvHeaders = [
      'ID',
      'User ID',
      'License Number',
      'License State',
      'Status'
    ];

    // Prepare CSV rows
    const csvRows = pharmacists.map(pharmacist => {
      return [
        pharmacist.id,
        pharmacist.userId || '',
        pharmacist.licenseNumber || '',
        pharmacist.licenseState || '',
        pharmacist.active ? 'Active' : 'Inactive'
      ];
    });

    // Combine headers and rows
    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row =>
        row.map(cell =>
          // Escape quotes and wrap in quotes if contains comma
          typeof cell === 'string' && (cell.includes(',') || cell.includes('"'))
            ? `"${cell.replace(/"/g, '""')}"`
            : cell
        ).join(',')
      )
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `pharmacists_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification('Pharmacists exported successfully', 'success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      {/* Notification Toast */}
      {notification && (
        <Notification notification={notification} />
      )}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Pharmacist Management</h1>
          <p className="text-gray-600">Manage pharmacist licenses and credentials</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8 flex-wrap items-center">
          <button
            onClick={() => {
              setSelectedPharmacist(undefined);
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <Plus size={20} />
            Add Pharmacist
          </button>
          <input
            type="text"
            placeholder="Search by user ID, license number, or state..."
            value={searchFilter}
            onChange={(e) => {
              setSearchFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 min-w-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <select
            value={filterActive}
            onChange={(e) => {
              setFilterActive(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <div className="flex items-center gap-4">
            <div className="text-lg font-semibold text-gray-700">
              Total Pharmacists: <span className="text-blue-600">{pharmacists.length}</span>
            </div>
            <button
              onClick={exportToCSV}
              disabled={pharmacists.length === 0}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
              title="Export pharmacists to CSV"
            >
              <Download size={20} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Form Modal */}
        {showModal && (
          <PharmacistDialog data={selectedPharmacist} setShowModal={setShowModal} showNotification={showNotification} addOrUpdate={handleSubmit} />
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-sm w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Pharmacist</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this pharmacist? This action cannot be undone.
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

        {/* Pharmacists Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {pharmacists.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">No pharmacists yet. Add one to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      User ID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      License Number
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      License State
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentPharmacists.map((pharmacist) => (
                    <tr
                      key={pharmacist.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {pharmacist.userId}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {pharmacist.licenseNumber || '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {pharmacist.licenseState || '—'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            pharmacist.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {pharmacist.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(pharmacist)}
                            className="text-blue-600 hover:text-blue-800 transition"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(pharmacist.id)}
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
        {pharmacists.length > 0 && (
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
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                </select>
              </div>

              {/* Page Info */}
              <div className="text-sm text-gray-600 font-medium">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredPharmacists.length)} of {filteredPharmacists.length} pharmacists
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
                    // Show first page, last page, current page, and pages around current
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
                            ? 'bg-blue-600 text-white'
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

        {/* Pharmacist Status Summary */}
        {pharmacists.length > 0 && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">License Status Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-blue-700">
                  <strong>Active Licenses:</strong>{' '}
                  {pharmacists.filter((p) => p.active).length}
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-700">
                  <strong>Inactive Licenses:</strong>{' '}
                  {pharmacists.filter((p) => !p.active).length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PharmacistPage;