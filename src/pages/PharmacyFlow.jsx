
import React, { useEffect, useState } from 'react';
import { CheckCircle, Clock, AlertCircle, Package, FileText, DollarSign, User, Pill, ArrowRight, Filter, Search } from 'lucide-react';
import init from '../init';

export default function PharmacyWorkflow() {
  const [activeTab, setActiveTab] = useState('processing');
  const [selectedTask, setSelectedTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState(0);
  const [workflowSteps, setWorkflowSteps] = useState([]);

  const [prescriptions, setPrescriptions] = useState([]);

  const getdataTarget = '/' + init.appName + '/api/' + 'view/prescriptions/100';
  const createDataTarget = '/' + init.appName + '/api/' + 'inventoryitems/';
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  const fetchData = async () => {
    try {
      const response = await fetch(getdataTarget, { headers: headers, });
      const jsonData = await response.json();
      const filteredData = jsonData.filter(d => d.workflowStepId <= 6);
      setPrescriptions(filteredData);
      console.log(filteredData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchQueues = async () => {
    try {
      const response = await fetch('/' + init.appName + '/api/' + 'workflowsteps/selectAll', { headers: headers, });
      const jsonData = await response.json();
      const filteredWorkflowSteps = jsonData.filter(data => data.workflowId === 1);
      setWorkflowSteps(filteredWorkflowSteps);
      console.log(filteredWorkflowSteps);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchQueues();
    fetchData();
  }, []);

  `
  {
    "copayFixed": 25,
    "createdAt": "2025-11-10T09:08:28.409022Z",
    "description": "Patient requested morning dose",
    "drugDescription": "Lisinopril 10mg tablet",
    "drugForm": "tablet",
    "drugName": "Lisinopril",
    "drugStrength": "10mg",
    "firstName": "James",
    "fullPatientName": "James Anderson",
    "insuranceCompanyName": "BlueCross BlueShield",
    "issueDate": "2025-11-10T09:08:28.409022Z",
    "lastName": "Anderson",
    "patientDob": "1985-03-15",
    "patientGender": "Male",
    "patientMrn": "MRN001",
    "prescriberName": "Dr. James Smith",
    "prescriptionId": "dd0e8400-e29b-41d4-a716-446655440001",
    "priority": "normal",
    "workflowDescr": "filled",
    "workflowDescr": "Prescription Intake",
    "workflowStepId": 1
  },
`

  // const [prescriptions, setPrescriptions] = useState([
  //   { id: 'RX001', patientName: 'Sarah Johnson', drugName: 'Lisinopril 10mg', workflowDescr: 'pending_verification', priority: 'high', prescriberName: 'Dr. Smith', workflowStepId: 'processing', timestamp: '10:45 AM', insuranceCompanyName: 'BlueCross', copayFixed: 15 },
  //   { id: 'RX002', patientName: 'Michael Chen', drugName: 'Metformin 500mg', workflowDescr: 'in_progress', priority: 'normal', prescriberName: 'Dr. Lee', workflowStepId: 'processing', timestamp: '10:30 AM', insuranceCompanyName: 'Aetna', copayFixed: 10 },
  //   { id: 'RX003', patientName: 'Emily Davis', drugName: 'Amoxicillin 500mg', workflowDescr: 'pending_verification', priority: 'urgent', prescriberName: 'Dr. Johnson', workflowStepId: 'processing', timestamp: '11:00 AM', insuranceCompanyName: 'UnitedHealth', copayFixed: 5 },
  //   { id: 'RX004', patientName: 'James Wilson', drugName: 'Atorvastatin 20mg', workflowDescr: 'ready', priority: 'normal', prescriberName: 'Dr. Brown', workflowStepId: 'processing', timestamp: '9:15 AM', insuranceCompanyName: 'Cigna', copayFixed: 20 }
  // ]);

  const [inventory, setInventory] = useState([
    { id: 'INV001', drugName: 'Lisinopril 10mg', stock: 45, reorderPoint: 50, workflowDescr: 'low', supplier: 'McKesson', lastOrder: '2 days ago' },
    { id: 'INV002', drugName: 'Metformin 500mg', stock: 320, reorderPoint: 100, workflowDescr: 'adequate', supplier: 'Cardinal Health', lastOrder: '1 week ago' },
    { id: 'INV003', drugName: 'Amoxicillin 500mg', stock: 12, reorderPoint: 30, workflowDescr: 'critical', supplier: 'AmerisourceBergen', lastOrder: '3 days ago' },
    { id: 'INV004', drugName: 'Atorvastatin 20mg', stock: 250, reorderPoint: 75, workflowDescr: 'adequate', supplier: 'McKesson', lastOrder: '5 days ago' }
  ]);

  const [claims, setClaims] = useState([
    { id: 'CLM001', rxId: 'RX001', patientName: 'Sarah Johnson', workflowDescr: 'pending_submission', insuranceCompanyName: 'BlueCross', amount: 85.50, copayFixed: 15, rejected: false },
    { id: 'CLM002', rxId: 'RX002', patientName: 'Michael Chen', workflowDescr: 'submitted', insuranceCompanyName: 'Aetna', amount: 45.00, copayFixed: 10, rejected: false },
    { id: 'CLM003', rxId: 'RX005', patientName: 'Robert Taylor', workflowDescr: 'rejected', insuranceCompanyName: 'Medicare', amount: 120.00, copayFixed: 0, rejected: true, reason: 'Prior authorization required' },
    { id: 'CLM004', rxId: 'RX004', patientName: 'James Wilson', workflowDescr: 'approved', insuranceCompanyName: 'Cigna', amount: 95.00, copayFixed: 20, rejected: false }
  ]);

  const moveToQueue = (id) => {
    setPrescriptions(prescriptions.map(rx =>
      rx.id === id ? { ...rx, workflowStepId: rx.workflowStepId + 1 } : rx
    ));
  };

  const reorderInventory = (id) => {
    setInventory(inventory.map(item =>
      item.id === id ? { ...item, workflowDescr: 'ordering', lastOrder: 'Just now' } : item
    ));
    setTimeout(() => {
      setInventory(inventory.map(item =>
        item.id === id ? { ...item, workflowDescr: 'adequate', stock: item.stock + 100 } : item
      ));
    }, 1500);
  };

  const resubmitClaim = (id) => {
    setClaims(claims.map(claim =>
      claim.id === id ? { ...claim, workflowDescr: 'submitted', rejected: false } : claim
    ));
  };

  // const getWorkflowStepColor = (workflowDescr) => {
  //   const colors = {
  //     pending_verification: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  //     in_progress: 'bg-blue-100 text-blue-800 border-blue-300',
  //     ready: 'bg-green-100 text-green-800 border-green-300',
  //     low: 'bg-orange-100 text-orange-800 border-orange-300',
  //     critical: 'bg-red-100 text-red-800 border-red-300',
  //     adequate: 'bg-green-100 text-green-800 border-green-300',
  //     ordering: 'bg-purple-100 text-purple-800 border-purple-300',
  //     pending_submission: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  //     submitted: 'bg-blue-100 text-blue-800 border-blue-300',
  //     approved: 'bg-green-100 text-green-800 border-green-300',
  //     rejected: 'bg-red-100 text-red-800 border-red-300'
  //   };
  //   return colors[workflowDescr] || 'bg-gray-100 text-gray-800 border-gray-300';
  // };

  const getWorkflowStepColor = (wokflowStepId) => {
    const colors = {
      0: 'bg-purple-600 hover:bg-purple-700 text-white',
      1: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      2: 'bg-orange-100 text-blue-800 border-blue-300',
      3: 'bg-cyan-100 text-green-800 border-green-300',
      4: 'bg-pink-100  text-orange-800 border-orange-300',
      5: 'bg-indigo-100 text-red-800 border-red-300',
      6: 'bg-blue-100 text-blue-800 border-blue-300',
    };
    return colors[wokflowStepId] || 'bg-gray-100 text-gray-800 border-gray-300';
  };


  const getNextWorkflowStepColor = (wokflowStepId) => {
    const colors = {
      1: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      2: 'bg-orange-100 text-blue-800 border-blue-300',
      3: 'bg-cyan-100 text-green-800 border-green-300',
      4: 'bg-pink-100  text-orange-800 border-orange-300',
      5: 'bg-indigo-100 text-red-800 border-red-300',
      6: 'bg-blue-100 text-blue-800 border-blue-300',
    };
    return colors[wokflowStepId] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getPriorityIcon = (priority) => {
    if (priority === 'urgent') return <AlertCircle className="text-red-500" size={16} />;
    if (priority === 'high') return <Clock className="text-orange-500" size={16} />;
    return <Clock className="text-gray-400" size={16} />;
  };

  const filteredPrescriptions = filterStatus === 0
    ? prescriptions
    : prescriptions.filter(rx => rx.workflowStepId === filterStatus);


  const Header = () => {
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
  }


  const PrescriptionProcessTab = () => {
    return (
    <div>
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex items-center gap-4">
          <Filter size={18} className="text-gray-400" />
          <button
            onClick={() => setFilterStatus(0)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            All ({prescriptions.length})
          </button>
          {
            workflowSteps.map(step => (
              (
                <button
                  onClick={() => setFilterStatus(step.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === step.id ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {step.displayName} ({prescriptions.filter(pre => pre.workflowStepId === step.id).length})
                </button>
              )
            ))
          }

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
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getWorkflowStepColor(rx.workflowStepId)}`}>
                        {rx.workflowDescr.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{rx.timestamp}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Patient</div>
                  <div className="font-medium text-gray-900">{rx.firstName + ' ' + rx.lastName}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">drugName</div>
                  <div className="font-medium text-gray-900">{rx.drugName}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Prescriber</div>
                  <div className="font-medium text-gray-900">{rx.prescriberName}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Insurance</div>
                  <div className="text-sm text-gray-700">{rx.insuranceCompanyName}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Copay</div>
                  <div className="text-sm text-gray-700">${rx.copayFixed}</div>
                </div>
              </div>

              <div className="flex gap-2">
                {/* {rx.workflowDescr === 'pending_verification' && (
                        <>
                          <button
                            onClick={() => moveToQueue(rx.id)}
                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            Verify & Process
                          </button>
                          <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                            Contact Prescriber
                          </button>
                        </>
                      )} */}
                {
                  rx.workflowStepId && workflowSteps && (rx.workflowStepId < workflowSteps.length) && (
                    <button
                      onClick={() => moveToQueue(rx.id)}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${getNextWorkflowStepColor(rx.workflowStepId)}`} >
                      {workflowSteps?.[(rx.workflowStepId) % workflowSteps.length].displayName}
                    </button>
                  )
                }
                {
                  rx.workflowStepId == workflowSteps.length && (
                    <button
                      onClick={() => moveToQueue(rx.id)}
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Complete Pickup
                    </button>
                  )
                }

                {/* {rx.workflowDescr === 'in_progress' && (
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
                      )} */}
                {/* {rx.workflowDescr === 'ready' && (
                        <button className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors">
                          Complete Pickup
                        </button>
                      )} */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    )
  }

  const InventoryTab = () => {
    return (
       <div className="grid gap-4">
            {inventory.map(item => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">{item.drugName}</div>
                    <div className="text-sm text-gray-500">{item.supplier}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getWorkflowStepColor(item.workflowStepId)}`}>
                    {item.workflowDescr.toUpperCase()}
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
                    className={`h-2 rounded-full transition-all ${item.stock < item.reorderPoint * 0.5 ? 'bg-red-500' :
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
    )
  }

  const ClaimTab = () => {
    return (
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
                    <div className="text-sm text-gray-500">{claim.patientName}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getWorkflowStepColor(claim.workflowStepId)}`}>
                    {claim.workflowDescr.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Insurance</div>
                    <div className="font-medium text-gray-900">{claim.insuranceCompanyName}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Total Amount</div>
                    <div className="font-medium text-gray-900">${claim.amount.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Patient Copay</div>
                    <div className="font-medium text-gray-900">${claim.copayFixed.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Insurance Pays</div>
                    <div className="font-medium text-green-600">${(claim.amount - claim.copayFixed).toFixed(2)}</div>
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
                  {claim.workflowDescr === 'pending_submission' && (
                    <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                      Submit Claim
                    </button>
                  )}
                  {claim.workflowDescr === 'rejected' && (
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
                  {claim.workflowDescr === 'approved' && (
                    <button className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
                      Process Payment
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />
      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex gap-1 px-6">
          <button
            onClick={() => setActiveTab('processing')}
            className={`px-6 py-3 font-medium transition-colors relative ${activeTab === 'processing'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            <FileText size={18} className="inline mr-2" />
            Prescription Processing
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-6 py-3 font-medium transition-colors relative ${activeTab === 'inventory'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            <Package size={18} className="inline mr-2" />
            Inventory Management
          </button>
          <button
            onClick={() => setActiveTab('claims')}
            className={`px-6 py-3 font-medium transition-colors relative ${activeTab === 'claims'
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
          <PrescriptionProcessTab />
        )}

        {activeTab === 'inventory' && (
          <InventoryTab />
        )}

        {activeTab === 'claims' && (
          <ClaimTab />
        )}
      </div>
    </div>
  );
}