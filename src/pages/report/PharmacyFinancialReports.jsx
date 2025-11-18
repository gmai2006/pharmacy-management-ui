import React, { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, PieChart, FileText, Download, DollarSign, Users, Percent, Calendar, Filter, CreditCard, Package, Activity, UserCheck, Pill, AlertCircle, Clock } from 'lucide-react';
import init from "../../init";

const getUrl = `/${init.appName}/api/view/transactionsummary/100`;
const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

export default function PharmacyFinancialReports() {
  const [reportDateRange, setReportDateRange] = useState('today');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(getUrl, { headers: headers });
      const jsonData = await response.json();
      
      // Ensure data is an array
      const transactions = Array.isArray(jsonData) ? jsonData : [jsonData];
      setTransactionHistory(transactions);
      console.log('Transactions loaded:', transactions);
    } catch (error) {
      console.error('Error fetching data:', error);
      setTransactionHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Financial Report Calculations
  const calculateReportData = () => {
    let filteredTransactions = transactionHistory;
    const today = new Date();
    
    if (reportDateRange === 'today') {
      filteredTransactions = transactionHistory.filter(txn => {
        const txnDate = new Date(txn.createdAt * 1000);
        return txnDate.toDateString() === today.toDateString();
      });
    } else if (reportDateRange === 'week') {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredTransactions = transactionHistory.filter(txn => {
        const txnDate = new Date(txn.createdAt * 1000);
        return txnDate >= weekAgo;
      });
    } else if (reportDateRange === 'month') {
      filteredTransactions = transactionHistory.filter(txn => {
        const txnDate = new Date(txn.createdAt * 1000);
        return txnDate.getMonth() === today.getMonth() && txnDate.getFullYear() === today.getFullYear();
      });
    }

    const totalRevenue = filteredTransactions.reduce((sum, txn) => sum + parseFloat(txn.totalAmount || 0), 0);
    const totalPaid = filteredTransactions.reduce((sum, txn) => sum + parseFloat(txn.totalPaid || 0), 0);
    const totalBalanceDue = filteredTransactions.reduce((sum, txn) => sum + parseFloat(txn.balanceDue || 0), 0);
    const totalTransactions = filteredTransactions.length;

    // Payment status breakdown
    const paymentStatusBreakdown = filteredTransactions.reduce((acc, txn) => {
      const status = txn.paymentStatus || 'UNKNOWN';
      acc[status] = (acc[status] || 0) + parseFloat(txn.totalAmount || 0);
      return acc;
    }, {});

    // Payment method breakdown
    const paymentMethodBreakdown = filteredTransactions.reduce((acc, txn) => {
      const methods = txn.paymentMethodsUsed ? txn.paymentMethodsUsed.split(', ') : ['unknown'];
      methods.forEach(method => {
        acc[method] = (acc[method] || 0) + parseFloat(txn.totalAmount || 0);
      });
      return acc;
    }, {});

    // Station breakdown
    const stationBreakdown = filteredTransactions.reduce((acc, txn) => {
      acc[txn.stationId] = (acc[txn.stationId] || 0) + parseFloat(txn.totalAmount || 0);
      return acc;
    }, {});

    // Top patients
    const patientBreakdown = {};
    filteredTransactions.forEach(txn => {
      if (!patientBreakdown[txn.patientFullName]) {
        patientBreakdown[txn.patientFullName] = {
          mrn: txn.patientMrn,
          transactions: 0,
          revenue: 0,
          paid: 0,
          balance: 0,
          status: []
        };
      }
      patientBreakdown[txn.patientFullName].transactions += 1;
      patientBreakdown[txn.patientFullName].revenue += parseFloat(txn.totalAmount || 0);
      patientBreakdown[txn.patientFullName].paid += parseFloat(txn.totalPaid || 0);
      patientBreakdown[txn.patientFullName].balance += parseFloat(txn.balanceDue || 0);
      if (!patientBreakdown[txn.patientFullName].status.includes(txn.status)) {
        patientBreakdown[txn.patientFullName].status.push(txn.status);
      }
    });

    const topPatients = Object.entries(patientBreakdown)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Top prescribers
    const prescriberBreakdown = {};
    filteredTransactions.forEach(txn => {
      if (!prescriberBreakdown[txn.prescriberName]) {
        prescriberBreakdown[txn.prescriberName] = {
          transactions: 0,
          revenue: 0,
          patients: new Set(),
          drugs: new Set()
        };
      }
      prescriberBreakdown[txn.prescriberName].transactions += 1;
      prescriberBreakdown[txn.prescriberName].revenue += parseFloat(txn.totalAmount || 0);
      prescriberBreakdown[txn.prescriberName].patients.add(txn.patientFullName);
      prescriberBreakdown[txn.prescriberName].drugs.add(txn.drugName);
    });

    const topPrescribers = Object.entries(prescriberBreakdown)
      .map(([name, data]) => ({
        name,
        transactions: data.transactions,
        revenue: data.revenue,
        uniquePatients: data.patients.size,
        uniqueDrugs: data.drugs.size
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Top drugs
    const drugBreakdown = {};
    filteredTransactions.forEach(txn => {
      if (!drugBreakdown[txn.drugName]) {
        drugBreakdown[txn.drugName] = {
          count: 0,
          revenue: 0,
          paid: 0
        };
      }
      drugBreakdown[txn.drugName].count += 1;
      drugBreakdown[txn.drugName].revenue += parseFloat(txn.totalAmount || 0);
      drugBreakdown[txn.drugName].paid += parseFloat(txn.totalPaid || 0);
    });

    const topDrugs = Object.entries(drugBreakdown)
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, 5);

    const totalUniquePatients = Object.keys(patientBreakdown).length;
    const avgRevenuePerPatient = totalUniquePatients > 0 ? totalRevenue / totalUniquePatients : 0;
    const avgTransactionValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

    return {
      totalRevenue,
      totalPaid,
      totalBalanceDue,
      totalTransactions,
      totalUniquePatients,
      avgRevenuePerPatient,
      avgTransactionValue,
      paymentStatusBreakdown,
      paymentMethodBreakdown,
      stationBreakdown,
      topPatients,
      topPrescribers,
      topDrugs,
      filteredTransactions
    };
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportReport = () => {
    const reportData = calculateReportData();
    const csvContent = [
      ['Pharmacy Financial Report', reportDateRange.toUpperCase()],
      ['Generated:', new Date().toLocaleString()],
      [],
      ['SUMMARY'],
      ['Total Revenue', `$${reportData.totalRevenue.toFixed(2)}`],
      ['Total Paid', `$${reportData.totalPaid.toFixed(2)}`],
      ['Balance Due', `$${reportData.totalBalanceDue.toFixed(2)}`],
      ['Total Transactions', reportData.totalTransactions],
      ['Unique Patients', reportData.totalUniquePatients],
      ['Avg Transaction Value', `$${reportData.avgTransactionValue.toFixed(2)}`],
      ['Avg Revenue Per Patient', `$${reportData.avgRevenuePerPatient.toFixed(2)}`],
      [],
      ['PAYMENT STATUS BREAKDOWN'],
      ...Object.entries(reportData.paymentStatusBreakdown).map(([status, amount]) => [
        status,
        `$${amount.toFixed(2)}`
      ]),
      [],
      ['PAYMENT METHOD BREAKDOWN'],
      ...Object.entries(reportData.paymentMethodBreakdown).map(([method, amount]) => [
        method.toUpperCase(),
        `$${amount.toFixed(2)}`
      ]),
      [],
      ['TOP MEDICATIONS'],
      ['Drug', 'Count', 'Revenue', 'Paid'],
      ...reportData.topDrugs.map(([drug, data]) => [
        drug,
        data.count,
        `$${data.revenue.toFixed(2)}`,
        `$${data.paid.toFixed(2)}`
      ]),
      [],
      ['TOP PATIENTS'],
      ['Patient Name', 'MRN', 'Transactions', 'Revenue', 'Paid', 'Balance'],
      ...reportData.topPatients.map(patient => [
        patient.name,
        patient.mrn,
        patient.transactions,
        `$${patient.revenue.toFixed(2)}`,
        `$${patient.paid.toFixed(2)}`,
        `$${patient.balance.toFixed(2)}`
      ]),
      [],
      ['TOP PRESCRIBERS'],
      ['Prescriber', 'Transactions', 'Revenue', 'Unique Patients', 'Unique Drugs'],
      ...reportData.topPrescribers.map(prescriber => [
        prescriber.name,
        prescriber.transactions,
        `$${prescriber.revenue.toFixed(2)}`,
        prescriber.uniquePatients,
        prescriber.uniqueDrugs
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pharmacy-report-${reportDateRange}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 mx-auto mb-3 text-blue-600 animate-spin" />
          <p className="text-gray-600 font-medium">Loading financial data...</p>
        </div>
      </div>
    );
  }

  const reportData = calculateReportData();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                  <BarChart3 className="w-8 h-8 " />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Financial Reports</h1>
                  <p className="text-blue-100 text-sm">Revenue and transaction analytics</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={reportDateRange}
                onChange={(e) => setReportDateRange(e.target.value)}
                className="px-4 py-2 bg-white border-0 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-300 shadow-sm"
              >
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">This Month</option>
                <option value="all">All Time</option>
              </select>
              <button
                onClick={exportReport}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium flex items-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div 
            onClick={() => setSelectedMetric('revenue')}
            className={`bg-white rounded-lg shadow-sm border-2 p-6 cursor-pointer transition-all ${
              selectedMetric === 'revenue' ? 'border-green-500 shadow-md' : 'border-transparent hover:border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
              <div className="bg-green-100 p-2 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">${reportData.totalRevenue.toFixed(2)}</p>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {reportData.totalTransactions} transactions
            </p>
          </div>

          <div 
            onClick={() => setSelectedMetric('patients')}
            className={`bg-white rounded-lg shadow-sm border-2 p-6 cursor-pointer transition-all ${
              selectedMetric === 'patients' ? 'border-teal-500 shadow-md' : 'border-transparent hover:border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-600">Unique Patients</h3>
              <div className="bg-teal-100 p-2 rounded-lg">
                <Users className="w-5 h-5 text-teal-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{reportData.totalUniquePatients}</p>
            <p className="text-xs text-gray-600">${reportData.avgRevenuePerPatient.toFixed(2)} avg per patient</p>
          </div>

          <div 
            onClick={() => setSelectedMetric('paid')}
            className={`bg-white rounded-lg shadow-sm border-2 p-6 cursor-pointer transition-all ${
              selectedMetric === 'paid' ? 'border-blue-500 shadow-md' : 'border-transparent hover:border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-600">Total Paid</h3>
              <div className="bg-blue-100 p-2 rounded-lg">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">${reportData.totalPaid.toFixed(2)}</p>
            <p className="text-xs text-gray-600">
              {reportData.totalRevenue > 0 ? ((reportData.totalPaid / reportData.totalRevenue) * 100).toFixed(1) : 0}% collected
            </p>
          </div>

          <div 
            onClick={() => setSelectedMetric('balance')}
            className={`bg-white rounded-lg shadow-sm border-2 p-6 cursor-pointer transition-all ${
              selectedMetric === 'balance' ? 'border-orange-500 shadow-md' : 'border-transparent hover:border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-600">Balance Due</h3>
              <div className="bg-orange-100 p-2 rounded-lg">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">${reportData.totalBalanceDue.toFixed(2)}</p>
            <p className="text-xs text-orange-600">Outstanding payments</p>
          </div>

          <div 
            onClick={() => setSelectedMetric('avg')}
            className={`bg-white rounded-lg shadow-sm border-2 p-6 cursor-pointer transition-all ${
              selectedMetric === 'avg' ? 'border-purple-500 shadow-md' : 'border-transparent hover:border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-600">Avg Transaction</h3>
              <div className="bg-purple-100 p-2 rounded-lg">
                <Pill className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">${reportData.avgTransactionValue.toFixed(2)}</p>
            <p className="text-xs text-gray-600">Average value per transaction</p>
          </div>
        </div>

        {/* Charts and Breakdowns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Payment Status Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-600" />
              Payment Status
            </h3>
            <div className="space-y-4">
              {Object.entries(reportData.paymentStatusBreakdown).length > 0 ? (
                Object.entries(reportData.paymentStatusBreakdown).map(([status, amount]) => {
                  const total = reportData.totalRevenue;
                  const percentage = total > 0 ? (amount / total) * 100 : 0;
                  return (
                    <div key={status} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="capitalize font-medium text-gray-700 text-sm">{status}</span>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">${amount.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">{percentage.toFixed(1)}%</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="h-2.5 rounded-full transition-all bg-blue-600"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-500 py-8">No payment data available</p>
              )}
            </div>
          </div>

          {/* Station Performance */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-600" />
              Station Performance
            </h3>
            <div className="space-y-4">
              {Object.entries(reportData.stationBreakdown).length > 0 ? (
                Object.entries(reportData.stationBreakdown).map(([station, amount]) => {
                  const total = reportData.totalRevenue;
                  const percentage = total > 0 ? (amount / total) * 100 : 0;
                  return (
                    <div key={station} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="uppercase font-medium text-gray-700 text-sm">{station}</span>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">${amount.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">{percentage.toFixed(1)}%</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-indigo-600 h-2.5 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-500 py-8">No station data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Top Drugs */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Top Medications by Revenue
          </h3>
          <div className="space-y-3">
            {reportData.topDrugs.length > 0 ? (
              reportData.topDrugs.map(([drug, data], index) => (
                <div key={drug} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 text-blue-700 font-bold w-8 h-8 rounded-full flex items-center justify-center text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{drug}</p>
                      <p className="text-xs text-gray-500">{data.count} transactions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">${data.revenue.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">Paid: ${data.paid.toFixed(2)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No medication data available</p>
            )}
          </div>
        </div>

        {/* Patient & Prescriber Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top Patients */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-600" />
              Top Patients by Revenue
            </h3>
            <div className="space-y-2">
              {reportData.topPatients.length > 0 ? (
                reportData.topPatients.map((patient, index) => (
                  <div key={patient.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="bg-teal-100 text-teal-700 font-bold w-7 h-7 rounded-full flex items-center justify-center text-xs">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{patient.name}</p>
                        <p className="text-xs text-gray-500">
                          MRN: {patient.mrn} • {patient.transactions} transaction{patient.transactions !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-sm">${patient.revenue.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">Paid: ${patient.paid.toFixed(2)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No patient data available</p>
              )}
            </div>
          </div>

          {/* Top Prescribers */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-purple-600" />
              Top Prescribers
            </h3>
            <div className="space-y-2">
              {reportData.topPrescribers.length > 0 ? (
                reportData.topPrescribers.map((prescriber, index) => (
                  <div key={prescriber.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="bg-purple-100 text-purple-700 font-bold w-7 h-7 rounded-full flex items-center justify-center text-xs">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{prescriber.name}</p>
                        <p className="text-xs text-gray-500">
                          {prescriber.transactions} Rx • {prescriber.uniquePatients} patients
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-sm">${prescriber.revenue.toFixed(2)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No prescriber data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Transaction Details Table */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-700" />
            Transaction Details
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Patient Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Prescriber</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Medication</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Station</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Paid</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Balance</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {reportData.filteredTransactions.map((txn, index) => (
                  <tr key={txn.transactionId} className={`border-b hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="py-3 px-4 text-sm text-gray-900 font-medium">{txn.patientFullName}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{txn.prescriberName}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{txn.drugName}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        txn.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                        txn.paymentStatus === 'PARTIAL' ? 'bg-yellow-100 text-yellow-800' :
                        txn.paymentStatus === 'REFUNDED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {txn.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 uppercase text-center">{txn.stationId}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 text-right">${txn.totalAmount.toFixed(2)}</td>
                    <td className="py-3 px-4 text-sm text-green-600 text-right font-medium">${txn.totalPaid.toFixed(2)}</td>
                    <td className="py-3 px-4 text-sm text-orange-600 text-right font-medium">${txn.balanceDue.toFixed(2)}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 text-center">{formatTimestamp(txn.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {reportData.filteredTransactions.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <BarChart3 className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">No transactions found</p>
                <p className="text-sm mt-1">Complete some transactions in the POS system to see data here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}