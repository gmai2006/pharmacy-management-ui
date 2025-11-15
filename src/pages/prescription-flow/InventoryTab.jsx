

import React, { useEffect, useState } from 'react';
import init from "../../init";

const InventoryTab = ({ getWorkflowStepColor }) => {
    const [inventory, setInventory] = useState([]);

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    const fetchData = async () => {
        try {
            const response = await fetch(`/${init.appName}/api/view/inventoryview/100`, { headers: headers, });
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
                            <div className="text-lg font-semibold text-gray-700">{item.maxLevel}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Last Order</div>
                            <div className="text-sm text-gray-700">{new Date(item.lastOrder*1000).toLocaleString()}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Status</div>
                            <div className="text-sm font-medium text-gray-900">
                                {item.needsReorder ? 'Reorder Needed' : 'Sufficient'}
                            </div>
                        </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div
                            className={`h-2 rounded-full transition-all ${item.quantityOnHand < item.needsReorder * 0.5 ? 'bg-red-500' :
                                item.needsReorder ? 'bg-orange-500' : 'bg-green-500'
                                }`}
                            style={{ width: `${Math.min((item.quantityOnHand / item.minLevel) * 100, 100)}%` }}
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