import React, { useState } from 'react';
import { TrendingUp, BarChart3, PieChart, FileText, Download, DollarSign, ShoppingCart, Percent, Calendar, ArrowLeft, Filter, Users, Clock, CreditCard, Package, Activity, UserCheck, Pill, AlertCircle } from 'lucide-react';

export default function PharmacyFinancialReports() {
  const [reportDateRange, setReportDateRange] = useState('today');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Sample transaction data
  const [transactionHistory] = useState([
    {
      id: 'TXN1730800000001',
      items: [
        { id: 'RX001', patientName: 'John Smith', medication: 'Lisinopril 10mg', copay: 10.00, prescriber: 'Dr. Williams', category: 'Cardiovascular' },
        { id: 'RX003', patientName: 'Robert Davis', medication: 'Atorvastatin 20mg', copay: 15.00, prescriber: 'Dr. Patel', category: 'Cardiovascular' }
      ],
      subtotal: 25.00,
      discount: 2.50,
      total: '22.50',
      paymentMethod: 'card',
      timestamp: '2025-11-05 09:30:00',
      station: 'station-1'
    },
    {
      id: 'TXN1730800000002',
      items: [
        { id: 'RX004', patientName: 'Sarah Wilson', medication: 'Levothyroxine 50mcg', copay: 5.00, prescriber: 'Dr. Brown', category: 'Endocrine' }
      ],
      subtotal: 5.00,
      discount: 0.00,
      total: '5.00',
      paymentMethod: 'cash',
      timestamp: '2025-11-05 10:15:00',
      station: 'station-2'
    },
    {
      id: 'TXN1730800000003',
      items: [
        { id: 'RX006', patientName: 'Emily Taylor', medication: 'Omeprazole 20mg', copay: 10.00, prescriber: 'Dr. Johnson', category: 'Gastrointestinal' },
        { id: 'RX002', patientName: 'Mary Johnson', medication: 'Metformin 500mg', copay: 5.00, prescriber: 'Dr. Chen', category: 'Endocrine' }
      ],
      subtotal: 15.00,
      discount: 1.50,
      total: '13.50',
      paymentMethod: 'card',
      timestamp: '2025-11-05 11:00:00',
      station: 'station-1'
    },
    {
      id: 'TXN1730800000004',
      items: [
        { id: 'RX005', patientName: 'Michael Brown', medication: 'Amlodipine 5mg', copay: 8.00, prescriber: 'Dr. Smith', category: 'Cardiovascular' }
      ],
      subtotal: 8.00,
      discount: 0.00,
      total: '8.00',
      paymentMethod: 'insurance',
      timestamp: '2025-11-05 11:45:00',
      station: 'station-3'
    },
    {
      id: 'TXN1730800000005',
      items: [
        { id: 'RX007', patientName: 'David Lee', medication: 'Simvastatin 20mg', copay: 12.00, prescriber: 'Dr. Williams', category: 'Cardiovascular' }
      ],
      subtotal: 12.00,
      discount: 1.20,
      total: '10.80',
      paymentMethod: 'card',
      timestamp: '2025-11-05 12:30:00',
      station: 'station-2'
    },
    {
      id: 'TXN1730800000006',
      items: [
        { id: 'RX008', patientName: 'John Smith', medication: 'Aspirin 81mg', copay: 6.00, prescriber: 'Dr. Williams', category: 'Cardiovascular' }
      ],
      subtotal: 6.00,
      discount: 0.00,
      total: '6.00',
      paymentMethod: 'card',
      timestamp: '2025-11-05 13:15:00',
      station: 'station-1'
    },
    {
      id: 'TXN1730800000007',
      items: [
        { id: 'RX009', patientName: 'Lisa Anderson', medication: 'Sertraline 50mg', copay: 11.00, prescriber: 'Dr. Martinez', category: 'Mental Health' }
      ],
      subtotal: 11.00,
      discount: 0.00,
      total: '11.00',
      paymentMethod: 'insurance',
      timestamp: '2025-11-05 14:00:00',
      station: 'station-2'
    }
  ]);

  // Financial Report Calculations
  const calculateReportData = () => {
    let filteredTransactions = transactionHistory;
    const today = new Date();
    
    if (reportDateRange === 'today') {
      filteredTransactions = transactionHistory.filter(txn => {
        const txnDate = new Date(txn.timestamp);
        return txnDate.toDateString() === today.toDateString();
      });
    } else if (reportDateRange === 'week') {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredTransactions = transactionHistory.filter(txn => {
        const txnDate = new Date(txn.timestamp);
        return txnDate >= weekAgo;
      });
    } else if (reportDateRange === 'month') {
      filteredTransactions = transactionHistory.filter(txn => {
        const txnDate = new Date(txn.timestamp);
        return txnDate.getMonth() === today.getMonth() && txnDate.getFullYear() === today.getFullYear();
      });
    }

    const totalRevenue = filteredTransactions.reduce((sum, txn) => sum + parseFloat(txn.total), 0);
    const totalTransactions = filteredTransactions.length;
    const totalPrescriptions = filteredTransactions.reduce((sum, txn) => sum + txn.items.length, 0);
    const totalDiscounts = filteredTransactions.reduce((sum, txn) => sum + parseFloat(txn.discount), 0);
    const avgTransactionValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
    const totalSubtotal = filteredTransactions.reduce((sum, txn) => sum + txn.subtotal, 0);

    const paymentMethodBreakdown = filteredTransactions.reduce((acc, txn) => {
      acc[txn.paymentMethod] = (acc[txn.paymentMethod] || 0) + parseFloat(txn.total);
      return acc;
    }, {});

    const stationBreakdown = filteredTransactions.reduce((acc, txn) => {
      acc[txn.station] = (acc[txn.station] || 0) + parseFloat(txn.total);
      return acc;
    }, {});

    // Top medications
    const medicationBreakdown = {};
    filteredTransactions.forEach(txn => {
      txn.items.forEach(item => {
        if (!medicationBreakdown[item.medication]) {
          medicationBreakdown[item.medication] = { count: 0, revenue: 0 };
        }
        medicationBreakdown[item.medication].count += 1;
        medicationBreakdown[item.medication].revenue += item.copay;
      });
    });

    const topMedications = Object.entries(medicationBreakdown)
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, 5);

    // Patient analytics
    const patientBreakdown = {};
    filteredTransactions.forEach(txn => {
      txn.items.forEach(item => {
        if (!patientBreakdown[item.patientName]) {
          patientBreakdown[item.patientName] = {
            prescriptions: 0,
            revenue: 0,
            visits: 0
          };
        }
        patientBreakdown[item.patientName].prescriptions += 1;
        patientBreakdown[item.patientName].revenue += item.copay;
      });
    });

    // Count unique visits per patient
    filteredTransactions.forEach(txn => {
      const patientsInTransaction = new Set(txn.items.map(item => item.patientName));
      patientsInTransaction.forEach(patient => {
        if (patientBreakdown[patient]) {
          patientBreakdown[patient].visits += 1;
        }
      });
    });

    const totalUniquePatients = Object.keys(patientBreakdown).length;
    const avgPrescriptionsPerPatient = totalUniquePatients > 0 
      ? totalPrescriptions / totalUniquePatients 
      : 0;
    const avgRevenuePerPatient = totalUniquePatients > 0
      ? totalRevenue / totalUniquePatients
      : 0;

    const topPatients = Object.entries(patientBreakdown)
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, 10);

    // Prescriber analytics
    const prescriberBreakdown = {};
    filteredTransactions.forEach(txn => {
      txn.items.forEach(item => {
        if (!prescriberBreakdown[item.prescriber]) {
          prescriberBreakdown[item.prescriber] = {
            prescriptions: 0,
            revenue: 0,
            patients: new Set()
          };
        }
        prescriberBreakdown[item.prescriber].prescriptions += 1;
        prescriberBreakdown[item.prescriber].revenue += item.copay;
        prescriberBreakdown[item.prescriber].patients.add(item.patientName);
      });
    });

    const topPrescribers = Object.entries(prescriberBreakdown)
      .map(([name, data]) => ({
        name,
        prescriptions: data.prescriptions,
        revenue: data.revenue,
        uniquePatients: data.patients.size
      }))
      .sort((a, b) => b.prescriptions - a.prescriptions)
      .slice(0, 5);

    // Category analytics
    const categoryBreakdown = {};
    filteredTransactions.forEach(txn => {
      txn.items.forEach(item => {
        if (!categoryBreakdown[item.category]) {
          categoryBreakdown[item.category] = {
            prescriptions: 0,
            revenue: 0
          };
        }
        categoryBreakdown[item.category].prescriptions += 1;
        categoryBreakdown[item.category].revenue += item.copay;
      });
    });

    const topCategories = Object.entries(categoryBreakdown)
      .sort((a, b) => b[1].prescriptions - a[1].prescriptions)
      .slice(0, 5);

    return {
      totalRevenue,
      totalTransactions,
      totalPrescriptions,
      totalDiscounts,
      totalSubtotal,
      avgTransactionValue,
      paymentMethodBreakdown,
      stationBreakdown,
      topMedications,
      filteredTransactions,
      totalUniquePatients,
      avgPrescriptionsPerPatient,
      avgRevenuePerPatient,
      topPatients,
      topPrescribers,
      topCategories,
      patientBreakdown
    };
  };

  const exportReport = () => {
    const reportData = calculateReportData();
    const csvContent = [
      ['Pharmacy Financial Report', reportDateRange.toUpperCase()],
      ['Generated:', new Date().toLocaleString()],
      [],
      ['SUMMARY'],
      ['Total Revenue', `$${reportData.totalRevenue.toFixed(2)}`],
      ['Total Subtotal', `$${reportData.totalSubtotal.toFixed(2)}`],
      ['Total Discounts', `$${reportData.totalDiscounts.toFixed(2)}`],
      ['Total Transactions', reportData.totalTransactions],
      ['Total Prescriptions', reportData.totalPrescriptions],
      ['Avg Transaction Value', `$${reportData.avgTransactionValue.toFixed(2)}`],
      [],
      ['PAYMENT METHOD BREAKDOWN'],
      ...Object.entries(reportData.paymentMethodBreakdown).map(([method, amount]) => [
        method.toUpperCase(),
        `$${amount.toFixed(2)}`
      ]),
      [],
      ['STATION BREAKDOWN'],
      ...Object.entries(reportData.stationBreakdown).map(([station, amount]) => [
        station.toUpperCase(),
        `$${amount.toFixed(2)}`
      ]),
      [],
      ['TOP MEDICATIONS'],
      ['Medication', 'Count', 'Revenue'],
      ...reportData.topMedications.map(([med, data]) => [
        med,
        data.count,
        `${data.revenue.toFixed(2)}`
      ]),
      [],
      ['TOP PATIENTS'],
      ['Patient Name', 'Prescriptions', 'Visits', 'Revenue'],
      ...reportData.topPatients.map(([patient, data]) => [
        patient,
        data.prescriptions,
        data.visits,
        `${data.revenue.toFixed(2)}`
      ]),
      [],
      ['TOP PRESCRIBERS'],
      ['Prescriber', 'Prescriptions', 'Unique Patients', 'Revenue'],
      ...reportData.topPrescribers.map(prescriber => [
        prescriber.name,
        prescriber.prescriptions,
        prescriber.uniquePatients,
        `${prescriber.revenue.toFixed(2)}`
      ]),
      [],
      ['MEDICATION CATEGORIES'],
      ['Category', 'Prescriptions', 'Revenue'],
      ...reportData.topCategories.map(([category, data]) => [
        category,
        data.prescriptions,
        `${data.revenue.toFixed(2)}`
      ]),
      [],
      ['TRANSACTION DETAILS'],
      ['Transaction ID', 'Timestamp', 'Items', 'Subtotal', 'Discount', 'Total', 'Payment Method', 'Station'],
      ...reportData.filteredTransactions.map(txn => [
        txn.id,
        txn.timestamp,
        txn.items.length,
        `$${txn.subtotal.toFixed(2)}`,
        `$${txn.discount}`,
        `$${txn.total}`,
        txn.paymentMethod,
        txn.station
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pharmacy-report-${reportDateRange}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

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
                  <BarChart3 className="w-8 h-8 text-white" />
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
            <p className="text-xs text-gray-600">{reportData.avgPrescriptionsPerPatient.toFixed(1)} Rx per patient</p>
          </div>

          <div 
            onClick={() => setSelectedMetric('transactions')}
            className={`bg-white rounded-lg shadow-sm border-2 p-6 cursor-pointer transition-all ${
              selectedMetric === 'transactions' ? 'border-blue-500 shadow-md' : 'border-transparent hover:border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-600">Prescriptions</h3>
              <div className="bg-blue-100 p-2 rounded-lg">
                <Pill className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{reportData.totalPrescriptions}</p>
            <p className="text-xs text-gray-600">{reportData.totalTransactions} transactions</p>
          </div>

          <div 
            onClick={() => setSelectedMetric('average')}
            className={`bg-white rounded-lg shadow-sm border-2 p-6 cursor-pointer transition-all ${
              selectedMetric === 'average' ? 'border-purple-500 shadow-md' : 'border-transparent hover:border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-600">Avg Per Patient</h3>
              <div className="bg-purple-100 p-2 rounded-lg">
                <UserCheck className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">${reportData.avgRevenuePerPatient.toFixed(2)}</p>
            <p className="text-xs text-gray-600">Revenue per patient</p>
          </div>

          <div 
            onClick={() => setSelectedMetric('discounts')}
            className={`bg-white rounded-lg shadow-sm border-2 p-6 cursor-pointer transition-all ${
              selectedMetric === 'discounts' ? 'border-orange-500 shadow-md' : 'border-transparent hover:border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-600">Total Discounts</h3>
              <div className="bg-orange-100 p-2 rounded-lg">
                <Percent className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">${reportData.totalDiscounts.toFixed(2)}</p>
            <p className="text-xs text-gray-600">
              {reportData.totalSubtotal > 0 ? ((reportData.totalDiscounts / reportData.totalSubtotal) * 100).toFixed(1) : 0}% of subtotal
            </p>
          </div>
        </div>

        {/* Charts and Breakdowns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Payment Method Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-600" />
              Payment Methods
            </h3>
            <div className="space-y-4">
              {Object.entries(reportData.paymentMethodBreakdown).length > 0 ? (
                Object.entries(reportData.paymentMethodBreakdown).map(([method, amount]) => {
                  const total = reportData.totalRevenue;
                  const percentage = total > 0 ? (amount / total) * 100 : 0;
                  return (
                    <div key={method} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {method === 'card' && <CreditCard className="w-4 h-4 text-blue-600" />}
                          {method === 'cash' && <DollarSign className="w-4 h-4 text-green-600" />}
                          {method === 'insurance' && <FileText className="w-4 h-4 text-purple-600" />}
                          <span className="capitalize font-medium text-gray-700 text-sm">{method}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">${amount.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">{percentage.toFixed(1)}%</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full transition-all ${
                            method === 'card' ? 'bg-blue-600' :
                            method === 'cash' ? 'bg-green-600' :
                            'bg-purple-600'
                          }`}
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

        {/* Top Medications */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Top Medications by Revenue
          </h3>
          <div className="space-y-3">
            {reportData.topMedications.length > 0 ? (
              reportData.topMedications.map(([medication, data], index) => (
                <div key={medication} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 text-blue-700 font-bold w-8 h-8 rounded-full flex items-center justify-center text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{medication}</p>
                      <p className="text-xs text-gray-500">{data.count} prescriptions filled</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">${data.revenue.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">revenue</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No medication data available</p>
            )}
          </div>
        </div>

        {/* Patient & Prescription Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top Patients */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-600" />
              Top Patients by Revenue
            </h3>
            <div className="space-y-2">
              {reportData.topPatients.length > 0 ? (
                reportData.topPatients.map(([patient, data], index) => (
                  <div key={patient} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="bg-teal-100 text-teal-700 font-bold w-7 h-7 rounded-full flex items-center justify-center text-xs">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{patient}</p>
                        <p className="text-xs text-gray-500">
                          {data.prescriptions} Rx • {data.visits} visit{data.visits !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-sm">${data.revenue.toFixed(2)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No patient data available</p>
              )}
            </div>
          </div>

          {/* Medication Categories */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              Top Categories
            </h3>
            <div className="space-y-3">
              {reportData.topCategories.length > 0 ? (
                reportData.topCategories.map(([category, data]) => {
                  const percentage = reportData.totalPrescriptions > 0 
                    ? (data.prescriptions / reportData.totalPrescriptions) * 100 
                    : 0;
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{category}</p>
                          <p className="text-xs text-gray-500">{data.prescriptions} prescriptions</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900 text-sm">${data.revenue.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">{percentage.toFixed(1)}%</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-500 py-8">No category data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Top Prescribers */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-purple-600" />
            Top Prescribers by Volume
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rank</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Prescriber</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Prescriptions</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Unique Patients</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {reportData.topPrescribers.length > 0 ? (
                  reportData.topPrescribers.map((prescriber, index) => (
                    <tr key={prescriber.name} className="border-b hover:bg-purple-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="bg-purple-100 text-purple-700 font-bold w-7 h-7 rounded-full flex items-center justify-center text-xs">
                          {index + 1}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{prescriber.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 text-center">{prescriber.prescriptions}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 text-center">{prescriber.uniquePatients}</td>
                      <td className="py-3 px-4 text-sm font-bold text-gray-900 text-right">${prescriber.revenue.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">No prescriber data available</td>
                  </tr>
                )}
              </tbody>
            </table>
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
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Transaction ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date/Time</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Items</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Payment</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Station</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Subtotal</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Discount</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody>
                {reportData.filteredTransactions.map((txn, index) => (
                  <tr key={txn.id} className={`border-b hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="py-3 px-4 text-sm text-gray-900 font-medium">{txn.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{txn.timestamp}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 text-center">{txn.items.length}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      <span className="capitalize inline-flex items-center gap-1">
                        {txn.paymentMethod === 'card' && <CreditCard className="w-3 h-3" />}
                        {txn.paymentMethod === 'cash' && <DollarSign className="w-3 h-3" />}
                        {txn.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 uppercase text-center">{txn.station}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 text-right">${txn.subtotal.toFixed(2)}</td>
                    <td className="py-3 px-4 text-sm text-green-600 text-right">
                      {txn.discount > 0 ? `-$${txn.discount}` : '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 font-bold text-right">${txn.total}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-300 bg-gray-100 font-bold">
                  <td colSpan="5" className="py-3 px-4 text-sm text-gray-900 text-right">TOTALS:</td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-right">${reportData.totalSubtotal.toFixed(2)}</td>
                  <td className="py-3 px-4 text-sm text-green-600 text-right">-${reportData.totalDiscounts.toFixed(2)}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-right">${reportData.totalRevenue.toFixed(2)}</td>
                </tr>
              </tfoot>
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