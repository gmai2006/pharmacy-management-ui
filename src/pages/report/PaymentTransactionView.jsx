import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  ChevronDown,
  ChevronUp,
  Edit2,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  CreditCard,
  Trash2,
  Download,
  Filter,
  X
} from 'lucide-react';

export default function PaymentTransactionView() {
  const dummyTransactions = [
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      prescription_id: 'rx-001',
      patient_id: 'pat-001',
      station_id: 'STATION-01',
      total_amount: 125.50,
      status: 'completed',
      created_at: 1762927659000,
      metadata: { notes: 'Insurance covered 80%', coupon_applied: true }
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      prescription_id: 'rx-002',
      patient_id: 'pat-002',
      station_id: 'STATION-02',
      total_amount: 250.00,
      status: 'completed',
      created_at: 1762841259000,
      metadata: { notes: 'Full payment out of pocket', coupon_applied: false }
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      prescription_id: 'rx-003',
      patient_id: 'pat-003',
      station_id: 'STATION-03',
      total_amount: 45.99,
      status: 'pending',
      created_at: 1762754859000,
      metadata: { notes: 'Awaiting insurance verification', coupon_applied: false }
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      prescription_id: 'rx-004',
      patient_id: 'pat-004',
      station_id: 'STATION-01',
      total_amount: 89.99,
      status: 'refunded',
      created_at: 1762668459000,
      metadata: { notes: 'Refunded - patient changed mind', coupon_applied: false }
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440004',
      prescription_id: 'rx-005',
      patient_id: 'pat-005',
      station_id: 'STATION-02',
      total_amount: 175.75,
      status: 'completed',
      created_at: 1762582059000,
      metadata: { notes: 'Split payment - 2 transactions', coupon_applied: true }
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440005',
      prescription_id: 'rx-006',
      patient_id: 'pat-006',
      station_id: 'STATION-03',
      total_amount: 320.00,
      status: 'pending',
      created_at: 1762495659000,
      metadata: { notes: 'High-value prescription', coupon_applied: false }
    }
  ];

  const dummyPayments = [
    {
      id: 'pay-001',
      pos_transaction_id: '550e8400-e29b-41d4-a716-446655440000',
      payment_method: 'Credit Card',
      amount: 125.50,
      payment_meta: { card_last_four: '4242', processing_fee: 3.75 }
    },
    {
      id: 'pay-002',
      pos_transaction_id: '550e8400-e29b-41d4-a716-446655440001',
      payment_method: 'Debit Card',
      amount: 250.00,
      payment_meta: { card_last_four: '5555', processing_fee: 5.00 }
    },
    {
      id: 'pay-003',
      pos_transaction_id: '550e8400-e29b-41d4-a716-446655440002',
      payment_method: 'Insurance',
      amount: 45.99,
      payment_meta: { claim_id: 'CLM-2025-001', verification_pending: true }
    },
    {
      id: 'pay-004',
      pos_transaction_id: '550e8400-e29b-41d4-a716-446655440003',
      payment_method: 'Credit Card',
      amount: 89.99,
      payment_meta: { card_last_four: '6666', refund_date: '2025-11-12' }
    },
    {
      id: 'pay-005',
      pos_transaction_id: '550e8400-e29b-41d4-a716-446655440004',
      payment_method: 'Credit Card',
      amount: 175.75,
      payment_meta: { card_last_four: '7777', processing_fee: 5.27 }
    },
    {
      id: 'pay-006',
      pos_transaction_id: '550e8400-e29b-41d4-a716-446655440005',
      payment_method: 'Insurance',
      amount: 320.00,
      payment_meta: { claim_id: 'CLM-2025-002', verification_pending: true }
    }
  ];

  const [transactions, setTransactions] = useState(dummyTransactions);
  const [payments, setPayments] = useState(dummyPayments);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const [expandedTransaction, setExpandedTransaction] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('transactions');

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'refunded':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'refunded':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'Credit Card':
      case 'Debit Card':
        return <CreditCard className="w-4 h-4" />;
      case 'Insurance':
        return <DollarSign className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.prescription_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.patient_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.station_id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || transaction.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const filteredPayments = payments.filter(payment => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.pos_transaction_id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMethod =
      paymentMethodFilter === 'all' || payment.payment_method === paymentMethodFilter;

    return matchesSearch && matchesMethod;
  });

  const transactionStats = {
    total: transactions.length,
    completed: transactions.filter(t => t.status === 'completed').length,
    pending: transactions.filter(t => t.status === 'pending').length,
    refunded: transactions.filter(t => t.status === 'refunded').length,
    totalAmount: transactions.reduce((sum, t) => sum + t.total_amount, 0),
    completedAmount: transactions
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + t.total_amount, 0)
  };

  const paymentStats = {
    total: payments.length,
    creditCard: payments.filter(p => p.payment_method === 'Credit Card').length,
    debitCard: payments.filter(p => p.payment_method === 'Debit Card').length,
    insurance: payments.filter(p => p.payment_method === 'Insurance').length,
    totalAmount: payments.reduce((sum, p) => sum + p.amount, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg text-white transition-all duration-300 ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <AlertTriangle size={20} />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
              <p className="text-gray-600 mt-1">Manage POS transactions and payments</p>
            </div>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium">
              <Plus size={20} />
              New Transaction
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b">
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'transactions'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              POS Transactions
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'payments'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Payments
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'transactions' ? (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm font-medium">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{transactionStats.total}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold text-green-600 mt-2">{transactionStats.completed}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold text-yellow-600 mt-2">{transactionStats.pending}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm font-medium">Refunded</p>
                <p className="text-2xl font-bold text-red-600 mt-2">{transactionStats.refunded}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm font-medium">Total Amount</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">
                  {formatCurrency(transactionStats.totalAmount)}
                </p>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex gap-4 flex-wrap items-center">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search by ID, prescription, patient, or station..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Transaction ID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Prescription
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Station
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map(transaction => (
                    <React.Fragment key={transaction.id}>
                      <tr className="border-b hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                          {transaction.id.slice(0, 8)}...
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {transaction.prescription_id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {transaction.patient_id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {transaction.station_id}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          {formatCurrency(transaction.total_amount)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(transaction.status)}`}>
                            {getStatusIcon(transaction.status)}
                            {transaction.status.charAt(0).toUpperCase() +
                              transaction.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatTimestamp(transaction.created_at)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() =>
                              setExpandedTransaction(
                                expandedTransaction === transaction.id
                                  ? null
                                  : transaction.id
                              )
                            }
                            className="text-blue-600 hover:text-blue-800 transition"
                          >
                            {expandedTransaction === transaction.id ? (
                              <ChevronUp size={18} />
                            ) : (
                              <ChevronDown size={18} />
                            )}
                          </button>
                        </td>
                      </tr>
                      {expandedTransaction === transaction.id && (
                        <tr className="bg-blue-50 border-b">
                          <td colSpan="8" className="px-6 py-4">
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2">
                                  Transaction Details
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-xs text-gray-600">Full ID</p>
                                    <p className="font-mono text-sm text-gray-900">
                                      {transaction.id}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-600">Created At</p>
                                    <p className="text-sm text-gray-900">
                                      {formatTimestamp(transaction.created_at)}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-600">Status</p>
                                    <p className="text-sm text-gray-900 capitalize">
                                      {transaction.status}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-600">Total Amount</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                      {formatCurrency(transaction.total_amount)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              {transaction.metadata && Object.keys(transaction.metadata).length > 0 && (
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-2">
                                    Metadata
                                  </h4>
                                  <pre className="bg-white p-3 rounded border border-gray-300 text-xs overflow-auto max-h-40">
                                    {JSON.stringify(transaction.metadata, null, 2)}
                                  </pre>
                                </div>
                              )}
                              <div className="flex gap-2">
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                                  View Payments
                                </button>
                                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
                                  Export
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            {/* Payments Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm font-medium">Total Payments</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{paymentStats.total}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm font-medium">Credit Cards</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">{paymentStats.creditCard}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm font-medium">Debit Cards</p>
                <p className="text-2xl font-bold text-green-600 mt-2">{paymentStats.debitCard}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm font-medium">Insurance</p>
                <p className="text-2xl font-bold text-purple-600 mt-2">{paymentStats.insurance}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm font-medium">Total Amount</p>
                <p className="text-2xl font-bold text-indigo-600 mt-2">
                  {formatCurrency(paymentStats.totalAmount)}
                </p>
              </div>
            </div>

            {/* Payment Filters */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex gap-4 flex-wrap items-center">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search by payment ID or transaction ID..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <select
                  value={paymentMethodFilter}
                  onChange={e => setPaymentMethodFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Methods</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Insurance">Insurance</option>
                </select>
              </div>
            </div>

            {/* Payments Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Payment ID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Transaction
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map(payment => (
                    <tr key={payment.id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                        {payment.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {payment.pos_transaction_id.slice(0, 8)}...
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">
                          {getPaymentMethodIcon(payment.payment_method)}
                          {payment.payment_method}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {payment.payment_method === 'Credit Card' ||
                        payment.payment_method === 'Debit Card' ? (
                          <span className="text-xs font-mono">
                            •••• {payment.payment_meta.card_last_four}
                          </span>
                        ) : (
                          <span className="text-xs">
                            Claim: {payment.payment_meta.claim_id}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button className="text-blue-600 hover:text-blue-800 transition mr-3">
                          <Eye size={18} />
                        </button>
                        <button className="text-red-600 hover:text-red-800 transition">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}