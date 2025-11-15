import { Pill } from 'lucide-react';


 const Header = () => {
    return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Pill className="text-blue-600" size={32} />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">WSU Pharamcy Management System</h1>
            <p className="text-sm text-gray-500">Prescription Workflow Management</p>
          </div>
        </div>
        {/* <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-gray-500">Active Queue</div>
            <div className="text-lg font-semibold text-gray-900"> {prescriptions.length} Tasks</div>
          </div>
        </div> */}
      </div>
    </div>
    )
  }

  export default Header;