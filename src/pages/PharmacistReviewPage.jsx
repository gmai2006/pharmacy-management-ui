import React, { useState } from 'react';
import { Bell, AlertTriangle, CheckCircle, XCircle, FileText, Settings, Save, Plus, Trash2, Edit2, User, Pill, Calendar, Clock } from 'lucide-react';

export default function PharmacistReview() {
  const [activeTab, setActiveTab] = useState('review');
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'critical',
      title: 'Drug Interaction Detected',
      message: 'Warfarin and Aspirin interaction - increased bleeding risk',
      patient: 'John Smith',
      medication: 'Aspirin 81mg',
      timestamp: '2025-11-05 09:30',
      status: 'pending'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Dosage Verification Required',
      message: 'High dose prescribed - verify with prescriber',
      patient: 'Mary Johnson',
      medication: 'Metformin 2000mg',
      timestamp: '2025-11-05 09:15',
      status: 'pending'
    },
    {
      id: 3,
      type: 'info',
      title: 'Refill Due Soon',
      message: 'Patient has 3 days supply remaining',
      patient: 'Robert Davis',
      medication: 'Lisinopril 10mg',
      timestamp: '2025-11-05 08:45',
      status: 'pending'
    }
  ]);

  const [alertConfig, setAlertConfig] = useState([
    { id: 1, name: 'Drug Interactions', enabled: true, severity: 'critical' },
    { id: 2, name: 'Allergy Alerts', enabled: true, severity: 'critical' },
    { id: 3, name: 'Duplicate Therapy', enabled: true, severity: 'warning' },
    { id: 4, name: 'High Dose Warning', enabled: true, severity: 'warning' },
    { id: 5, name: 'Refill Reminders', enabled: true, severity: 'info' },
    { id: 6, name: 'Age-related Warnings', enabled: false, severity: 'warning' }
  ]);

  const [documentation, setDocumentation] = useState([
    {
      id: 1,
      alertId: 1,
      note: 'Contacted Dr. Williams - confirmed aware of interaction, patient monitored regularly',
      pharmacist: 'Sarah Chen, RPh',
      timestamp: '2025-11-05 09:35',
      action: 'approved'
    }
  ]);

  const [newNote, setNewNote] = useState('');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [editingConfig, setEditingConfig] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newAlertType, setNewAlertType] = useState({
    name: '',
    severity: 'warning',
    description: ''
  });

  const handleResolveAlert = (alertId, action) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, status: action } : alert
    ));
    
    if (newNote.trim() && selectedAlert === alertId) {
      const newDoc = {
        id: documentation.length + 1,
        alertId,
        note: newNote,
        pharmacist: 'Current User, RPh',
        timestamp: new Date().toLocaleString(),
        action
      };
      setDocumentation([...documentation, newDoc]);
      setNewNote('');
      setSelectedAlert(null);
    }
  };

  const toggleAlertConfig = (id) => {
    setAlertConfig(alertConfig.map(config =>
      config.id === id ? { ...config, enabled: !config.enabled } : config
    ));
  };

  const handleCreateAlertType = () => {
    if (newAlertType.name.trim()) {
      const newConfig = {
        id: alertConfig.length + 1,
        name: newAlertType.name,
        enabled: true,
        severity: newAlertType.severity,
        description: newAlertType.description
      };
      setAlertConfig([...alertConfig, newConfig]);
      setShowModal(false);
      setNewAlertType({ name: '', severity: 'warning', description: '' });
    }
  };

  const getAlertIcon = (type) => {
    switch(type) {
      case 'critical': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info': return <Bell className="w-5 h-5 text-blue-500" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getAlertBorderColor = (type) => {
    switch(type) {
      case 'critical': return 'border-l-red-500';
      case 'warning': return 'border-l-yellow-500';
      case 'info': return 'border-l-blue-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modal for Creating New Alert Type */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">Create New Alert Type</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alert Name *
                </label>
                <input
                  type="text"
                  value={newAlertType.name}
                  onChange={(e) => setNewAlertType({ ...newAlertType, name: e.target.value })}
                  placeholder="e.g., Pregnancy Category Alert"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Severity Level *
                </label>
                <select
                  value={newAlertType.severity}
                  onChange={(e) => setNewAlertType({ ...newAlertType, severity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="critical">Critical</option>
                </select>
                <div className="mt-2 flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    newAlertType.severity === 'critical' ? 'bg-red-500' :
                    newAlertType.severity === 'warning' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}></div>
                  <span className="text-sm text-gray-600">
                    {newAlertType.severity === 'critical' && 'Requires immediate attention'}
                    {newAlertType.severity === 'warning' && 'Needs review before approval'}
                    {newAlertType.severity === 'info' && 'Informational only'}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={newAlertType.description}
                  onChange={(e) => setNewAlertType({ ...newAlertType, description: e.target.value })}
                  placeholder="Describe when this alert should trigger..."
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-lg">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAlertType}
                disabled={!newAlertType.name.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Alert Type
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Pill className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Pharmacist Review System</h1>
                <p className="text-sm text-gray-500">Alert Management & Documentation</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {alerts.filter(a => a.status === 'pending').length} Pending
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('review')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'review'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Alert Review
              </div>
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'config'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Alert Configuration
              </div>
            </button>
            <button
              onClick={() => setActiveTab('documentation')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'documentation'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Documentation
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Alert Review Tab */}
        {activeTab === 'review' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Alerts</h2>
              <div className="space-y-3">
                {alerts.filter(a => a.status === 'pending').map(alert => (
                  <div
                    key={alert.id}
                    className={`border-l-4 ${getAlertBorderColor(alert.type)} bg-white rounded-lg shadow-sm p-4`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3 flex-1">
                        {getAlertIcon(alert.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              alert.type === 'critical' ? 'bg-red-100 text-red-800' :
                              alert.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {alert.type.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-3">{alert.message}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>Patient: <strong>{alert.patient}</strong></span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Pill className="w-4 h-4" />
                              <span>Medication: <strong>{alert.medication}</strong></span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{alert.timestamp}</span>
                            </div>
                          </div>
                          
                          {selectedAlert === alert.id && (
                            <div className="mt-3">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Documentation Note
                              </label>
                              <textarea
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows="3"
                                placeholder="Enter your review notes, actions taken, or communications..."
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-3 ml-8">
                      {selectedAlert !== alert.id ? (
                        <button
                          onClick={() => setSelectedAlert(alert.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Review & Document
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleResolveAlert(alert.id, 'approved')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleResolveAlert(alert.id, 'rejected')}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                          <button
                            onClick={() => {
                              setSelectedAlert(null);
                              setNewNote('');
                            }}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                {alerts.filter(a => a.status === 'pending').length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                    <p>No pending alerts to review</p>
                  </div>
                )}
              </div>
            </div>

            {/* Resolved Alerts */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recently Resolved</h2>
              <div className="space-y-2">
                {alerts.filter(a => a.status !== 'pending').map(alert => (
                  <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getAlertIcon(alert.type)}
                      <div>
                        <p className="font-medium text-gray-900">{alert.title}</p>
                        <p className="text-sm text-gray-600">{alert.patient} - {alert.medication}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      alert.status === 'approved' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {alert.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Alert Configuration Tab */}
        {activeTab === 'config' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Alert Configuration</h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
            
            <div className="space-y-3">
              {alertConfig.map(config => (
                <div key={config.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.enabled}
                        onChange={() => toggleAlertConfig(config.id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{config.name}</h3>
                      <p className="text-sm text-gray-600">
                        Severity: <span className={`font-medium ${
                          config.severity === 'critical' ? 'text-red-600' :
                          config.severity === 'warning' ? 'text-yellow-600' :
                          'text-blue-600'
                        }`}>{config.severity}</span>
                      </p>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => setShowModal(true)}
              className="mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Alert Type
            </button>
          </div>
        )}

        {/* Documentation Tab */}
        {activeTab === 'documentation' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Review Documentation History</h2>
            <div className="space-y-4">
              {documentation.map(doc => {
                const alert = alerts.find(a => a.id === doc.alertId);
                return (
                  <div key={doc.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-gray-600" />
                        <h3 className="font-semibold text-gray-900">{alert?.title}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          doc.action === 'approved' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {doc.action}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3 pl-7">{doc.note}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 pl-7">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {doc.pharmacist}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {doc.timestamp}
                      </span>
                      {alert && (
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          Patient: {alert.patient}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
              {documentation.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-2" />
                  <p>No documentation entries yet</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}