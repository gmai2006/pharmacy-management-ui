import React, { useEffect, useState } from 'react';
import { AlertCircle, Filter, Clock } from 'lucide-react';
import init from '../../init';
import PrescriptionFilter from './PrescriptionFilter';
import Notification from '../../components/Notification';
import BarcodePreviewDialog from '../../components/BarcodePreviewDialog';

const getdataTarget = '/' + init.appName + '/api/' + 'view/prescriptions/100';
const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

const PrescriptionProcessTab = () => {
    const [filterStatus, setFilterStatus] = useState(0);
    const [workflowSteps, setWorkflowSteps] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [notification, setNotification] = useState(undefined);

    // Barcode preview dialog state
    const [barcodeDialog, setBarcodeDialog] = useState({
        isOpen: false,
        prescriptionId: null,
        barcodeType: 'code128' // 'code128' or 'qrcode'
    });

    // Auto-dismiss notification after 3 seconds
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(undefined);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
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


    const moveToNextStep = (id) => {
        const prescription = prescriptions.find(pres => pres.prescriptionId === id);
        showNotification(`Successfully move to ${workflowSteps[prescription.workflowStepId + 1].displayName}`);
        setPrescriptions(prescriptions.map(rx =>
            rx.prescriptionId === id ? { ...rx, workflowStepId: rx.workflowStepId + 1 } : rx
        ).sort((a, b) => a.workflowStepId - b.workflowStepId));
        console.log(prescriptions);
    };

    const getWorkflowStepColor = (wokflowStepId) => {
        const colors = {
            0: 'bg-purple-600 hover:bg-purple-700 text-white',
            1: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            2: 'bg-orange-100 text-blue-800 border-blue-300',
            3: 'bg-amber-100 text-green-800 border-green-300',
            4: 'bg-lime-100  text-orange-800 border-orange-300',
            5: 'bg-teal-100 text-red-800 border-red-300',
            6: 'bg-blue-100 text-blue-800 border-blue-300',
        };
        return colors[wokflowStepId] || 'bg-gray-100 text-gray-800 border-gray-300';
    };


    const getNextWorkflowStepColor = (wokflowStepId) => {
        const colors = {
            1: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            2: 'bg-orange-100 text-blue-800 border-blue-300',
            3: 'bg-amber-100 text-green-800 border-green-300',
            4: 'bg-lime-100  text-orange-800 border-orange-300',
            5: 'bg-teal-100 text-red-800 border-red-300',
            6: 'bg-blue-100 text-blue-800 border-blue-300',
        };
        return colors[wokflowStepId] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    const getPriorityIcon = (priority) => {
        if (priority === 'urgent') return <AlertCircle className="text-red-500" size={16} />;
        if (priority === 'high') return <Clock className="text-orange-500" size={16} />;
        return <Clock className="text-gray-400" size={16} />;
    };


    // Open barcode preview dialog
    const openBarcodeDialog = (userId, barcodeType = 'code128') => {
        setBarcodeDialog({
            isOpen: true,
            prescriptionId: userId,
            barcodeType: barcodeType
        });
    };

    // Close barcode preview dialog
    const closeBarcodeDialog = () => {
        setBarcodeDialog({
            isOpen: false,
            prescriptionId: null,
            barcodeType: 'code128'
        });
    };

    const filteredPrescriptions = filterStatus === 0
        ? prescriptions
        : prescriptions.filter(rx => rx.workflowStepId === filterStatus);


    return (
        <div>
            {/* Notification Toast */}
            {notification && (
                <Notification notification={notification} />
            )}

            {/* Filters */}
            <PrescriptionFilter data={prescriptions} filterList={workflowSteps} filterStatus={filterStatus} setFilterStatus={setFilterStatus} />

            {/* Queue */}
            <div className="grid gap-4">
                {filteredPrescriptions.map(rx => (
                    <div key={rx.prescriptionId} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    {getPriorityIcon(rx.priority)}
                                    <div>
                                        <div className="flex items-center gap-2">

                                            <span className={`px-2 py-1 rounded text-xs font-medium border ${getWorkflowStepColor(rx.workflowStepId)}`}>
                                                {workflowSteps[rx.workflowStepId - 1]?.displayName.replace('_', ' ').toUpperCase()}
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
                                {
                                    rx.workflowStepId < workflowSteps.length && (
                                        <button
                                            onClick={() => moveToNextStep(rx.prescriptionId)}
                                            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${getNextWorkflowStepColor(rx.workflowStepId)}`} >
                                            {workflowSteps[rx.workflowStepId % workflowSteps.length].displayName}
                                        </button>
                                    )
                                }
                                {
                                    rx.workflowStepId === 2 && (
                                        <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                                            Contact Prescriber
                                        </button>
                                    )
                                }
                                {
                                    rx.workflowStepId === 5 && (
                                        <button 
                                            onClick={() => openBarcodeDialog(rx.prescriptionId)}
                                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                                            Print Barcode
                                        </button>
                                    )
                                }
                                {
                                    rx.workflowStepId == workflowSteps.length && (
                                        <button
                                            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Complete Pickup
                                        </button>
                                    )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Barcode Preview Dialog */}
            <BarcodePreviewDialog
                isOpen={barcodeDialog.isOpen}
                prescriptionId={barcodeDialog.prescriptionId}
                barcodeType={barcodeDialog.barcodeType}
                onClose={closeBarcodeDialog}
            />

        </div>
    )
}

export default PrescriptionProcessTab;