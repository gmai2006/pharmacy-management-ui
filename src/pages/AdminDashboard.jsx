import React, { useEffect, useRef, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation
} from "react-router-dom";

import {
  LayoutDashboard, Users, Package, BarChart3, Settings,
  Bell, Search, Menu, X, ChevronRight,
  TriangleAlert
} from 'lucide-react';

import PharmacyWorkflow from './prescription-flow/PharmacyFlow';
import PharmacyPOSSystem from './PharmacyPOSSystem';
import PharmacyFinancialReports from './report/PharmacyFinancialReports';
import PickupDashboard from './pickup/PickupDashboard';
import PharmacyInventory from './PharmacyInventory';
import UserPage from './user/UserPage';
import PatientPage from './patient/PatientPage';
import AlertPage from './alert/AlertPage';
import PharmacistPage from './PharmacistPage';

import AuthLogViewer from './report/AuthLogViewer';
import AdminAuthDashboard from './report/AdminAuthDashboard';
import DirMarginDashboard from './report/DIRMarginDashboard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useUser } from "../context/UserContext";

import '../index.css';
import '../App.css';

export default function AdminDashboard() {
  const { user, appUser, isAuthenticated, isLoading, stationName, login, logout } = useUser();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [message, setMessage] = useState('');
  const wsRef = useRef(null);

  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'inventory', path: '/inventory', icon: Users, label: 'Inventory' },
    { id: 'users', path: '/users', icon: Users, label: 'Users' },
    { id: 'patients', path: '/patients', icon: Users, label: 'Patients' },
    { id: 'pharmacist', path: '/pharmacist', icon: Package, label: 'Pharmacists' },
    { id: 'pickup', path: '/pickup', icon: TriangleAlert, label: 'Pickup' },
    { id: 'alert', path: '/alert', icon: TriangleAlert, label: 'Alert' },
    { id: 'analytics', path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'logs', path: '/logs', icon: TriangleAlert, label: 'Auth Logs' },
    { id: 'systemlogs', path: '/systemlogs', icon: TriangleAlert, label: 'Auth Dashboard' },
    { id: 'settings', path: '/settings', icon: Settings, label: 'Settings' },
  ];

  if (!appUser) {
    return <LoadingSpinner />
  }

  return (
    <div className="flex h-screen bg-gray-50">
      
      {/* Sidebar */}
      <div className={`bg-gray-900 text-white transition-all duration-300 flex flex-col ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
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

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map(item => (
            <Link
              key={item.id}
              to={item.path}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors hover:bg-gray-800 text-gray-300 
                ${location.pathname === item.path ? 'bg-blue-600 text-white' : ''}`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
              {sidebarOpen && location.pathname === item.path && (
                <ChevronRight size={16} className="ml-auto" />
              )}
            </Link>
          ))}
        </nav>

        {sidebarOpen && (
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="font-semibold">AD</span>
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-400">{appUser?.displayName || 'Invalid User'}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <span className="text-sm text-gray-700">{appUser?.displayName}</span>
              <span className="text-sm text-gray-700">Station {stationName}</span>

              <button
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Routes */}
        <div className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<PharmacyWorkflow />} />
            <Route path="/inventory" element={<PharmacyInventory />} />
            <Route path="/users" element={<UserPage />} />
            <Route path="/patients" element={<PatientPage />} />
            <Route path="/pharmacist" element={<PharmacistPage />} />
            <Route path="/pickup" element={<PharmacyPOSSystem />} />
            <Route path="/alert" element={<AlertPage />} />
            <Route path="/analytics" element={<PharmacyFinancialReports icon={BarChart3} />} />
            <Route path="/logs" element={<AuthLogViewer />} />
            <Route path="/systemlogs" element={<AdminAuthDashboard />} />
            <Route path="/settings" element={<DirMarginDashboard />} />
          </Routes>
        </div>

      </div>
    </div>
  );
}
