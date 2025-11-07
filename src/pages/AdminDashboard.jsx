import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, ShoppingCart, Package, BarChart3, Settings, 
  Bell, Search, Menu, X, ChevronRight, TrendingUp, TrendingDown,
  DollarSign, ShoppingBag, UserPlus, Activity
} from 'lucide-react';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'users', icon: Users, label: 'Users' },
    { id: 'orders', icon: ShoppingCart, label: 'Orders' },
    { id: 'products', icon: Package, label: 'Products' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const stats = [
    { label: 'Total Revenue', value: '$45,231', change: '+12.5%', trend: 'up', icon: DollarSign },
    { label: 'Orders', value: '1,234', change: '+8.2%', trend: 'up', icon: ShoppingBag },
    { label: 'New Users', value: '892', change: '-3.1%', trend: 'down', icon: UserPlus },
    { label: 'Active Sessions', value: '573', change: '+15.3%', trend: 'up', icon: Activity },
  ];

  const recentOrders = [
    { id: '#ORD-001', customer: 'John Doe', amount: '$125.00', status: 'completed' },
    { id: '#ORD-002', customer: 'Jane Smith', amount: '$89.50', status: 'processing' },
    { id: '#ORD-003', customer: 'Mike Johnson', amount: '$210.00', status: 'pending' },
    { id: '#ORD-004', customer: 'Sarah Williams', amount: '$156.75', status: 'completed' },
    { id: '#ORD-005', customer: 'Tom Brown', amount: '$99.99', status: 'processing' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-700',
      processing: 'bg-blue-100 text-blue-700',
      pending: 'bg-yellow-100 text-yellow-700',
    };
    return colors[status];
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div 
        className={`bg-gray-900 text-white transition-all duration-300 flex flex-col ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          {sidebarOpen ? (
            <>
              <h1 className="text-xl font-bold">AdminPanel</h1>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="p-1 hover:bg-gray-800 rounded transition-colors"
              >
                <X size={20} />
              </button>
            </>
          ) : (
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-1 hover:bg-gray-800 rounded transition-colors mx-auto"
            >
              <Menu size={20} />
            </button>
          )}
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                activeMenu === item.id 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-gray-800 text-gray-300'
              }`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
              {sidebarOpen && activeMenu === item.id && (
                <ChevronRight size={16} className="ml-auto" />
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        {sidebarOpen && (
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="font-semibold">AD</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">Admin User</div>
                <div className="text-xs text-gray-400">admin@company.com</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">AD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeMenu === 'dashboard' && (
            <>
              {/* Page Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
                <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${
                        stat.trend === 'up' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <stat.icon size={24} className={
                          stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        } />
                      </div>
                      <div className={`flex items-center gap-1 text-sm font-medium ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        {stat.change}
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {order.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {order.customer}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            {order.amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button className="text-blue-600 hover:text-blue-800 font-medium">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeMenu !== 'dashboard' && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-gray-400 mb-4">
                  {menuItems.find(item => item.id === activeMenu)?.icon && 
                    React.createElement(menuItems.find(item => item.id === activeMenu).icon, { size: 64 })}
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  {menuItems.find(item => item.id === activeMenu)?.label}
                </h3>
                <p className="text-gray-600">This section is under construction</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}