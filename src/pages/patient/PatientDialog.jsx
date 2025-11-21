import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { formatDate } from '../../utils/util';

const PatientDialog = ({ data, setShowModal, showNotification, addOrUpdate }) => {
    const [localData, setLocalData] = useState(data);
    const [dobError, setDobError] = useState('');
    const [zipcodeError, setZipcodeError] = useState('');

    // US States list
    const US_STATES = [
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
        'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
        'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
        'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
        'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'
    ];

    const US_STATE_NAMES = {
        'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
        'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
        'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho',
        'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
        'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
        'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
        'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
        'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
        'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
        'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
        'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
        'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
        'WI': 'Wisconsin', 'WY': 'Wyoming', 'DC': 'District of Columbia'
    };

    const emptyData = {
        mrn: '',
        firstName: '',
        lastName: '',
        dob: '',
        gender: '',
        contact: {
            phone: '',
            email: '',
            address: '',
            state: '',
            zipcode: '',
        },
        isStudentRecord: false,
        preferredLanguage: 'English',
        accessibilityPreferences: {
            large_print: false,
            braille: false,
            tts: false,
        },
    };

    useEffect(() => {
        const nullableData = [data].filter(u => u != undefined).concat(emptyData);
        setLocalData(nullableData[0]);
    }, []);

    const validateDob = (dobValue) => {
        if (!dobValue) {
            setDobError('');
            return true;
        }

        const dobDate = new Date(dobValue);
        const today = new Date();

        // Set time to midnight for accurate date comparison
        today.setHours(0, 0, 0, 0);
        dobDate.setHours(0, 0, 0, 0);

        if (dobDate >= today) {
            setDobError('Date of birth must be older than today');
            return false;
        }

        setDobError('');
        return true;
    };

    /**
     * Validate US zipcode format
     * Accepts: XXXXX or XXXXX-XXXX format
     */
    const validateZipcode = (zipcodeValue) => {
        if (!zipcodeValue) {
            setZipcodeError('');
            return true;
        }

        // US Zipcode regex: 5 digits or 5 digits + 4 digits (ZIP+4)
        const zipcodeRegex = /^\d{5}(-\d{4})?$/;

        if (!zipcodeRegex.test(zipcodeValue)) {
            setZipcodeError('Zipcode must be in format XXXXX or XXXXX-XXXX');
            return false;
        }

        setZipcodeError('');
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!localData.firstName || !localData.lastName) {
            showNotification('First name and last name are required', 'error');
            return;
        }

        // Validate DOB is older than current date
        if (!validateDob(localData.dob)) {
            showNotification('Date of birth must be older than today', 'error');
            return;
        }

        // Validate zipcode if provided
        if (localData.contact.zipcode && !validateZipcode(localData.contact.zipcode)) {
            showNotification('Please enter a valid zipcode (XXXXX or XXXXX-XXXX)', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (localData.contact.email && !emailRegex.test(localData.contact.email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        addOrUpdate(localData);
    }

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.startsWith('contact_')) {
            const field = name.replace('contact_', '');
            const newValue = type === 'checkbox' ? checked : value;
            setLocalData({
                ...localData,
                contact: { ...localData.contact, [field]: newValue },
            });

            // Validate zipcode on change
            if (field === 'zipcode') {
                validateZipcode(newValue);
            }
        } else if (name.startsWith('accessibility_')) {
            const field = name.replace('accessibility_', '');
            setLocalData({
                ...localData,
                accessibilityPreferences: {
                    ...localData.accessibilityPreferences,
                    [field]: checked,
                },
            });
        } else {
            const newValue = type === 'checkbox' ? checked : value;
            setLocalData({
                ...localData,
                [name]: newValue,
            });

            // Validate DOB on change
            if (name === 'dob') {
                validateDob(newValue);
            }
        }
    };

    return localData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {localData.id ? 'Edit Patient' : 'Add New Patient'}
                    </h2>
                    <button
                        onClick={() => {
                            setShowModal(false);
                        }}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                First Name *
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={localData.firstName}
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
                                value={localData.lastName}
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
                                value={localData.mrn}
                                onChange={handleInputChange}
                                placeholder="MRN000001"
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
                                value={formatDate(localData.dob)}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                                    dobError
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            />
                            {dobError && (
                                <p className="mt-2 text-sm text-red-600">{dobError}</p>
                            )}
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
                                value={localData.gender}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Preferred Language
                            </label>
                            <select
                                name="preferred_language"
                                value={localData.preferredLanguage}
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    name="contact_phone"
                                    value={localData.contact.phone}
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
                                    value={localData.contact.email}
                                    onChange={handleInputChange}
                                    placeholder="patient@example.com"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    name="contact_address"
                                    value={localData.contact.address}
                                    onChange={handleInputChange}
                                    placeholder="123 Main St"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* State and Zipcode Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    State
                                </label>
                                <select
                                    name="contact_state"
                                    value={localData.contact.state || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select State</option>
                                    {US_STATES.map((stateCode) => (
                                        <option key={stateCode} value={stateCode}>
                                            {US_STATE_NAMES[stateCode]} ({stateCode})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Zipcode
                                </label>
                                <input
                                    type="text"
                                    name="contact_zipcode"
                                    value={localData.contact.zipcode || ''}
                                    onChange={handleInputChange}
                                    placeholder="98101 or 98101-1234"
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                                        zipcodeError
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                />
                                {zipcodeError && (
                                    <p className="mt-2 text-sm text-red-600">{zipcodeError}</p>
                                )}
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
                                    checked={localData.accessibilityPreferences.large_print}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-gray-700">Large Print</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="accessibility_braille"
                                    checked={localData.accessibilityPreferences.braille}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-gray-700">Braille</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="accessibility_tts"
                                    checked={localData.accessibilityPreferences.tts}
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
                            name="is_student_record"
                            checked={localData.isStudentRecord}
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
                                setShowModal(false);
                            }}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                        >
                            {localData.id ? 'Update Patient' : 'Create Patient'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default PatientDialog;