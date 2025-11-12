import React, { useState } from 'react';
import { 
  Calendar, Phone, Mail, Clock, MapPin, FileText, AlertCircle, Pill, X, User
} from 'lucide-react';

export default function PatientsPage() {
  const [allPatients] = useState([
    { 
      id: 'P001', 
      name: 'Sarah Johnson', 
      dob: '1985-03-15',
      phone: '(555) 123-4567',
      email: 'sarah.j@email.com',
      address: '123 Main St, Seattle, WA 98101',
      insurance: 'BlueCross',
      allergies: ['Penicillin', 'Sulfa drugs'],
      activeRx: 3,
      lastVisit: '2024-10-28'
    },
    { 
      id: 'P002', 
      name: 'Michael Chen', 
      dob: '1972-07-22',
      phone: '(555) 234-5678',
      email: 'mchen@email.com',
      address: '456 Oak Ave, Seattle, WA 98102',
      insurance: 'Aetna',
      allergies: ['None'],
      activeRx: 5,
      lastVisit: '2024-11-01'
    },
    { 
      id: 'P003', 
      name: 'Emily Davis', 
      dob: '1990-11-08',
      phone: '(555) 345-6789',
      email: 'emily.davis@email.com',
      address: '789 Pine Rd, Seattle, WA 98103',
      insurance: 'UnitedHealth',
      allergies: ['Codeine'],
      activeRx: 2,
      lastVisit: '2024-11-03'
    },
    { 
      id: 'P004', 
      name: 'James Wilson', 
      dob: '1968-05-12',
      phone: '(555) 456-7890',
      email: 'jwilson@email.com',
      address: '321 Elm St, Seattle, WA 98104',
      insurance: 'Cigna',
      allergies: ['Aspirin'],
      activeRx: 4,
      lastVisit: '2024-10-25'
    },
    { 
      id: 'P005', 
      name: 'Maria Garcia', 
      dob: '1995-09-30',
      phone: '(555) 567-8901',
      email: 'maria.g@email.com',
      address: '654 Maple Ave, Seattle, WA 98105',
      insurance: 'Kaiser',
      allergies: ['None'],
      activeRx: 1,
      lastVisit: '2024-11-02'
    },
    { 
      id: 'P006', 
      name: 'Robert Taylor', 
      dob: '1980-12-18',
      phone: '(555) 678-9012',
      email: 'rtaylor@email.com',
      address: '987 Cedar Ln, Seattle, WA 98106',
      insurance: 'BlueCross',
      allergies: ['Latex'],
      activeRx: 3,
      lastVisit: '2024-10-30'
    },
    { 
      id: 'P007', 
      name: 'Jennifer Lee', 
      dob: '1988-02-25',
      phone: '(555) 789-0123',
      email: 'jlee@email.com',
      address: '147 Birch Rd, Seattle, WA 98107',
      insurance: 'Aetna',
      allergies: ['Iodine'],
      activeRx: 2,
      lastVisit: '2024-11-01'
    },
    { 
      id: 'P008', 
      name: 'David Martinez', 
      dob: '1975-06-08',
      phone: '(555) 890-1234',
      email: 'dmartinez@email.com',
      address: '258 Spruce St, Seattle, WA 98108',
      insurance: 'Medicare',
      allergies: ['None'],
      activeRx: 6,
      lastVisit: '2024-10-29'
    },
    { 
      id: 'P009', 
      name: 'Lisa Anderson', 
      dob: '1992-11-14',
      phone: '(555) 901-2345',
      email: 'landerson@email.com',
      address: '369 Willow Way, Seattle, WA 98109',
      insurance: 'UnitedHealth',
      allergies: ['Shellfish'],
      activeRx: 1,
      lastVisit: '2024-11-04'
    },
    { 
      id: 'P010', 
      name: 'Thomas Brown', 
      dob: '1965-04-20',
      phone: '(555) 012-3456',
      email: 'tbrown@email.com',
      address: '741 Ash Dr, Seattle, WA 98110',
      insurance: 'Cigna',
      allergies: ['Penicillin'],
      activeRx: 5,
      lastVisit: '2024-10-27'
    },
    { 
      id: 'P011', 
      name: 'Nancy White', 
      dob: '1983-08-05',
      phone: '(555) 123-4568',
      email: 'nwhite@email.com',
      address: '852 Oak Blvd, Seattle, WA 98111',
      insurance: 'BlueCross',
      allergies: ['None'],
      activeRx: 2,
      lastVisit: '2024-11-03'
    },
    { 
      id: 'P012', 
      name: 'Christopher Moore', 
      dob: '1978-01-28',
      phone: '(555) 234-5679',
      email: 'cmoore@email.com',
      address: '963 Pine Plaza, Seattle, WA 98112',
      insurance: 'Aetna',
      allergies: ['Sulfa drugs'],
      activeRx: 4,
      lastVisit: '2024-10-31'
    }
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const itemsPerPage = 8;

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Pagination logic
  const totalPages = Math.ceil(allPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPatients = allPatients.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Patient Profiles</h2>
        <p className="text-gray-600">Manage patient information and medication history</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-sm text-gray-600 mb-1">Total Patients</div>
          <div className="text-2xl font-bold text-gray-900">{allPatients.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-sm text-gray-600 mb-1">Active Prescriptions</div>
          <div className="text-2xl font-bold text-blue-600">{allPatients.reduce((sum, p) => sum + p.activeRx, 0)}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-sm text-gray-600 mb-1">Visits This Month</div>
          <div className="text-2xl font-bold text-green-600">18</div>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">All Patients</h3>
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, allPatients.length)} of {allPatients.length}
          </div>
        </div>
        <div className="overflow-x-auto">
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Insurance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Active Rx</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Visit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{patient.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{patient.name}</div>
                      <div className="text-xs text-gray-500">{patient.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{calculateAge(patient.dob)} yrs</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{patient.insurance}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {patient.activeRx} active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{patient.lastVisit}</td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => {
                          setSelectedPatient(patient);
                          setShowProfile(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              First
            </button>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              Previous
            </button>
            
            {/* Page Numbers */}
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
                    onClick={() => goToPage(page)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <span key={page} className="px-2 text-gray-400">
                    ...
                  </span>
                );
              }
              return null;
            })}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              Next
            </button>
            <button
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              Last
            </button>
          </div>
        </div>
      </div>

      {/* Patient Profile Modal */}
      {showProfile && selectedPatient && (
        <PatientProfileModal 
          patient={selectedPatient} 
          onClose={() => {
            setShowProfile(false);
            setSelectedPatient(null);
          }}
        />
      )}
    </>
  );
}

function PatientProfileModal({ patient, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');

  const medicationHistory = [
    { 
      id: 'RX101',
      medication: 'Lisinopril 10mg',
      prescriber: 'Dr. Smith',
      startDate: '2024-01-15',
      endDate: null,
      status: 'active',
      dosage: '1 tablet daily',
      refills: 3,
      purpose: 'Blood pressure management'
    },
    { 
      id: 'RX102',
      medication: 'Metformin 500mg',
      prescriber: 'Dr. Smith',
      startDate: '2024-03-20',
      endDate: null,
      status: 'active',
      dosage: '2 tablets twice daily',
      refills: 5,
      purpose: 'Type 2 diabetes'
    },
    { 
      id: 'RX103',
      medication: 'Atorvastatin 20mg',
      prescriber: 'Dr. Johnson',
      startDate: '2024-06-10',
      endDate: null,
      status: 'active',
      dosage: '1 tablet at bedtime',
      refills: 2,
      purpose: 'Cholesterol management'
    },
    { 
      id: 'RX098',
      medication: 'Amoxicillin 500mg',
      prescriber: 'Dr. Lee',
      startDate: '2024-02-05',
      endDate: '2024-02-15',
      status: 'completed',
      dosage: '1 tablet three times daily',
      refills: 0,
      purpose: 'Bacterial infection'
    },
    { 
      id: 'RX095',
      medication: 'Ibuprofen 400mg',
      prescriber: 'Dr. Smith',
      startDate: '2023-12-10',
      endDate: '2024-01-10',
      status: 'completed',
      dosage: 'As needed for pain',
      refills: 1,
      purpose: 'Pain management'
    }
  ];

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <User className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">{patient.name}</h3>
              <p className="text-blue-100 text-sm">Patient ID: {patient.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:text-blue-100 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex gap-1 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-3 font-medium transition-colors relative ${
                activeTab === 'overview'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('medications')}
              className={`px-4 py-3 font-medium transition-colors relative ${
                activeTab === 'medications'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Medication History
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User size={18} className="text-blue-600" />
                  Personal Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Date of Birth</div>
                    <div className="flex items-center gap-2 text-sm text-gray-900">
                      <Calendar size={14} className="text-gray-400" />
                      {patient.dob} ({calculateAge(patient.dob)} years)
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Phone</div>
                    <div className="flex items-center gap-2 text-sm text-gray-900">
                      <Phone size={14} className="text-gray-400" />
                      {patient.phone}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Email</div>
                    <div className="flex items-center gap-2 text-sm text-gray-900">
                      <Mail size={14} className="text-gray-400" />
                      {patient.email}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Last Visit</div>
                    <div className="flex items-center gap-2 text-sm text-gray-900">
                      <Clock size={14} className="text-gray-400" />
                      {patient.lastVisit}
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-xs text-gray-500 mb-1">Address</div>
                  <div className="flex items-center gap-2 text-sm text-gray-900">
                    <MapPin size={14} className="text-gray-400" />
                    {patient.address}
                  </div>
                </div>
              </div>

              {/* Insurance */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText size={18} className="text-blue-600" />
                  Insurance Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Provider</div>
                    <div className="text-sm font-medium text-gray-900">{patient.insurance}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Active Prescriptions</div>
                    <div className="text-sm font-medium text-gray-900">{patient.activeRx}</div>
                  </div>
                </div>
              </div>

              {/* Allergies */}
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <h4 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                  <AlertCircle size={18} className="text-red-600" />
                  Allergies & Alerts
                </h4>
                <div className="flex flex-wrap gap-2">
                  {patient.allergies.map((allergy, index) => (
                    <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium border border-red-300">
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'medications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">Complete Medication History</h4>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    {medicationHistory.filter(m => m.status === 'active').length} Active
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    {medicationHistory.filter(m => m.status === 'completed').length} Completed
                  </span>
                </div>
              </div>

              {medicationHistory.map((med) => (
                <div key={med.id} className={`border-2 rounded-lg p-4 ${
                  med.status === 'active' ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Pill className={med.status === 'active' ? 'text-green-600' : 'text-gray-400'} size={18} />
                        <span className="font-semibold text-gray-900">{med.medication}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          med.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-200 text-gray-700'
                        }`}>
                          {med.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">{med.purpose}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Rx ID</div>
                      <div className="text-sm font-medium text-gray-900">{med.id}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Dosage</div>
                      <div className="text-sm text-gray-900 font-medium">{med.dosage}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Prescriber</div>
                      <div className="text-sm text-gray-900">{med.prescriber}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Start Date</div>
                      <div className="text-sm text-gray-900">{med.startDate}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">End Date</div>
                      <div className="text-sm text-gray-900">{med.endDate || 'Ongoing'}</div>
                    </div>
                  </div>

                  {med.status === 'active' && (
                    <div className="pt-3 border-t border-green-200">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Refills Remaining: <span className="font-semibold text-gray-900">{med.refills}</span></span>
                        <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors">
                          Request Refill
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}