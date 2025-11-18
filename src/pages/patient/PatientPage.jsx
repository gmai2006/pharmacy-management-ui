import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Eye, EyeOff, CheckCircle, AlertCircle, XCircle, X, Download } from 'lucide-react';

import init from '../../init';
import PatientDialog from './PatientDialog';

const getdataTarget = '/' + init.appName + '/api/' + 'patients/select/100';
const patientUrl = `/${init.appName}/api/patients/`;
const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

const PatientPage = () => {

  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(undefined);
  const [showModal, setShowModal] = useState(false);
  const [showSensitiveData, setShowSensitiveData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [formData, setFormData] = useState({
    mrn: '',
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    contact: {
      phone: '',
      email: '',
      address: '',
    },
    isStudentRecord: false,
    preferredLanguage: 'English',
    accessibilityPreferences: {
      large_print: false,
      braille: false,
      tts: false,
    },
  });

  const fetchData = async () => {
    try {
      const response = await fetch(getdataTarget, { headers: headers, });
      const jsonData = await response.json();
      setPatients(jsonData);
      console.log(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

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

  const handleSubmit = (patientData) => {
    if (patientData.id) handleUpdatePatient(patientData);
    else handleAddPatient(patientData);
    setShowModal(false);
    setCurrentPage(1);
  };

  const handleEdit = (patient) => {
    setSelectedPatient(patient);

    setShowModal(true);
  };

  const handleDelete = (id) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = (id) => {
    handleDeletePatient(id);
  };

  const toggleSensitiveData = (id) => {
    setShowSensitiveData({
      ...showSensitiveData,
      [id]: !showSensitiveData[id],
    });
  };

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Filter patients based on search
  const filteredPatients = patients.filter((patient) => {
    const searchLower = searchFilter.toLowerCase();
    return (
      patient.firstName.toLowerCase().includes(searchLower) ||
      patient.lastName.toLowerCase().includes(searchLower) ||
      patient.mrn?.toLowerCase().includes(searchLower) ||
      patient.contact.email.toLowerCase().includes(searchLower) ||
      patient.contact.phone.includes(searchFilter)
    );
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPatients = filteredPatients.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  // Handle delete user
  const handleDeletePatient = async (id) => {
    try {
      const response = await fetch(`${patientUrl}${id}`, {
        method: 'DELETE',
        headers: headers
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }

      setPatients(prev => prev.filter(user => user.id !== id));
      setDeleteConfirmId(undefined);
      showNotification('User deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting user:', error);
      showNotification(error.message || 'Failed to delete user', 'error');
    } finally {
    }
  };

  // Handle add user
  const handleAddPatient = async (patientData) => {
    try {
      const response = await fetch(patientUrl, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({
          ...patientData
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user');
      }

      const newPatient = await response.json();
      setPatients(prev => [newPatient, ...prev]);
      setShowModal(false);
      setSelectedPatient(undefined);
      showNotification('User created successfully', 'success');
    } catch (error) {
      console.error('Error adding user:', error);
      showNotification(error.message || 'Failed to create user', 'error');
    } finally {
    }
  };

  const handleUpdatePatient = async (data) => {
    try {
      const response = await fetch(`${patientUrl}`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          ...data
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }

      const updatedPatient = await response.json();
      setPatients(prev =>
        prev.map(patient =>
          patient.id === data.id ? updatedPatient : patient
        )
      );
      setShowModal(false);
      setSelectedPatient(undefined);
      showNotification('User updated successfully', 'success');
    } catch (error) {
      console.error('Error updating user:', error);
      showNotification(error.message || 'Failed to update user', 'error');
    } finally {

    }
  };

  // Export patients to CSV
  const exportToCSV = () => {
    if (patients.length === 0) {
      showNotification('No patients to export', 'error');
      return;
    }

    // Prepare CSV headers
    const csvHeaders = [
      'ID',
      'First Name',
      'Last Name',
      'MRN',
      'Date of Birth',
      'Age',
      'Gender',
      'Email',
      'Phone',
      'Address',
      'Preferred Language',
      'FERPA Student Record',
      'Large Print',
      'Braille',
      'Text-to-Speech'
    ];

    // Prepare CSV rows
    const csvRows = patients.map(patient => {
      const age = calculateAge(patient.dob);
      return [
        patient.id,
        patient.firstName || '',
        patient.lastName || '',
        patient.mrn || '',
        patient.dob ? new Date(patient.dob).toISOString().split('T')[0] : '',
        age,
        patient.gender || '',
        patient.contact.email || '',
        patient.contact.phone || '',
        patient.contact.address || '',
        patient.preferredLanguage || 'English',
        patient.isStudentRecord ? 'Yes' : 'No',
        patient.accessibilityPreferences.large_print ? 'Yes' : 'No',
        patient.accessibilityPreferences.braille ? 'Yes' : 'No',
        patient.accessibilityPreferences.tts ? 'Yes' : 'No'
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
    link.setAttribute('download', `patients_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification('Patients exported successfully', 'success');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg text-white transition-all duration-300 animate-in ${notification.type === 'success'
            ? 'bg-green-500'
            : notification.type === 'error'
              ? 'bg-red-500'
              : 'bg-blue-500'
            }`}
        >
          {notification.type === 'success' && <CheckCircle size={20} />}
          {notification.type === 'error' && <AlertCircle size={20} />}
          {notification.type === 'info' && <XCircle size={20} />}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Patient Management</h1>
          <p className="text-gray-600">Manage and generate patient records</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8 flex-wrap items-center">
          <button
            onClick={() => {
              setSelectedPatient(undefined);
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <Plus size={20} />
            Add Patient
          </button>
          <input
            type="text"
            placeholder="Search by name, MRN, email, or phone..."
            value={searchFilter}
            onChange={(e) => {
              setSearchFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 min-w-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <div className="flex items-center gap-4">
            <div className="text-lg font-semibold text-gray-700">
              Total Patients: <span className="text-blue-600">{patients.length}</span>
            </div>
            <button
              onClick={exportToCSV}
              disabled={patients.length === 0}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
              title="Export patients to CSV"
            >
              <Download size={20} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Form Modal */}
        {showModal && (
          <PatientDialog data={selectedPatient} setShowModal={setShowModal} showNotification={showNotification} addOrUpdate={handleSubmit} />
        )}

     
        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-sm w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Patient</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this patient? This action cannot be undone.
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

        {/* Patients Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {patients.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">No patients yet. Add one to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      MRN
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Age
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Gender
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Language
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Sensitive Data
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentPatients.map((patient) => (
                    <tr
                      key={patient.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {patient.firstName} {patient.lastName}
                        {patient.isStudentRecord && (
                          <span className="ml-2 inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded font-semibold">
                            FERPA
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {patient.mrn || '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {calculateAge(patient.dob)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {patient.gender || '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {patient.contact.email || '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {patient.preferredLanguage}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => toggleSensitiveData(patient.id)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
                        >
                          {showSensitiveData[patient.id] ? (
                            <>
                              <Eye size={16} />
                              Hide
                            </>
                          ) : (
                            <>
                              <EyeOff size={16} />
                              Show
                            </>
                          )}
                        </button>
                        {showSensitiveData[patient.id] && (
                          <div className="mt-1 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs font-mono text-gray-700">
                            {patient.sensitive_data}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(patient)}
                            className="text-blue-600 hover:text-blue-800 transition"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(patient.id)}
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
        {patients.length > 0 && (
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
                Showing {startIndex + 1} to {Math.min(endIndex, filteredPatients.length)} of {filteredPatients.length} patients
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

        {/* Accessibility Information */}
        {patients.length > 0 && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Accessibility Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-blue-700">
                  <strong>Large Print:</strong>{' '}
                  {patients.filter((p) => p.accessibilityPreferences.large_print).length}
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-700">
                  <strong>Braille:</strong>{' '}
                  {patients.filter((p) => p.accessibilityPreferences.braille).length}
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-700">
                  <strong>Text-to-Speech:</strong>{' '}
                  {patients.filter((p) => p.accessibilityPreferences.tts).length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientPage;