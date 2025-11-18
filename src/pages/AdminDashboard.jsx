import React, { useEffect, useRef, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";


import {
  LayoutDashboard, Users, Package, BarChart3, Settings,
  Bell, Search, Menu, X, ChevronRight,
  Eye,
  TriangleAlert,
} from 'lucide-react';
import PharmacyWorkflow from './prescription-flow/PharmacyFlow';
import PharmacistReview from './PharmacistReviewPage';
import PharmacyPOSSystem from './PharmacyPOSSystem';
import PharmacyFinancialReports from './report/PharmacyFinancialReports';
import PickupDashboard from './pickup/PickupDashboard';

import '../index.css';
import '../App.css';
import PharmacyInventory from './PharmacyInventory';
import UserPage from './user/UserPage';
import PatientPage from './patient/PatientPage';
import AlertPage from './alert/AlertPage';
import TestWebSocket from './TestWebSocket';

import { useUser } from "../context/UserContext";

// Mock Router Components (simulating React Router)
const BrowserRouter = ({ children }) => children;
const Routes = ({ children }) => {
  const [currentPath, setCurrentPath] = useState(window.location.hash.slice(1) || '/');

  React.useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash.slice(1) || '/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const matchedRoute = React.Children.toArray(children).find(child => {
    return child.props.path === currentPath;
  });

  return matchedRoute || null;
};

const WS_URL = "/ws/messages";


const Route = ({ path, element }) => element;

const Link = ({ to, children, className, activeClassName, isActive }) => (
  <a
    href={`#${to}`}
    className={`${className} ${isActive ? activeClassName : ''}`}
    onClick={(e) => {
      e.preventDefault();
      window.location.hash = to;
    }}
  >
    {children}
  </a>
);

const useLocation = () => {
  const [pathname, setPathname] = useState(window.location.hash.slice(1) || '/');

  React.useEffect(() => {
    const handleHashChange = () => {
      setPathname(window.location.hash.slice(1) || '/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return { pathname };
};

function GenericPage({ title, description, icon: Icon }) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="text-gray-400 mb-4">
          <Icon size={64} className="mx-auto" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

import init from "../init";

const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

const getUserByEmail = '/' + init.appName + '/api/' + 'users/byEmail/';

// Main App Component
export default function AdminDashboard({ setUser }) {
  // const { user, isAuthenticated, isLoading, logout } = useAuth0();
  const { user, appUser, isAuthenticated, isLoading, login, logout } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const [message, setMessage] = useState('');
  const wsRef = useRef(null);

  const menuItems = [
    { id: 'dashboard', path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'inventory', path: '/inventory', icon: Users, label: 'Inventory' },
    { id: 'users', path: '/users', icon: Users, label: 'Users' },
    { id: 'patients', path: '/patients', icon: Users, label: 'Patients' },
    // { id: 'review', path: '/review', icon: Eye, label: 'Review' },
    // { id: 'pos', path: '/pos', icon: Package, label: 'POS' },
    { id: 'pickup', path: '/pickup', icon: TriangleAlert, label: 'Pickup' },
    { id: 'alert', path: '/alert', icon: TriangleAlert, label: 'Alert' },
    { id: 'analytics', path: '/analytics', icon: BarChart3, label: 'Analytics' },
    // { id: 'test', path: '/test', icon: TriangleAlert, label: 'Test' },
    { id: 'settings', path: '/settings', icon: Settings, label: 'Settings' },
  ];
  const getUser = async (email) => {
    try {
      const response = await fetch(`${getUserByEmail}${email}`, { headers: headers });
      if (!response.ok) throw new Error('Failed to fetch users');
      const jsonData = await response.json();
      console.log('Users fetched:', jsonData);
      
      return jsonData;
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
     
    }
  };

  if (isLoading || !appUser) {
    return <div className="loading-text">Loading profile...</div>;
  }

  console.log(JSON.stringify(appUser));

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div
          className={`bg-gray-900 text-white transition-all duration-300 flex flex-col ${sidebarOpen ? 'w-64' : 'w-20'
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
                isActive={location.pathname === item.path}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors hover:bg-gray-800 text-gray-300"
                activeClassName="bg-blue-600 text-white"
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
                  {/* <div className="text-sm font-medium">Admin User</div> */}
                  <div className="text-xs text-gray-400">{appUser?.displayName || 'Invalid User'}</div>
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
                    value={message} onChange={(e) => setMessage(e.target.value)}
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
                <span className="text-sm text-gray-700">Welcome, {appUser?.displayName || 'Invalid User'}</span>
                <button
                  onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Content Area with Routes */}
          <div className="flex-1 overflow-y-auto p-6">
            <Routes>
              <Route path="/" element={<PharmacyWorkflow />} />
              <Route path="/inventory" element={<PharmacyInventory />} />
              <Route path="/users" element={<UserPage />} />
              <Route path="/patients" element={<PatientPage />} />
              {/* <Route path="/review" element={<PharmacistReview />} />
              <Route path="/pos" element={<PickupDashboard />} /> */}
              <Route path="/pickup" element={<PharmacyPOSSystem />} />
              <Route path="/alert" element={<AlertPage />} />
              <Route path="/analytics" element={<PharmacyFinancialReports icon={BarChart3} />} />
              {/* <Route path="/test" element={<TestWebSocket />} /> */}
              <Route path="/settings" element={<GenericPage title="Settings" description="Settings panel coming soon" icon={Settings} />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}