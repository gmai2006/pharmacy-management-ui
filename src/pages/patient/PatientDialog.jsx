import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { formatDate } from '../../util';

const PatientDialog = ({ data, setShowModal, showNotification, addOrUpdate }) => {
    const [localData, setLocalData] = useState(data);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!localData.firstName || !localData.lastName) {
            showNotification('First name and last name are required', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(localData.contact.email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        addOrUpdate(localData);
    }

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.startsWith('contact_')) {
            const field = name.replace('contact_', '');
            setLocalData({
                ...localData,
                contact: { ...localData.contact, [field]: value },
            });
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
            setLocalData({
                ...localData,
                [name]: type === 'checkbox' ? checked : value,
            });
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

                        <div className="grid grid-cols-1 gap-4">
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    name="contact_address"
                                    value={localData.contact.address}
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