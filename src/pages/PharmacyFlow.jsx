
import React, { useState } from 'react';
import { CheckCircle, Clock, AlertCircle, Package, FileText, DollarSign, User, Pill, ArrowRight, Filter, Search } from 'lucide-react';

export default function PharmacyWorkflow() {
  const [activeTab, setActiveTab] = useState('processing');
  const [selectedTask, setSelectedTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const [prescriptions, setPrescriptions] = useState([
    { id: 'RX001', patient: 'Sarah Johnson', medication: 'Lisinopril 10mg', status: 'pending_verification', priority: 'high', prescriber: 'Dr. Smith', queue: 'processing', timestamp: '10:45 AM', insurance: 'BlueCross', copay: 15 },
    { id: 'RX002', patient: 'Michael Chen', medication: 'Metformin 500mg', status: 'in_progress', priority: 'normal', prescriber: 'Dr. Lee', queue: 'processing', timestamp: '10:30 AM', insurance: 'Aetna', copay: 10 },
    { id: 'RX003', patient: 'Emily Davis', medication: 'Amoxicillin 500mg', status: 'pending_verification', priority: 'urgent', prescriber: 'Dr. Johnson', queue: 'processing', timestamp: '11:00 AM', insurance: 'UnitedHealth', copay: 5 },
    { id: 'RX004', patient: 'James Wilson', medication: 'Atorvastatin 20mg', status: 'ready', priority: 'normal', prescriber: 'Dr. Brown', queue: 'processing', timestamp: '9:15 AM', insurance: 'Cigna', copay: 20 }
  ]);

  const [inventory, setInventory] = useState([
    { id: 'INV001', medication: 'Lisinopril 10mg', stock: 45, reorderPoint: 50, status: 'low', supplier: 'McKesson', lastOrder: '2 days ago' },
    { id: 'INV002', medication: 'Metformin 500mg', stock: 320, reorderPoint: 100, status: 'adequate', supplier: 'Cardinal Health', lastOrder: '1 week ago' },
    { id: 'INV003', medication: 'Amoxicillin 500mg', stock: 12, reorderPoint: 30, status: 'critical', supplier: 'AmerisourceBergen', lastOrder: '3 days ago' },
    { id: 'INV004', medication: 'Atorvastatin 20mg', stock: 250, reorderPoint: 75, status: 'adequate', supplier: 'McKesson', lastOrder: '5 days ago' }
  ]);

  const [claims, setClaims] = useState([
    { id: 'CLM001', rxId: 'RX001', patient: 'Sarah Johnson', status: 'pending_submission', insurance: 'BlueCross', amount: 85.50, copay: 15, rejected: false },
    { id: 'CLM002', rxId: 'RX002', patient: 'Michael Chen', status: 'submitted', insurance: 'Aetna', amount: 45.00, copay: 10, rejected: false },
    { id: 'CLM003', rxId: 'RX005', patient: 'Robert Taylor', status: 'rejected', insurance: 'Medicare', amount: 120.00, copay: 0, rejected: true, reason: 'Prior authorization required' },
    { id: 'CLM004', rxId: 'RX004', patient: 'James Wilson', status: 'approved', insurance: 'Cigna', amount: 95.00, copay: 20, rejected: false }
  ]);

  const moveToQueue = (id, newStatus) => {
    setPrescriptions(prescriptions.map(rx => 
      rx.id === id ? { ...rx, status: newStatus } : rx
    ));
  };

  const reorderInventory = (id) => {
    setInventory(inventory.map(item =>
      item.id === id ? { ...item, status: 'ordering', lastOrder: 'Just now' } : item
    ));
    setTimeout(() => {
      setInventory(inventory.map(item =>
        item.id === id ? { ...item, status: 'adequate', stock: item.stock + 100 } : item
      ));
    }, 1500);
  };

  const resubmitClaim = (id) => {
    setClaims(claims.map(claim =>
      claim.id === id ? { ...claim, status: 'submitted', rejected: false } : claim
    ));
  };

  const getStatusColor = (status) => {
    const colors = {
      pending_verification: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      in_progress: 'bg-blue-100 text-blue-800 border-blue-300',
      ready: 'bg-green-100 text-green-800 border-green-300',
      low: 'bg-orange-100 text-orange-800 border-orange-300',
      critical: 'bg-red-100 text-red-800 border-red-300',
      adequate: 'bg-green-100 text-green-800 border-green-300',
      ordering: 'bg-purple-100 text-purple-800 border-purple-300',
      pending_submission: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      submitted: 'bg-blue-100 text-blue-800 border-blue-300',
      approved: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getPriorityIcon = (priority) => {
    if (priority === 'urgent') return <AlertCircle className="text-red-500" size={16} />;
    if (priority === 'high') return <Clock className="text-orange-500" size={16} />;
    return <Clock className="text-gray-400" size={16} />;
  };

  const filteredPrescriptions = filterStatus === 'all' 
    ? prescriptions 
    : prescriptions.filter(rx => rx.status === filterStatus);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Pill className="text-blue-600" size={32} />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">PharmacyFlow</h1>
              <p className="text-sm text-gray-500">Prescription Workflow Management</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-500">Active Queue</div>
              <div className="text-lg font-semibold text-gray-900">{prescriptions.length} Tasks</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex gap-1 px-6">
          <button
            onClick={() => setActiveTab('processing')}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === 'processing' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText size={18} className="inline mr-2" />
            Prescription Processing
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === 'inventory' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Package size={18} className="inline mr-2" />
            Inventory Management
          </button>
          <button
            onClick={() => setActiveTab('claims')}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === 'claims' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <DollarSign size={18} className="inline mr-2" />
            Claims Processing
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'processing' && (
          <div>
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <div className="flex items-center gap-4">
                <Filter size={18} className="text-gray-400" />
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All ({prescriptions.length})
                </button>
                <button
                  onClick={() => setFilterStatus('pending_verification')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === 'pending_verification' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Pending Verification
                </button>
                <button
                  onClick={() => setFilterStatus('in_progress')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => setFilterStatus('ready')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === 'ready' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Ready for Pickup
                </button>
              </div>
            </div>

            {/* Queue */}
            <div className="grid gap-4">
              {filteredPrescriptions.map(rx => (
                <div key={rx.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getPriorityIcon(rx.priority)}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">{rx.id}</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(rx.status)}`}>
                              {rx.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">{rx.timestamp}</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Patient</div>
                        <div className="font-medium text-gray-900">{rx.patient}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Medication</div>
                        <div className="font-medium text-gray-900">{rx.medication}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Prescriber</div>
                        <div className="font-medium text-gray-900">{rx.prescriber}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Insurance</div>
                        <div className="text-sm text-gray-700">{rx.insurance}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Copay</div>
                        <div className="text-sm text-gray-700">${rx.copay}</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {rx.status === 'pending_verification' && (
                        <>
                          <button
                            onClick={() => moveToQueue(rx.id, 'in_progress')}
                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            Verify & Process
                          </button>
                          <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                            Contact Prescriber
                          </button>
                        </>
                      )}
                      {rx.status === 'in_progress' && (
                        <>
                          <button
                            onClick={() => moveToQueue(rx.id, 'ready')}
                            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            Mark Ready
                          </button>
                          <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                            Check Inventory
                          </button>
                        </>
                      )}
                      {rx.status === 'ready' && (
                        <button className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors">
                          Complete Pickup
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="grid gap-4">
            {inventory.map(item => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">{item.medication}</div>
                    <div className="text-sm text-gray-500">{item.supplier}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                    {item.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Current Stock</div>
                    <div className="text-2xl font-bold text-gray-900">{item.stock}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Reorder Point</div>
                    <div className="text-lg font-semibold text-gray-700">{item.reorderPoint}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Last Order</div>
                    <div className="text-sm text-gray-700">{item.lastOrder}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Status</div>
                    <div className="text-sm font-medium text-gray-900">
                      {item.stock < item.reorderPoint ? 'Reorder Needed' : 'Sufficient'}
                    </div>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      item.stock < item.reorderPoint * 0.5 ? 'bg-red-500' :
                      item.stock < item.reorderPoint ? 'bg-orange-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min((item.stock / item.reorderPoint) * 100, 100)}%` }}
                  />
                </div>

                {item.stock < item.reorderPoint && (
                  <button
                    onClick={() => reorderInventory(item.id)}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Reorder Stock (100 units)
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'claims' && (
          <div className="grid gap-4">
            {claims.map(claim => (
              <div key={claim.id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{claim.id}</span>
                      <ArrowRight size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600">{claim.rxId}</span>
                    </div>
                    <div className="text-sm text-gray-500">{claim.patient}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(claim.status)}`}>
                    {claim.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Insurance</div>
                    <div className="font-medium text-gray-900">{claim.insurance}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Total Amount</div>
                    <div className="font-medium text-gray-900">${claim.amount.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Patient Copay</div>
                    <div className="font-medium text-gray-900">${claim.copay.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Insurance Pays</div>
                    <div className="font-medium text-green-600">${(claim.amount - claim.copay).toFixed(2)}</div>
                  </div>
                </div>

                {claim.rejected && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2 text-red-800 text-sm">
                      <AlertCircle size={16} />
                      <span className="font-medium">Rejection Reason:</span>
                      <span>{claim.reason}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  {claim.status === 'pending_submission' && (
                    <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                      Submit Claim
                    </button>
                  )}
                  {claim.status === 'rejected' && (
                    <>
                      <button
                        onClick={() => resubmitClaim(claim.id)}
                        className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Resubmit Claim
                      </button>
                      <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                        Contact Insurance
                      </button>
                    </>
                  )}
                  {claim.status === 'approved' && (
                    <button className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
                      Process Payment
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}