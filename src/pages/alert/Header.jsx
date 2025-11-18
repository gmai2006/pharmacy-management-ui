import { Shield } from 'lucide-react';

const Header = ({filteredAlerts}) => {
    return (
         <div className="bg-gradient-to-r from-red-600 to-red-700 shadow-lg">
        <div className="mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                  <Shield className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Clinical Alert System</h1>
                  <p className="text-red-100 text-sm">Patient Safety & Medication Monitoring</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                <p className="text-sm font-medium">Active Alerts</p>
                <p className="text-3xl font-bold text-center">{filteredAlerts.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
};
export default Header;