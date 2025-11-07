import React, { useState } from 'react';
import { AlertTriangle, XCircle, CheckCircle, Bell, Baby, Heart, Pill, Calculator, AlertCircle, ChevronDown, ChevronUp, User, Calendar, Info, Shield, Activity } from 'lucide-react';

export default function ClinicalAlertSystem() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedAlert, setExpandedAlert] = useState(null);

  // Clinical Alerts Data
  const [clinicalAlerts] = useState([
    {
      id: 'CA001',
      type: 'morphine-equivalent',
      severity: 'critical',
      title: 'High Morphine Equivalent Daily Dose (MEDD)',
      patient: 'John Smith',
      patientAge: 58,
      medications: [
        { name: 'Oxycodone 30mg', dose: '4 times daily', medd: 180 },
        { name: 'Hydrocodone 10mg', dose: '3 times daily', medd: 30 }
      ],
      totalMEDD: 210,
      threshold: 90,
      recommendation: 'Total MEDD exceeds 90 MME/day. Consider dose reduction, alternative therapy, or naloxone co-prescription. Evaluate patient for opioid use disorder.',
      guidelines: 'CDC Guideline: Avoid or carefully justify doses ≥90 MME/day',
      prescriber: 'Dr. Williams',
      timestamp: '2025-11-05 09:30',
      status: 'pending'
    },
    {
      id: 'CA002',
      type: 'pregnancy',
      severity: 'critical',
      title: 'Pregnancy Category Risk - Teratogenic Medication',
      patient: 'Sarah Johnson',
      patientAge: 28,
      patientInfo: 'Female, Age 28, Pregnancy detected',
      medications: [
        { name: 'Isotretinoin 40mg', category: 'X', risk: 'Contraindicated in pregnancy' }
      ],
      pregnancyCategory: 'X',
      trimester: 'First Trimester',
      recommendation: 'CONTRAINDICATED in pregnancy. Known teratogen causing severe birth defects. Discontinue immediately and contact prescriber. Verify pregnancy status and contraception use.',
      alternatives: 'Consider topical treatments or pregnancy-safe systemic alternatives after delivery',
      prescriber: 'Dr. Martinez',
      timestamp: '2025-11-05 10:15',
      status: 'pending'
    },
    {
      id: 'CA003',
      type: 'lactation',
      severity: 'warning',
      title: 'Lactation Safety Concern',
      patient: 'Emily Davis',
      patientAge: 32,
      patientInfo: 'Female, Age 32, Breastfeeding infant (3 months)',
      medications: [
        { name: 'Codeine 30mg', risk: 'Passes into breast milk, risk of infant sedation' }
      ],
      lactationRisk: 'L4 - Possibly Hazardous',
      infantAge: '3 months',
      recommendation: 'Codeine use during breastfeeding associated with serious adverse events in nursing infants. Consider safer alternatives like acetaminophen or ibuprofen.',
      alternatives: 'Acetaminophen, Ibuprofen (both L1 - Safest)',
      prescriber: 'Dr. Chen',
      timestamp: '2025-11-05 11:00',
      status: 'pending'
    },
    {
      id: 'CA004',
      type: 'renal',
      severity: 'warning',
      title: 'Renal Dose Adjustment Required',
      patient: 'Robert Wilson',
      patientAge: 72,
      patientInfo: 'Male, Age 72, CrCl: 28 mL/min (Stage 4 CKD)',
      medications: [
        { name: 'Metformin 1000mg BID', currentDose: '1000mg twice daily', recommendedDose: 'Contraindicated' }
      ],
      renalFunction: 'CrCl 28 mL/min',
      ckdStage: 'Stage 4',
      recommendation: 'Metformin is contraindicated in severe renal impairment (CrCl <30 mL/min) due to increased risk of lactic acidosis. Discontinue and consider alternative diabetes management.',
      alternatives: 'Consider insulin, DPP-4 inhibitors with dose adjustment, or SGLT2 inhibitors',
      prescriber: 'Dr. Patel',
      timestamp: '2025-11-05 12:30',
      status: 'pending'
    },
    {
      id: 'CA005',
      type: 'geriatric',
      severity: 'warning',
      title: 'Beers Criteria - Potentially Inappropriate Medication',
      patient: 'Margaret Anderson',
      patientAge: 78,
      patientInfo: 'Female, Age 78',
      medications: [
        { name: 'Diphenhydramine 50mg', beersRating: 'Avoid', reason: 'High anticholinergic burden' }
      ],
      ageGroup: 'Geriatric (≥65 years)',
      recommendation: 'Avoid first-generation antihistamines in older adults. High risk of confusion, dry mouth, constipation, and increased fall risk due to anticholinergic effects.',
      alternatives: 'Second-generation antihistamines (loratadine, cetirizine) or non-pharmacologic approaches',
      prescriber: 'Dr. Brown',
      timestamp: '2025-11-05 13:45',
      status: 'pending'
    },
    {
      id: 'CA006',
      type: 'interaction',
      severity: 'critical',
      title: 'Major Drug Interaction - QT Prolongation Risk',
      patient: 'Michael Lee',
      patientAge: 55,
      medications: [
        { name: 'Azithromycin 500mg', effect: 'QT prolongation' },
        { name: 'Amiodarone 200mg', effect: 'QT prolongation' }
      ],
      interactionType: 'Pharmacodynamic - Additive QT prolongation',
      recommendation: 'Combination increases risk of torsades de pointes and sudden cardiac death. Monitor ECG closely or consider alternative antibiotics without QT effects.',
      alternatives: 'Consider doxycycline or fluoroquinolones (if appropriate)',
      prescriber: 'Dr. Johnson',
      timestamp: '2025-11-05 14:20',
      status: 'pending'
    },
    {
      id: 'CA007',
      type: 'pediatric',
      severity: 'warning',
      title: 'Pediatric Dosing Verification Required',
      patient: 'Emma Thompson',
      patientAge: 4,
      patientInfo: 'Female, Age 4, Weight: 18 kg',
      medications: [
        { 
          name: 'Amoxicillin 500mg TID', 
          currentDose: '500mg three times daily',
          weightBasedDose: '25-50 mg/kg/day',
          calculatedMax: '900 mg/day',
          prescribed: '1500 mg/day'
        }
      ],
      weight: '18 kg',
      recommendation: 'Prescribed dose (1500mg/day) exceeds recommended pediatric dosing range (450-900mg/day for 18kg). Verify dose with prescriber.',
      correctDose: '150-300mg three times daily',
      prescriber: 'Dr. Garcia',
      timestamp: '2025-11-05 15:00',
      status: 'pending'
    }
  ]);

  const [resolvedAlerts, setResolvedAlerts] = useState([]);

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'warning': return 'border-yellow-500 bg-yellow-50';
      case 'info': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getSeverityIcon = (severity) => {
    switch(severity) {
      case 'critical': return <XCircle className="w-6 h-6 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
      case 'info': return <Info className="w-6 h-6 text-blue-600" />;
      default: return <Bell className="w-6 h-6" />;
    }
  };

  const getCategoryIcon = (type) => {
    switch(type) {
      case 'morphine-equivalent': return <Calculator className="w-5 h-5" />;
      case 'pregnancy': return <Baby className="w-5 h-5" />;
      case 'lactation': return <Heart className="w-5 h-5" />;
      case 'renal': return <Activity className="w-5 h-5" />;
      case 'geriatric': return <User className="w-5 h-5" />;
      case 'pediatric': return <Baby className="w-5 h-5" />;
      case 'interaction': return <AlertCircle className="w-5 h-5" />;
      default: return <Pill className="w-5 h-5" />;
    }
  };

  const getCategoryLabel = (type) => {
    const labels = {
      'morphine-equivalent': 'Opioid MEDD',
      'pregnancy': 'Pregnancy',
      'lactation': 'Lactation',
      'renal': 'Renal',
      'geriatric': 'Geriatric',
      'pediatric': 'Pediatric',
      'interaction': 'Interaction'
    };
    return labels[type] || type;
  };

  const handleResolveAlert = (alertId, action) => {
    const alert = clinicalAlerts.find(a => a.id === alertId);
    if (alert) {
      setResolvedAlerts([...resolvedAlerts, { ...alert, action, resolvedAt: new Date().toLocaleString() }]);
    }
  };

  const filteredAlerts = activeCategory === 'all' 
    ? clinicalAlerts.filter(a => a.status === 'pending')
    : clinicalAlerts.filter(a => a.type === activeCategory && a.status === 'pending');

  const alertCategories = [
    { id: 'all', label: 'All Alerts', count: clinicalAlerts.filter(a => a.status === 'pending').length },
    { id: 'morphine-equivalent', label: 'Opioid MEDD', count: clinicalAlerts.filter(a => a.type === 'morphine-equivalent' && a.status === 'pending').length },
    { id: 'pregnancy', label: 'Pregnancy', count: clinicalAlerts.filter(a => a.type === 'pregnancy' && a.status === 'pending').length },
    { id: 'lactation', label: 'Lactation', count: clinicalAlerts.filter(a => a.type === 'lactation' && a.status === 'pending').length },
    { id: 'renal', label: 'Renal', count: clinicalAlerts.filter(a => a.type === 'renal' && a.status === 'pending').length },
    { id: 'geriatric', label: 'Geriatric', count: clinicalAlerts.filter(a => a.type === 'geriatric' && a.status === 'pending').length },
    { id: 'pediatric', label: 'Pediatric', count: clinicalAlerts.filter(a => a.type === 'pediatric' && a.status === 'pending').length },
    { id: 'interaction', label: 'Interactions', count: clinicalAlerts.filter(a => a.type === 'interaction' && a.status === 'pending').length }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Clinical Alert System</h1>
                  <p className="text-red-100 text-sm">Patient Safety & Medication Monitoring</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                <p className="text-white text-sm font-medium">Active Alerts</p>
                <p className="text-3xl font-bold text-white text-center">{filteredAlerts.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto">
            {alertCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === category.id
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
                {category.count > 0 && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                    activeCategory === category.id ? 'bg-white text-red-600' : 'bg-red-100 text-red-700'
                  }`}>
                    {category.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Alerts</h3>
              <p className="text-gray-600">All clinical alerts have been reviewed</p>
            </div>
          ) : (
            filteredAlerts.map(alert => (
              <div
                key={alert.id}
                className={`bg-white rounded-lg shadow-md border-l-4 ${getSeverityColor(alert.severity)} overflow-hidden transition-all`}
              >
                {/* Alert Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-1">
                        {getSeverityIcon(alert.severity)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                            alert.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {alert.severity.toUpperCase()}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 flex items-center gap-1">
                            {getCategoryIcon(alert.type)}
                            {getCategoryLabel(alert.type)}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{alert.title}</h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-700">
                            <User className="w-4 h-4" />
                            <span><strong>Patient:</strong> {alert.patient} (Age: {alert.patientAge})</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <Calendar className="w-4 h-4" />
                            <span>{alert.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {expandedAlert === alert.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                  </div>

                  {/* Medication Details */}
                  <div className="bg-white border rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Pill className="w-4 h-4" />
                      Medications Involved
                    </h4>
                    <div className="space-y-2">
                      {alert.medications.map((med, idx) => (
                        <div key={idx} className="flex items-start justify-between p-2 bg-gray-50 rounded">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{med.name}</p>
                            {med.dose && <p className="text-sm text-gray-600">{med.dose}</p>}
                            {med.currentDose && <p className="text-sm text-gray-600">Current: {med.currentDose}</p>}
                            {med.category && (
                              <p className="text-sm text-red-600 font-medium">
                                Pregnancy Category: {med.category} - {med.risk}
                              </p>
                            )}
                            {med.beersRating && (
                              <p className="text-sm text-yellow-600 font-medium">
                                Beers Criteria: {med.beersRating} - {med.reason}
                              </p>
                            )}
                          </div>
                          {med.medd && (
                            <span className="ml-4 px-3 py-1 bg-red-100 text-red-800 rounded text-sm font-bold">
                              {med.medd} MME/day
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {/* Special Calculations */}
                    {alert.totalMEDD && (
                      <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-red-900">Total MEDD:</span>
                          <span className="text-2xl font-bold text-red-700">{alert.totalMEDD} MME/day</span>
                        </div>
                        <p className="text-sm text-red-700 mt-1">Threshold: {alert.threshold} MME/day</p>
                      </div>
                    )}

                    {alert.patientInfo && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-900"><strong>Patient Info:</strong> {alert.patientInfo}</p>
                      </div>
                    )}
                  </div>

                  {/* Expanded Details */}
                  {expandedAlert === alert.id && (
                    <div className="space-y-4 animate-in">
                      {/* Clinical Recommendation */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          Clinical Recommendation
                        </h4>
                        <p className="text-sm text-yellow-800">{alert.recommendation}</p>
                      </div>

                      {/* Alternatives */}
                      {alert.alternatives && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Suggested Alternatives
                          </h4>
                          <p className="text-sm text-green-800">{alert.alternatives}</p>
                        </div>
                      )}

                      {/* Guidelines */}
                      {alert.guidelines && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                            <Info className="w-4 h-4" />
                            Clinical Guidelines
                          </h4>
                          <p className="text-sm text-blue-800">{alert.guidelines}</p>
                        </div>
                      )}

                      {/* Additional Info */}
                      <div className="grid grid-cols-2 gap-4">
                        {alert.prescriber && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-600 mb-1">Prescriber</p>
                            <p className="font-medium text-gray-900">{alert.prescriber}</p>
                          </div>
                        )}
                        {alert.ckdStage && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-600 mb-1">CKD Stage</p>
                            <p className="font-medium text-gray-900">{alert.ckdStage} ({alert.renalFunction})</p>
                          </div>
                        )}
                        {alert.trimester && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-600 mb-1">Pregnancy Status</p>
                            <p className="font-medium text-gray-900">{alert.trimester}</p>
                          </div>
                        )}
                        {alert.lactationRisk && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-600 mb-1">Lactation Risk</p>
                            <p className="font-medium text-gray-900">{alert.lactationRisk}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-4 pt-4 border-t">
                    <button
                      onClick={() => handleResolveAlert(alert.id, 'contacted-prescriber')}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Contact Prescriber
                    </button>
                    <button
                      onClick={() => handleResolveAlert(alert.id, 'alternative-suggested')}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      Suggest Alternative
                    </button>
                    <button
                      onClick={() => handleResolveAlert(alert.id, 'override-documented')}
                      className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                    >
                      Document Override
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Resolved Alerts Section */}
        {resolvedAlerts.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recently Resolved Alerts</h2>
            <div className="space-y-2">
              {resolvedAlerts.slice(0, 5).map(alert => (
                <div key={alert.id} className="bg-white rounded-lg shadow-sm border p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">{alert.title}</p>
                      <p className="text-sm text-gray-600">{alert.patient} - {alert.action.replace('-', ' ')}</p>
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
  );
}