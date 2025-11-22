
import React, { useEffect, useState } from 'react';
import { Package, FileText, DollarSign, ShoppingCart } from 'lucide-react';
import init from '../../init';
import Header from './Header';
import PrescriptionProcessTab from './PrescriptionProcessTab';
import POSPage from './POSPage';


export default function PharmacyWorkflow() {
  const [activeTab, setActiveTab] = useState('processing');


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
            onClick={() => setActiveTab('pos')}
            className={`px-6 py-3 font-medium transition-colors relative ${activeTab === 'pos'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            <ShoppingCart size={18} className="inline mr-2" />
            Point of Sale
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'processing' && (
          <PrescriptionProcessTab />
        )}

        {activeTab === 'pos' && (
          <POSPage getWorkflowStepColor={getWorkflowStepColor} />
        )}

        {/* {activeTab === 'inventory' && (
          <InventoryTab getWorkflowStepColor={getWorkflowStepColor} />
        )} */}

        {/* {activeTab === 'claims' && (
          <ClaimTab getWorkflowStepColor={getWorkflowStepColor} />
        )} */}
      </div>
    </div>
  );
}