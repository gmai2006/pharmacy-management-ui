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
  TriangleAlert,
  DollarSign
} from 'lucide-react';

import PharmacyWorkflow from '../prescription/PharmacyFlow';
import PharmacyPOSSystem from '../PharmacyPOSSystem';
import PharmacyFinancialReports from '../report/PharmacyFinancialReports';
import PickupDashboard from '../pickup/PickupDashboard';

import UserPage from '../user/UserPage';
import PatientPage from '../patient/PatientPage';
import AlertPage from '../alert/AlertPage';
import PharmacistPage from '../PharmacistPage';

import AuthLogViewer from '../report/AuthLogViewer';
import AdminAuthDashboard from '../report/AdminAuthDashboard';
import DirMarginDashboard from '../report/DIRMarginDashboard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useUser } from "../../context/UserContext";

import '../../index.css';
import '../../App.css';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import InventoryWorkflow from '../inventory/InventoryFlow';
import ClaimFlow from '../claim/ClaimFlow';

export default function Dashboard() {
  const { user, appUser, isAuthenticated, isLoading, stationName, login, logout } = useUser();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [message, setMessage] = useState('');
  const wsRef = useRef(null);

  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'inventory', path: '/inventory', icon: Users, label: 'Inventory' },
    { id: 'claims', path: '/claims', icon: Users, label: 'Claims' },
    { id: 'users', path: '/users', icon: Users, label: 'Users' },
    { id: 'patients', path: '/patients', icon: Users, label: 'Patients' },
    { id: 'pharmacist', path: '/pharmacist', icon: Package, label: 'Pharmacists' },
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
    
      <DashboardSidebar menuItems={menuItems} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Bar */}
        <DashboardHeader  stationName={stationName}/>

        {/* Routes */}
        <div className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<PharmacyWorkflow />} />
            <Route path="/inventory" element={<InventoryWorkflow />} />
            <Route path="/claims" element={<ClaimFlow />} />
            <Route path="/users" element={<UserPage />} />
            <Route path="/patients" element={<PatientPage />} />
            <Route path="/pharmacist" element={<PharmacistPage />} />
            
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
