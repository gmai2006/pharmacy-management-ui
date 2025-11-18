import React, { useState, useEffect } from 'react';
import {
    XCircle,
    AlertTriangle,
    Info,
    Bell,
    User,
    Pill,
    AlertCircle,
    CheckCircle,
    ChevronUp,
    ChevronDown,
    Calendar,
    Clock,
    X
} from 'lucide-react';

import init from "../../init";
import Header from './Header';
import AlertNotification from './AlertNotification';
import AlertFilter from './AlertFilter';
import ContactPresciberDialog from './ContactPrescriberDialog';
import DocumentOverrideDialog from './DocumentOverrideDialog';
import SuggestiveDialog from './SuggestiveDialog';

const getUrl = `/${init.appName}/api/view/alertview/100`;
const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};


export default function AlertPage() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [expandedAlert, setExpandedAlert] = useState(undefined);
    const [alertLogs, setAlertLogs] = useState([]);
    const [resolvedAlerts, setResolvedAlerts] = useState([]);
    const [notification, setNotification] = useState(null);
    const [modalState, setModalState] = useState({ isOpen: false, type: null, alertLogId: null });
    const [formData, setFormData] = useState({ reason: '', notes: '', alternative: '' });
    const [tooltipState, setTooltipState] = useState({ visible: false, categoryId: null });

    const fetchData = async () => {
        try {
            const response = await fetch(getUrl, { headers: headers });
            const jsonData = await response.json();
            const filteredData = jsonData.filter(alert => alert.ruleActive && !alert.resolveAt)
            setAlertLogs(filteredData);
            console.log(filteredData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getSeverityColor = (ruleSeverity) => {
        switch (ruleSeverity) {
            case 'critical':
            case 'high':
                return 'border-red-500 bg-red-50';
            case 'medium':
            case 'warning':
                return 'border-yellow-500 bg-yellow-50';
            case 'low':
            case 'info':
                return 'border-blue-500 bg-blue-50';
            default:
                return 'border-gray-500 bg-gray-50';
        }
    };

    const getSeverityIcon = (ruleSeverity) => {
        switch (ruleSeverity) {
            case 'critical':
            case 'high':
                return <XCircle className="w-6 h-6 text-red-600" />;
            case 'medium':
            case 'warning':
                return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
            case 'low':
            case 'info':
                return <Info className="w-6 h-6 text-blue-600" />;
            default:
                return <Bell className="w-6 h-6" />;
        }
    };

    const getCategoryIcon = (ruleName) => {
        switch (ruleName) {
            case 'Beers Criteria – High-Risk in Elderly':
                return <User className="w-5 h-5" />;
            case 'Duplicate Therapy – NSAIDs':
                return <AlertCircle className="w-5 h-5" />;
            case 'Drug-Drug Interaction':
                return <AlertCircle className="w-5 h-5" />;
            case 'Pregnancy Risk':
                return <AlertTriangle className="w-5 h-5" />;
            case 'Lactation Risk':
                return <AlertTriangle className="w-5 h-5" />;
            case 'Renal Impairment':
                return <AlertTriangle className="w-5 h-5" />;
            case 'Hepatic Impairment':
                return <AlertTriangle className="w-5 h-5" />;
            case 'QT Prolongation':
                return <AlertTriangle className="w-5 h-5" />;
            default:
                return <Pill className="w-5 h-5" />;
        }
    };

    const getCategoryLabel = (ruleName) => {
        const labels = {
            'Beers Criteria – High-Risk in Elderly': 'Beers Criteria',
            'Duplicate Therapy – NSAIDs': 'Duplicate NSAID',
            'Drug-Drug Interaction': 'Drug Interaction',
            'Pregnancy Risk': 'Pregnancy',
            'Lactation Risk': 'Lactation',
            'Renal Impairment': 'Renal',
            'Hepatic Impairment': 'Hepatic',
            'QT Prolongation': 'QT Risk'
        };
        return labels[ruleName] || ruleName;
    };

    const showNotificationMessage = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const openModal = (type, alertLogId) => {
        setModalState({ isOpen: true, type, alertLogId });
        setFormData({ reason: '', notes: '', alternative: '' });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, type: null, alertLogId: null });
        setFormData({ reason: '', notes: '', alternative: '' });
    };

    const handleModalSubmit = () => {
        const { type, alertLogId } = modalState;

        if (!alertLogId) return;

        if (type === 'contact-prescriber') {
            if (!formData.reason.trim()) {
                showNotificationMessage('Please enter a reason for contacting', 'error');
                return;
            }
            handleResolveAlert(alertLogId, `contacted-prescriber: ${formData.reason}`);
        } else if (type === 'override') {
            if (!formData.reason.trim()) {
                showNotificationMessage('Please enter an override reason', 'error');
                return;
            }
            handleResolveAlert(alertLogId, `override: ${formData.reason}`);
        } else if (type === 'alternative') {
            if (!formData.alternative.trim()) {
                showNotificationMessage('Please enter an alternative medication', 'error');
                return;
            }
            handleResolveAlert(alertLogId, `alternative: ${formData.alternative}`);
        }
    };

    const handleResolveAlert = (alertLogId, action) => {
        const alert = alertLogs.find(a => a.alertLogId === alertLogId);
        if (alert) {
            setResolvedAlerts([
                ...resolvedAlerts,
                {
                    ...alert,
                    actionTaken: action,
                    resolvedAt: new Date().toLocaleString()
                }
            ]);
            showNotificationMessage(`Alert resolved successfully`, 'success');
        }
        closeModal();
    };

    const categoryAll = {
        alertRuleId: 'all',
        ruleName: 'All Alerts',
        count: alertLogs.length
    };

    const groupBy = Map.groupBy(alertLogs, (alert) => alert.alertRuleId);

    const ruleCategories = [...groupBy.keys()].map(key => ({
        alertRuleId: '' + key,
        ruleName: groupBy.get(key)[0].ruleName.substring(0, 10).concat('...'),
        count: groupBy.get(key).length
    })
    );

    const alertCategories = [categoryAll, ...ruleCategories];

    const formatUnixTimestamp = (timestamp) => {
        if (!timestamp) return 'N/A';
        try {
            const date = new Date(timestamp * 1000);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'Invalid Date';
        }
    };

    const calculateAge = (dobArray) => {
        if (!Array.isArray(dobArray) || dobArray.length < 3) return 'N/A';
        try {
            const dob = new Date(dobArray[0], dobArray[1] - 1, dobArray[2]);
            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                age--;
            }
            return age;
        } catch {
            return 'N/A';
        }
    };

    const formatDob = (dobArray) => {
        if (!Array.isArray(dobArray) || dobArray.length < 3) return 'N/A';
        return `${dobArray[1]}/${dobArray[2]}/${dobArray[0]}`;
    };

    const parseJson = (jsonString) => {
        try {
            return typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
        } catch {
            return {};
        }
    };

    const filteredAlerts = activeCategory === 'all'
        ? alertLogs
        : alertLogs.filter(a => a.alertRuleId.toLocaleString() === activeCategory);

    return (
        <div>
            <Header filteredAlerts={filteredAlerts} />

            <div className="min-h-screen bg-gray-50">
                {/* Notification Toast */}
                {notification && (
                    <AlertNotification notification={notification} />
                )}

                {/* Category Filter */}
                <AlertFilter alertCategories={alertCategories} tooltipState={tooltipState} setTooltipState={setTooltipState} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

                {/* Main Content */}
                <div className="mx-auto px-4 py-6">
                    <div className="space-y-4">
                        {filteredAlerts.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    No Active Alerts
                                </h3>
                                <p className="text-gray-600">
                                    All clinical alerts have been reviewed and resolved
                                </p>
                            </div>
                        ) : (
                            filteredAlerts.map(alert => {
                                const ruleJson = parseJson(alert.ruleJson);
                                const metadata = parseJson(alert.prescriptionMetadata);
                                const context = parseJson(alert.context);
                                const patientAge = calculateAge(alert.patientDob);

                                return (
                                    <div
                                        key={alert.alertLogId}
                                        className={`bg-white rounded-lg shadow-md border-l-4 ${getSeverityColor(
                                            alert.ruleSeverity
                                        )} overflow-hidden transition-all`}
                                    >
                                        {/* Alert Header */}
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-start gap-4 flex-1">
                                                    <div className="mt-1">{getSeverityIcon(alert.ruleSeverity)}</div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                            <span
                                                                className={`px-3 py-1 rounded-full text-xs font-bold ${alert.ruleSeverity === 'critical' ||
                                                                    alert.ruleSeverity === 'high'
                                                                    ? 'bg-red-100 text-red-800'
                                                                    : alert.ruleSeverity === 'medium' ||
                                                                        alert.ruleSeverity === 'warning'
                                                                        ? 'bg-yellow-100 text-yellow-800'
                                                                        : 'bg-blue-100 text-blue-800'
                                                                    }`}
                                                            >
                                                                {alert.ruleSeverity.toUpperCase()}
                                                            </span>
                                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 flex items-center gap-1">
                                                                {getCategoryIcon(alert.ruleName)}
                                                                {getCategoryLabel(alert.ruleName)}
                                                            </span>
                                                            {alert.prescriptionPriority && (
                                                                <span
                                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${alert.prescriptionPriority === 'high'
                                                                        ? 'bg-red-100 text-red-700'
                                                                        : alert.prescriptionPriority === 'normal'
                                                                            ? 'bg-blue-100 text-blue-700'
                                                                            : 'bg-gray-100 text-gray-700'
                                                                        }`}
                                                                >
                                                                    Priority: {alert.prescriptionPriority}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                            {alert.ruleDescription}
                                                        </h3>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                            <div className="flex items-center gap-2 text-gray-700">
                                                                <User className="w-4 h-4" />
                                                                <span>
                                                                    <strong>Patient:</strong> {alert.patientFirstName}{' '}
                                                                    {alert.patientLastName} (Age: {patientAge}, MRN:{' '}
                                                                    {alert.patientMrn})
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-gray-700">
                                                                <Calendar className="w-4 h-4" />
                                                                <span>{formatUnixTimestamp(alert.prescriptionIssueDate)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        setExpandedAlert(
                                                            expandedAlert === alert.alertLogId ? null : alert.alertLogId
                                                        )
                                                    }
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                >
                                                    {expandedAlert === alert.alertLogId ? (
                                                        <ChevronUp className="w-5 h-5 text-gray-600" />
                                                    ) : (
                                                        <ChevronDown className="w-5 h-5 text-gray-600" />
                                                    )}
                                                </button>
                                            </div>

                                            {/* Prescription & Rule Details */}
                                            <div className="bg-white border rounded-lg p-4 mb-4">
                                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                    <Pill className="w-4 h-4" />
                                                    Prescription Details
                                                </h4>
                                                <div className="space-y-3">
                                                    <div className="flex items-start justify-between p-3 bg-gray-50 rounded">
                                                        <div className="flex-1">
                                                            <p className="font-medium text-gray-900">
                                                                {metadata.medication || 'Medication'}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                ERx ID: {metadata.erx_id || 'N/A'}
                                                            </p>
                                                            {metadata.quantity_dispensed !== undefined && (
                                                                <p className="text-sm text-gray-600">
                                                                    Quantity: {metadata.quantity_dispensed} unit(s)
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="ml-4 text-right">
                                                            <span
                                                                className={`inline-block px-3 py-1 rounded text-xs font-semibold ${alert.prescriptionStatus === 'filled'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : alert.prescriptionStatus === 'pending'
                                                                        ? 'bg-yellow-100 text-yellow-800'
                                                                        : 'bg-gray-100 text-gray-800'
                                                                    }`}
                                                            >
                                                                {alert.prescriptionStatus.charAt(0).toUpperCase() +
                                                                    alert.prescriptionStatus.slice(1)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Patient Demographics */}
                                                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                        <p className="text-sm text-blue-900 mb-1">
                                                            <strong>Patient:</strong> {alert.patientFirstName}{' '}
                                                            {alert.patientLastName}, {alert.patientGender} | DOB:{' '}
                                                            {formatDob(alert.patientDob)} (Age: {patientAge})
                                                        </p>
                                                        <p className="text-sm text-blue-900">
                                                            <strong>Prescriber:</strong> {alert.prescriberName}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Expanded Details */}
                                            {expandedAlert === alert.alertLogId && (
                                                <div className="space-y-4">
                                                    {/* Clinical Recommendation */}
                                                    {ruleJson.clinical_recommendation && (
                                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                                            <h4 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                                                                <AlertTriangle className="w-4 h-4" />
                                                                Clinical Recommendation
                                                            </h4>
                                                            <p className="text-sm text-yellow-800">
                                                                {ruleJson.clinical_recommendation}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* Alert Context */}
                                                    {context.notes && (
                                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                                                <Info className="w-4 h-4" />
                                                                Alert Details
                                                            </h4>
                                                            <p className="text-sm text-blue-800">{context.notes}</p>
                                                        </div>
                                                    )}

                                                    {/* Additional Info Grid */}
                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                        <div className="bg-gray-50 rounded-lg p-3">
                                                            <p className="text-xs text-gray-600 mb-1">Queue</p>
                                                            <p className="font-medium text-gray-900 text-sm">
                                                                {alert.queueName || 'N/A'}
                                                            </p>
                                                        </div>
                                                        <div className="bg-gray-50 rounded-lg p-3">
                                                            <p className="text-xs text-gray-600 mb-1">Pharmacist Action</p>
                                                            <p className="font-medium text-gray-900 text-sm">
                                                                {alert.pharmacistAction || 'Pending'}
                                                            </p>
                                                        </div>
                                                        <div className="bg-gray-50 rounded-lg p-3">
                                                            <p className="text-xs text-gray-600 mb-1">Action Taken</p>
                                                            <p className="font-medium text-gray-900 text-sm capitalize">
                                                                {alert.actionTaken || 'N/A'}
                                                            </p>
                                                        </div>
                                                        <div className="bg-gray-50 rounded-lg p-3">
                                                            <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                Alert Created
                                                            </p>
                                                            <p className="font-medium text-gray-900 text-xs">
                                                                {formatUnixTimestamp(alert.alertCreatedAt)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="flex gap-3 mt-4 pt-4 border-t flex-wrap">
                                                <button
                                                    onClick={() => openModal('contact-prescriber', alert.alertLogId)}
                                                    className="flex-1 min-w-40 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                                >
                                                    Contact Prescriber
                                                </button>
                                                <button
                                                    onClick={() => handleResolveAlert(alert.alertLogId, 'accepted')}
                                                    className="flex-1 min-w-40 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                                >
                                                    Accept Alert
                                                </button>
                                                <button
                                                    onClick={() => openModal('alternative', alert.alertLogId)}
                                                    className="flex-1 min-w-40 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                                                >
                                                    Suggest Alternative
                                                </button>
                                                <button
                                                    onClick={() => openModal('override', alert.alertLogId)}
                                                    className="flex-1 min-w-40 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                                                >
                                                    Override
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Modal Dialogs */}
                    {/* Contact Prescriber Modal */}
                    {modalState.isOpen && modalState.type === 'contact-prescriber' && (
                        <ContactPresciberDialog formData={formData} setFormData={setFormData} closeModal={closeModal} handleModalSubmit={handleModalSubmit} />
                    )}

                    {/* Suggest Alternative Modal */}
                    {modalState.isOpen && modalState.type === 'alternative' && (
                        <SuggestiveDialog formData={formData} setFormData={setFormData} closeModal={closeModal} handleModalSubmit={handleModalSubmit} />
                    )}

                    {/* Document Override Modal */}
                    {modalState.isOpen && modalState.type === 'override' && (
                        <DocumentOverrideDialog formData={formData} setFormData={setFormData} closeModal={closeModal} handleModalSubmit={handleModalSubmit} />
                    )}

                    {/* Resolved Alerts Section */}
                    {resolvedAlerts.length > 0 && (
                        <div className="mt-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Recently Resolved Alerts</h2>
                            <div className="space-y-2">
                                {resolvedAlerts.slice(0, 5).map(alert => (
                                    <div
                                        key={alert.alertLogId}
                                        className="bg-white rounded-lg shadow-sm border p-4 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                            <div>
                                                <p className="font-medium text-gray-900">{alert.ruleDescription}</p>
                                                <p className="text-sm text-gray-600">
                                                    {alert.patientFirstName} {alert.patientLastName} - {alert.actionTaken}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-500">{alert.resolvedAt}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}