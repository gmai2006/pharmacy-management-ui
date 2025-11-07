import React, { useState } from 'react';
import { 
  X
} from 'lucide-react';

export default function InventoryPage() {
  const [inventory, setInventory] = useState([
    { 
      id: 'INV001', 
      product: 'Wireless Mouse', 
      sku: 'WM-2024-BLK',
      stock: 45, 
      reorderPoint: 50, 
      reorderQty: 100,
      status: 'low',
      autoReorder: true,
      price: 29.99,
      wholesalers: [
        { id: 'W1', name: 'TechSupply Co', price: 18.50, leadTime: '3-5 days', preferred: true },
        { id: 'W2', name: 'Gadget Wholesale', price: 19.25, leadTime: '5-7 days', preferred: false },
        { id: 'W3', name: 'Electronics Plus', price: 17.99, leadTime: '7-10 days', preferred: false }
      ]
    },
    { 
      id: 'INV002', 
      product: 'USB-C Cable', 
      sku: 'USB-C-2M',
      stock: 320, 
      reorderPoint: 100, 
      reorderQty: 200,
      status: 'adequate',
      autoReorder: true,
      price: 12.99,
      wholesalers: [
        { id: 'W1', name: 'TechSupply Co', price: 6.50, leadTime: '3-5 days', preferred: true },
        { id: 'W4', name: 'Cable World', price: 5.99, leadTime: '2-3 days', preferred: false }
      ]
    },
    { 
      id: 'INV003', 
      product: 'Laptop Stand', 
      sku: 'LS-ALU-ADJ',
      stock: 12, 
      reorderPoint: 30, 
      reorderQty: 50,
      status: 'critical',
      autoReorder: true,
      price: 49.99,
      wholesalers: [
        { id: 'W2', name: 'Gadget Wholesale', price: 32.00, leadTime: '5-7 days', preferred: true },
        { id: 'W5', name: 'Office Gear Inc', price: 31.50, leadTime: '4-6 days', preferred: false }
      ]
    },
    { 
      id: 'INV004', 
      product: 'Mechanical Keyboard', 
      sku: 'KB-MECH-RGB',
      stock: 8, 
      reorderPoint: 20, 
      reorderQty: 30,
      status: 'critical',
      autoReorder: false,
      price: 89.99,
      wholesalers: [
        { id: 'W1', name: 'TechSupply Co', price: 58.00, leadTime: '3-5 days', preferred: true },
        { id: 'W3', name: 'Electronics Plus', price: 56.50, leadTime: '7-10 days', preferred: false }
      ]
    },
    { 
      id: 'INV005', 
      product: 'Webcam HD 1080p', 
      sku: 'WC-1080-USB',
      stock: 150, 
      reorderPoint: 50, 
      reorderQty: 100,
      status: 'adequate',
      autoReorder: true,
      price: 79.99,
      wholesalers: [
        { id: 'W2', name: 'Gadget Wholesale', price: 48.00, leadTime: '5-7 days', preferred: true },
        { id: 'W1', name: 'TechSupply Co', price: 49.50, leadTime: '3-5 days', preferred: false }
      ]
    }
  ]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [showReorderModal, setShowReorderModal] = useState(false);

  const getStatusColor = (status) => {
    const colors = {
      critical: 'bg-red-100 text-red-700 border-red-300',
      low: 'bg-orange-100 text-orange-700 border-orange-300',
      adequate: 'bg-green-100 text-green-700 border-green-300',
      ordering: 'bg-blue-100 text-blue-700 border-blue-300'
    };
    return colors[status];
  };

  const reorderItem = (itemId, wholesalerId) => {
    setInventory(inventory.map(item => {
      if (item.id === itemId) {
        const wholesaler = item.wholesalers.find(w => w.id === wholesalerId);
        return { ...item, status: 'ordering' };
      }
      return item;
    }));

    setTimeout(() => {
      setInventory(inventory.map(item => {
        if (item.id === itemId) {
          return { ...item, stock: item.stock + item.reorderQty, status: 'adequate' };
        }
        return item;
      }));
    }, 2000);
    
    setShowReorderModal(false);
    setSelectedItem(null);
  };

  const toggleAutoReorder = (itemId) => {
    setInventory(inventory.map(item => 
      item.id === itemId ? { ...item, autoReorder: !item.autoReorder } : item
    ));
  };

  const criticalItems = inventory.filter(item => item.status === 'critical').length;
  const lowItems = inventory.filter(item => item.status === 'low').length;
  const autoReorderEnabled = inventory.filter(item => item.autoReorder).length;

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
        <p className="text-gray-600">Monitor stock levels and manage automated reordering</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-sm text-gray-600 mb-1">Total Products</div>
          <div className="text-2xl font-bold text-gray-900">{inventory.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-sm text-gray-600 mb-1">Critical Stock</div>
          <div className="text-2xl font-bold text-red-600">{criticalItems}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-sm text-gray-600 mb-1">Low Stock</div>
          <div className="text-2xl font-bold text-orange-600">{lowItems}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-sm text-gray-600 mb-1">Auto-Reorder On</div>
          <div className="text-2xl font-bold text-green-600">{autoReorderEnabled}</div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Current Inventory</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reorder Point</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Auto-Reorder</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{item.product}</div>
                    <div className="text-xs text-gray-500">{item.wholesalers.length} wholesalers</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{item.sku}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">{item.stock}</div>
                    <div className="w-24 bg-gray-200 rounded-full h-1.5 mt-1">
                      <div
                        className={`h-1.5 rounded-full ${
                          item.stock < item.reorderPoint * 0.5 ? 'bg-red-500' :
                          item.stock < item.reorderPoint ? 'bg-orange-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min((item.stock / item.reorderPoint) * 100, 100)}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{item.reorderPoint}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleAutoReorder(item.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        item.autoReorder ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          item.autoReorder ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setShowReorderModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Reorder
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reorder Modal */}
      {showReorderModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Reorder: {selectedItem.product}</h3>
              <button onClick={() => setShowReorderModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Current Stock</div>
                    <div className="text-lg font-semibold text-gray-900">{selectedItem.stock}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Reorder Quantity</div>
                    <div className="text-lg font-semibold text-gray-900">{selectedItem.reorderQty}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">New Stock</div>
                    <div className="text-lg font-semibold text-green-600">{selectedItem.stock + selectedItem.reorderQty}</div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Select Wholesaler</h4>
                <div className="space-y-3">
                  {selectedItem.wholesalers.map((wholesaler) => (
                    <div
                      key={wholesaler.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:border-blue-500 ${
                        wholesaler.preferred ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                      onClick={() => reorderItem(selectedItem.id, wholesaler.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold text-gray-900 flex items-center gap-2">
                            {wholesaler.name}
                            {wholesaler.preferred && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">Preferred</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">Lead Time: {wholesaler.leadTime}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">${wholesaler.price}</div>
                          <div className="text-xs text-gray-500">per unit</div>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                        <span className="text-gray-600">Order Total:</span>
                        <span className="font-semibold text-gray-900">${(wholesaler.price * selectedItem.reorderQty).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}