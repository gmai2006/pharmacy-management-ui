

import React, { useEffect, useState } from 'react';
import { CheckCircle, Clock, AlertCircle, Package, FileText, DollarSign, User, Pill, ArrowRight, Filter, Search } from 'lucide-react';
import init from '../../init';


`
{
    "itemId": "990e8400-e29b-41d4-a716-446655440003",
    "batchId": "550e8400-e29b-41d4-a716-446655440003",
    "ndc": "0006-0057-03",
    "sku": "SKU-AMOXICILLIN-500",
    "name": "Amoxicillin",
    "strength": "500mg",
    "form": "capsule",
    "packSize": 30,
    "attributes": {
      "dea_class": null,
      "controlled": false,
      "requires_rx": true,
      "manufacturer": "GlaxoSmithKline"
    },
    "lotNumber": "LOT-2024-003",
    "expiryDate": [2026, 2, 28],
    "quantityOnHand": 120,
    "location": "Shelf C3",
    "wholesalerId": 1,
    "daysSinceLastOrder": 1763012357.08333,
    "minLevel": 40,
    "maxLevel": 150,
    "preferredWholesalers": [1, 3, 2],
    "daysUntilExpiry": 108,
    "expiryStatus": "OK",
    "needsReorder": false,
    "reorderQuantity": 30,
    "daysSinceLastOrder": 0,
    "orderFrequencyStatus": "RECENTLY_ORDERED",
    "itemCreatedAt": 1705057200,
    "batchCreatedAt": 1763012357.08333,
    "criticalReorder": false,
    "recentlyOrdered": true,
    "stockPercentage": 80,
    "expiringCritical": false
  },

    `

const InventoryTab = ({ getWorkflowStepColor }) => {
    const [inventory, setInventory] = useState([]);

    // const [inventory, setInventory] = useState([
    //     { batchId: 'INV001', name: 'Lisinopril 10mg', quantityOnHand: 45, needsReorder: 50, orderFrequencyStatus: 'low', manufacturer: 'McKesson', daysSinceLastOrder: '2 days ago' },
    //     { batchId: 'INV002', name: 'Metformin 500mg', quantityOnHand: 320, needsReorder: 100, orderFrequencyStatus: 'adequate', manufacturer: 'Cardinal Health', daysSinceLastOrder: '1 week ago' },
    //     { batchId: 'INV003', name: 'Amoxicillin 500mg', quantityOnHand: 12, needsReorder: 30, orderFrequencyStatus: 'critical', manufacturer: 'AmerisourceBergen', daysSinceLastOrder: '3 days ago' },
    //     { batchId: 'INV004', name: 'Atorvastatin 20mg', quantityOnHand: 250, needsReorder: 75, orderFrequencyStatus: 'adequate', manufacturer: 'McKesson', daysSinceLastOrder: '5 days ago' }
    // ]);

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    const fetchData = async () => {
        try {
            const response = await fetch('/pharmacy/api/view/inventoryview/100', { headers: headers, });
            const jsonData = await response.json();
            setInventory(jsonData);
            console.log(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const reorderInventory = (batchId) => {
        setInventory(inventory.map(item =>
            item.batchId === batchId ? { ...item, orderFrequencyStatus: 'ordering', daysSinceLastOrder: 'Just now' } : item
        ));
        setTimeout(() => {
            setInventory(inventory.map(item =>
                item.batchId === batchId ? { ...item, orderFrequencyStatus: 'adequate', quantityOnHand: item.quantityOnHand + 100 } : item
            ));
        }, 1500);
    };


    return (
        <div className="grid gap-4">
            {inventory.map(item => (
                <div key={crypto.randomUUID()} className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="font-semibold text-gray-900 mb-1">{item.name} {item.strength}</div>
                            <div className="text-sm text-gray-500">{item.attributes.manufacturer}</div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getWorkflowStepColor(item.workflowStepId)}`}>
                            {item.orderFrequencyStatus.toUpperCase()}
                        </span>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-4">
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Lot #</div>
                            <div className="text-2xl font-bold text-gray-900">{item.lotNumber}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Current Stock</div>
                            <div className="text-2xl font-bold text-gray-900">{item.quantityOnHand}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Reorder Point</div>
                            <div className="text-lg font-semibold text-gray-700">{item.needsReorder}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Last Order</div>
                            <div className="text-sm text-gray-700">{item.daysSinceLastOrder}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Status</div>
                            <div className="text-sm font-medium text-gray-900">
                                {item.quantityOnHand < item.needsReorder ? 'Reorder Needed' : 'Sufficient'}
                            </div>
                        </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div
                            className={`h-2 rounded-full transition-all ${item.quantityOnHand < item.needsReorder * 0.5 ? 'bg-red-500' :
                                item.quantityOnHand < item.needsReorder ? 'bg-orange-500' : 'bg-green-500'
                                }`}
                            style={{ width: `${Math.min((item.quantityOnHand / item.needsReorder) * 100, 100)}%` }}
                        />
                    </div>

                    {item.quantityOnHand < item.needsReorder && (
                        <button
                            onClick={() => reorderInventory(item.batchId)}
                            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            Reorder Stock (100 units)
                        </button>
                    )}
                </div>
            ))}
        </div>
    )
}
export default InventoryTab;