import React, { useEffect, useState } from 'react';
import { CheckCircle, Clock, AlertCircle, Package, FileText, DollarSign, User, Pill, ArrowRight, Filter, Search } from 'lucide-react';
import init from '../../init';


const ClaimTab = ({ getWorkflowStepColor }) => {
    const [claims, setClaims] = useState([]);

    //   const [claims, setClaims] = useState([
    //     { claimNumber: 'CLM001', mrn: 'RX001', patientName: 'Sarah Johnson', claimStatus: 'pending_submission', payerName: 'BlueCross', billedAmount: 85.50, patientResponsibility: 15, hasRejection: false },
    //     { claimNumber: 'CLM002', mrn: 'RX002', patientName: 'Michael Chen', claimStatus: 'submitted', payerName: 'Aetna', billedAmount: 45.00, patientResponsibility: 10, hasRejection: false },
    //     { claimNumber: 'CLM003', mrn: 'RX005', patientName: 'Robert Taylor', claimStatus: 'hasRejection', payerName: 'Medicare', billedAmount: 120.00, patientResponsibility: 0, hasRejection: true, rejectionReason: 'Prior authorization required' },
    //     { claimNumber: 'CLM004', mrn: 'RX004', patientName: 'James Wilson', claimStatus: 'approved', payerName: 'Cigna', billedAmount: 95.00, patientResponsibility: 20, hasRejection: false }
    //   ]);

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    const fetchData = async () => {
        try {
            const response = await fetch('/pharmacy/api/view/claimprocessing/100', { headers: headers, });
            const jsonData = await response.json();
            setClaims(jsonData);
            console.log(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const resubmitClaim = (claimNumber) => {
        setClaims(claims.map(claim =>
            claim.claimNumber === claimNumber ? { ...claim, claimStatus: 'submitted', hasRejection: false } : claim
        ));
    };

    return (
        <div className="grid gap-4">
            {claims.map(claim => (
                <div key={claim.claimNumber} className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-gray-900">{claim.claimNumber}</span>
                                <ArrowRight size={16} className="text-gray-400" />
                                <span className="text-sm text-gray-600">{claim.mrn}</span>
                            </div>
                            <div className="text-sm text-gray-500">{claim.patientName}</div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getWorkflowStepColor(claim.workflowStepId)}`}>
                            {claim.claimStatus.replace('_', ' ').toUpperCase()}
                        </span>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-4">
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Insurance</div>
                            <div className="font-medium text-gray-900">{claim.payerName}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Total Amount</div>
                            <div className="font-medium text-gray-900">${claim.billedAmount.toFixed(2)}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Patient Copay</div>
                            <div className="font-medium text-gray-900">${claim.patientResponsibility ? claim.patientResponsibility.toFixed(2) : 0.00}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Insurance Pays</div>
                            <div className="font-medium text-green-600">${(claim.billedAmount - claim.patientResponsibility).toFixed(2)}</div>
                        </div>
                    </div>

                    {claim.hasRejection && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                            <div className="flex items-center gap-2 text-red-800 text-sm">
                                <AlertCircle size={16} />
                                <span className="font-medium">Rejection Reason:</span>
                                <span>{claim.rejectionReason}</span>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-2">
                        {claim.claimStatus === 'PENDING' && (
                            <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                                Submit Claim
                            </button>
                        )}
                        {claim.claimStatus === 'REJECTED' && (
                            <>
                                <button
                                    onClick={() => resubmitClaim(claim.claimNumber)}
                                    className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors"
                                >
                                    Resubmit Claim
                                </button>
                                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                                    Contact Insurance
                                </button>
                            </>
                        )}
                        {claim.claimStatus === 'approved' && (
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
export default ClaimTab;