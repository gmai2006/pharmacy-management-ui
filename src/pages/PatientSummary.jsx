import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, Eye, EyeOff } from 'lucide-react';
import init from '../init';

const getdataTarget = '/' + init.appName + '/api/' + 'patients/select/100';
const createDataTarget = '/' + init.appName + '/api/' + 'inventoryitems/';
const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

const PatientsPage = () => {
    
     

  // const dummyPatients = [
  //   {
  //     id: '1-abc123def45',
  //     mrn: 'MRN000001',
  //     firstName: 'John',
  //     lastName: 'Anderson',
  //     dob: '1965-03-15',
  //     gender: 'M',
  //     contact: {
  //       phone: '206-555-0101',
  //       email: 'john.anderson@example.com',
  //       address: '1425 4th Avenue, Seattle, WA 98101',
  //     },
  //     sensitiveData: '[ENCRYPTED: SSN-555-12-1234]',
  //     isStudentRecord: false,
  //     preferredLanguage: 'English',
  //     accessibilityPreferences: {
  //       large_print: false,
  //       braille: false,
  //       tts: false,
  //     },
  //     created_at: '2024-01-15T09:30:00Z',
  //   },
  //   {
  //     id: '2-def456ghi78',
  //     mrn: 'MRN000002',
  //     firstName: 'Sarah',
  //     lastName: 'Chen',
  //     dob: '1982-07-22',
  //     gender: 'F',
  //     contact: {
  //       phone: '206-555-0102',
  //       email: 'sarah.chen@example.com',
  //       address: '2847 University Avenue, Seattle, WA 98105',
  //     },
  //     sensitiveData: '[ENCRYPTED: SSN-555-23-5678]',
  //     isStudentRecord: false,
  //     preferredLanguage: 'Mandarin',
  //     accessibilityPreferences: {
  //       large_print: true,
  //       braille: false,
  //       tts: false,
  //     },
  //     created_at: '2024-02-20T14:45:00Z',
  //   },
  //   {
  //     id: '3-ghi789jkl01',
  //     mrn: 'MRN000003',
  //     firstName: 'Michael',
  //     lastName: 'Rodriguez',
  //     dob: '1995-11-08',
  //     gender: 'M',
  //     contact: {
  //       phone: '206-555-0103',
  //       email: 'michael.rodriguez@example.com',
  //       address: '5623 Ballard Avenue W, Seattle, WA 98107',
  //     },
  //     sensitiveData: '[ENCRYPTED: SSN-555-34-9012]',
  //     isStudentRecord: true,
  //     preferredLanguage: 'Spanish',
  //     accessibilityPreferences: {
  //       large_print: false,
  //       braille: false,
  //       tts: true,
  //     },
  //     created_at: '2024-03-10T11:20:00Z',
  //   },
  //   {
  //     id: '4-jkl012mno23',
  //     mrn: 'MRN000004',
  //     firstName: 'Emily',
  //     lastName: 'Thompson',
  //     dob: '1978-05-30',
  //     gender: 'F',
  //     contact: {
  //       phone: '206-555-0104',
  //       email: 'emily.thompson@example.com',
  //       address: '3214 Magnolia Boulevard, Seattle, WA 98199',
  //     },
  //     sensitiveData: '[ENCRYPTED: SSN-555-45-3456]',
  //     isStudentRecord: false,
  //     preferredLanguage: 'English',
  //     accessibilityPreferences: {
  //       large_print: false,
  //       braille: true,
  //       tts: true,
  //     },
  //     created_at: '2024-03-18T08:15:00Z',
  //   },
  //   {
  //     id: '5-mno234pqr45',
  //     mrn: 'MRN000005',
  //     firstName: 'David',
  //     lastName: 'Patel',
  //     dob: '1988-09-12',
  //     gender: 'M',
  //     contact: {
  //       phone: '206-555-0105',
  //       email: 'david.patel@example.com',
  //       address: '4756 Leary Way NW, Seattle, WA 98107',
  //     },
  //     sensitiveData: '[ENCRYPTED: SSN-555-56-7890]',
  //     isStudentRecord: false,
  //     preferredLanguage: 'English',
  //     accessibilityPreferences: {
  //       large_print: true,
  //       braille: false,
  //       tts: false,
  //     },
  //     created_at: '2024-04-02T16:30:00Z',
  //   },
  //   {
  //     id: '6-pqr456stu67',
  //     mrn: 'MRN000006',
  //     firstName: 'Jessica',
  //     lastName: 'Williams',
  //     dob: '1992-01-25',
  //     gender: 'F',
  //     contact: {
  //       phone: '206-555-0106',
  //       email: 'jessica.williams@example.com',
  //       address: '6789 Aurora Avenue N, Seattle, WA 98103',
  //     },
  //     sensitiveData: '[ENCRYPTED: SSN-555-67-1234]',
  //     isStudentRecord: true,
  //     preferredLanguage: 'English',
  //     accessibilityPreferences: {
  //       large_print: false,
  //       braille: false,
  //       tts: false,
  //     },
  //     created_at: '2024-04-15T10:45:00Z',
  //   },
  //   {
  //     id: '7-stu678vwx89',
  //     mrn: 'MRN000007',
  //     firstName: 'Robert',
  //     lastName: 'Martinez',
  //     dob: '1975-06-18',
  //     gender: 'M',
  //     contact: {
  //       phone: '206-555-0107',
  //       email: 'robert.martinez@example.com',
  //       address: '1928 Pike Place, Seattle, WA 98101',
  //     },
  //     sensitiveData: '[ENCRYPTED: SSN-555-78-5678]',
  //     isStudentRecord: false,
  //     preferredLanguage: 'Spanish',
  //     accessibilityPreferences: {
  //       large_print: false,
  //       braille: false,
  //       tts: true,
  //     },
  //     created_at: '2024-05-01T13:20:00Z',
  //   },
  //   {
  //     id: '8-vwx901yza2',
  //     mrn: 'MRN000008',
  //     firstName: 'Lisa',
  //     lastName: 'Johnson',
  //     dob: '1998-04-03',
  //     gender: 'F',
  //     contact: {
  //       phone: '206-555-0108',
  //       email: 'lisa.johnson@example.com',
  //       address: '2345 Eastlake Avenue E, Seattle, WA 98102',
  //     },
  //     sensitiveData: '[ENCRYPTED: SSN-555-89-9012]',
  //     isStudentRecord: true,
  //     preferredLanguage: 'English',
  //     accessibilityPreferences: {
  //       large_print: true,
  //       braille: false,
  //       tts: true,
  //     },
  //     created_at: '2024-05-20T09:00:00Z',
  //   },
  //   {
  //     id: '9-yza234bcd5',
  //     mrn: 'MRN000009',
  //     firstName: 'James',
  //     lastName: 'Lee',
  //     dob: '1970-12-07',
  //     gender: 'M',
  //     contact: {
  //       phone: '206-555-0109',
  //       email: 'james.lee@example.com',
  //       address: '4567 University Way NE, Seattle, WA 98105',
  //     },
  //     sensitiveData: '[ENCRYPTED: SSN-555-90-3456]',
  //     isStudentRecord: false,
  //     preferredLanguage: 'Vietnamese',
  //     accessibilityPreferences: {
  //       large_print: false,
  //       braille: false,
  //       tts: false,
  //     },
  //     created_at: '2024-06-05T15:30:00Z',
  //   },
  //   {
  //     id: '10-bcd567efg8',
  //     mrn: 'MRN000010',
  //     firstName: 'Maria',
  //     lastName: 'Garcia',
  //     dob: '1985-08-14',
  //     gender: 'F',
  //     contact: {
  //       phone: '206-555-0110',
  //       email: 'maria.garcia@example.com',
  //       address: '5890 Ravenna Avenue NE, Seattle, WA 98115',
  //     },
  //     sensitiveData: '[ENCRYPTED: SSN-555-01-7890]',
  //     isStudentRecord: false,
  //     preferredLanguage: 'Spanish',
  //     accessibilityPreferences: {
  //       large_print: true,
  //       braille: true,
  //       tts: false,
  //     },
  //     created_at: '2024-06-18T11:15:00Z',
  //   },
  // ];

  const [patients, setPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showSensitiveData, setShowSensitiveData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('contact_')) {
      const field = name.replace('contact_', '');
      setFormData({
        ...formData,
        contact: { ...formData.contact, [field]: value },
      });
    } else if (name.startsWith('accessibility_')) {
      const field = name.replace('accessibility_', '');
      setFormData({
        ...formData,
        accessibilityPreferences: {
          ...formData.accessibilityPreferences,
          [field]: checked,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

//   const generateRandomPatient = () => {
//     const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'Robert', 'Emily', 'David', 'Jessica'];
//     const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
//     const genders = ['M', 'F', 'Other'];
//     const languages = ['English', 'Spanish', 'French', 'Mandarin', 'Vietnamese'];

//     const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
//     const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
//     const year = Math.floor(Math.random() * 50) + 1950;
//     const month = Math.floor(Math.random() * 12) + 1;
//     const day = Math.floor(Math.random() * 28) + 1;
//     const dob = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

//     return {
//       id: generateId(),
//       mrn: `MRN${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
//       firstName: firstName,
//       lastName: lastName,
//       dob,
//       gender: genders[Math.floor(Math.random() * genders.length)],
//       contact: {
//         phone: `${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
//         email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
//         address: `${Math.floor(Math.random() * 9000) + 1000} Main St, Anytown, USA`,
//       },
//       sensitiveData: `[ENCRYPTED: SSN-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 90) + 10}-${Math.floor(Math.random() * 9000) + 1000}]`,
//       isStudentRecord: Math.random() > 0.7,
//       preferredLanguage: languages[Math.floor(Math.random() * languages.length)],
//       accessibilityPreferences: {
//         large_print: Math.random() > 0.8,
//         braille: Math.random() > 0.95,
//         tts: Math.random() > 0.8,
//       },
//       created_at: new Date().toISOString(),
//     };
//   };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName) {
      alert('First name and last name are required');
      return;
    }

    if (editingId) {
      setPatients(
        patients.map((p) =>
          p.id === editingId
            ? { ...formData, id: editingId, created_at: p.created_at }
            : p
        )
      );
      setEditingId(null);
    } else {
      setPatients([
        ...patients,
        {
          ...formData,
          id: generateId(),
          created_at: new Date().toISOString(),
        },
      ]);
    }

    resetForm();
    setShowForm(false);
  };

  const resetForm = () => {
    setFormData({
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
  };

//   const handleGenerateRandom = () => {
//     setPatients([...patients, generateRandomPatient()]);
//   };

  const handleEdit = (patient) => {
    setFormData(patient);
    setEditingId(patient.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      setPatients(patients.filter((p) => p.id !== id));
    }
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
    const standardIsoString = dob.replace('[UTC]', '');
    const birthDate = new Date(standardIsoString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Pagination calculations
  const totalPages = Math.ceil(patients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPatients = patients.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Patient Management</h1>
          <p className="text-gray-600">Manage and generate patient records</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={() => {
              resetForm();
              setEditingId(null);
              setShowForm(!showForm);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <Plus size={20} />
            Add Patient
          </button>
          {/* <button
            onClick={handleGenerateRandom}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium"
          >
            <Plus size={20} />
            Generate Random
          </button> */}
          <div className="ml-auto text-lg font-semibold text-gray-700">
            Total Patients: <span className="text-blue-600">{patients.length}</span>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingId ? 'Edit Patient' : 'Add New Patient'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medical Record Number
                  </label>
                  <input
                    type="text"
                    name="mrn"
                    value={formData.mrn}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Gender and Language */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Language
                  </label>
                  <select
                    name="preferredLanguage"
                    value={formData.preferredLanguage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="Mandarin">Mandarin</option>
                    <option value="Vietnamese">Vietnamese</option>
                  </select>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="contact_phone"
                      value={formData.contact.phone}
                      onChange={handleInputChange}
                      placeholder="(555) 123-4567"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="contact_email"
                      value={formData.contact.email}
                      onChange={handleInputChange}
                      placeholder="patient@example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="contact_address"
                      value={formData.contact.address}
                      onChange={handleInputChange}
                      placeholder="123 Main St, City, State"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Accessibility Preferences */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Accessibility Preferences</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="accessibility_large_print"
                      checked={formData.accessibilityPreferences.large_print}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Large Print</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="accessibility_braille"
                      checked={formData.accessibilityPreferences.braille}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Braille</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="accessibility_tts"
                      checked={formData.accessibilityPreferences.tts}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Text-to-Speech</span>
                  </label>
                </div>
              </div>

              {/* FERPA Flag */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isStudentRecord"
                  checked={formData.isStudentRecord}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-700 font-medium">Student Record (FERPA Protected)</span>
              </label>

              {/* Form Actions */}
              <div className="flex gap-4 justify-end pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    resetForm();
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  {editingId ? 'Update Patient' : 'Create Patient'}
                </button>
              </div>
            </form>
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
                            {patient.sensitiveData}
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
                Showing {startIndex + 1} to {Math.min(endIndex, patients.length)} of {patients.length} patients
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
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                            currentPage === page
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

export default PatientsPage;