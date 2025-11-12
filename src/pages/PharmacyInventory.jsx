import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown, Plus, Search, TrendingUp, X } from 'lucide-react';
import init from '../init';

const getdataTarget = '/' + init.appName + '/api/' + 'inventory/select/100';
const createDataTarget = '/' + init.appName + '/api/' + 'inventoryitems/';
const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

export default function PharmacyInventory() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch(getdataTarget, { headers: headers, });
      const jsonData = await response.json();
      setData(jsonData);
      console.log(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  // Mock inventory data
  // const [inventoryItems] = useState([
  //   {
  //     id: '1',
  //     ndc: '0093-0061-01',
  //     sku: 'MET-500-100',
  //     name: 'Metformin HCl',
  //     strength: '500mg',
  //     form: 'Tablet',
  //     pack_size: 100,
  //     attributes: {
  //       manufacturer: 'Generic Pharma',
  //       dea_class: 'non-controlled',
  //       controlled: false
  //     },
  //     batches: [
  //       {
  //         id: 'b1',
  //         lotNumber: 'LOT-2025-001',
  //         expiryDate: '2026-12-31',
  //         quantityOnHand: 450,
  //         location: 'Shelf A1',
  //         wholesalerId: 1
  //       },
  //       {
  //         id: 'b2',
  //         lotNumber: 'LOT-2025-002',
  //         expiryDate: '2027-06-30',
  //         quantityOnHand: 300,
  //         location: 'Shelf A2',
  //         wholesalerId: 1
  //       }
  //     ]
  //   },
  //   {
  //     id: '2',
  //     ndc: '0093-2194-01',
  //     sku: 'AMO-250-60',
  //     name: 'Amoxicillin',
  //     strength: '250mg',
  //     form: 'Capsule',
  //     pack_size: 60,
  //     attributes: {
  //       manufacturer: 'Antibiotic Labs',
  //       dea_class: 'non-controlled',
  //       controlled: false
  //     },
  //     batches: [
  //       {
  //         id: 'b3',
  //         lotNumber: 'LOT-2025-045',
  //         expiryDate: '2026-03-15',
  //         quantityOnHand: 120,
  //         location: 'Shelf B1',
  //         wholesalerId: 2
  //       }
  //     ]
  //   },
  //   {
  //     id: '3',
  //     ndc: '0228-3904-01',
  //     sku: 'OXY-5-100',
  //     name: 'Oxycodone HCl',
  //     strength: '5mg',
  //     form: 'Tablet',
  //     pack_size: 100,
  //     attributes: {
  //       manufacturer: 'Controlled Pharma',
  //       dea_class: 'Schedule II',
  //       controlled: true
  //     },
  //     batches: [
  //       {
  //         id: 'b4',
  //         lotNumber: 'LOT-2025-089',
  //         expiryDate: '2025-12-15',
  //         quantityOnHand: 50,
  //         location: 'Safe Room C',
  //         wholesalerId: 1
  //       }
  //     ]
  //   }
  // ]);

  // State management
  const [expandedItem, setExpandedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterControlled, setFilterControlled] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditBatchModalOpen, setIsEditBatchModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);

  const [formData, setFormData] = useState({
    ndc: '',
    sku: '',
    name: '',
    strength: '',
    form: 'Tablet',
    pack_size: '',
    manufacturer: '',
    dea_class: 'non-controlled',
    controlled: false
  });

  const [batchFormData, setBatchFormData] = useState({
    lotNumber: '',
    expiryDate: '',
    quantityOnHand: '',
    location: '',
    wholesalerId: ''
  });

  // Filter and search logic
  const filteredItems = useMemo(() => {
    return data.filter(item => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ndc.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesControlled =
        filterControlled === null || item.attributes.controlled === filterControlled;

      return matchesSearch && matchesControlled;
    });
  }, [searchTerm, filterControlled, data]);

  // Helper functions
  const getTotalQuantity = (batches) => {
    return batches && batches.reduce((sum, batch) => sum + batch.quantityOnHand, 0);
  };

  const getExpiryStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) return { status: 'expired', label: 'Expired', color: 'bg-red-50 text-red-700' };
    if (daysUntilExpiry < 30) return { status: 'expiring-soon', label: 'Expiring Soon', color: 'bg-yellow-50 text-yellow-700' };
    return { status: 'ok', label: 'Valid', color: 'bg-green-50 text-green-700' };
  };

  // Form handlers for Add Item
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDEAClassChange = (e) => {
    const dea_class = e.target.value;
    setFormData(prev => ({
      ...prev,
      dea_class,
      controlled: dea_class !== 'non-controlled'
    }));
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    console.log('Adding new item:', formData);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      ndc: '',
      sku: '',
      name: '',
      strength: '',
      form: 'Tablet',
      pack_size: '',
      manufacturer: '',
      dea_class: 'non-controlled',
      controlled: false
    });
    setIsAddModalOpen(false);
  };

  // Form handlers for Edit Batch
  const handleEditBatch = (batch, itemId) => {
    setEditingBatch(batch);
    setEditingItemId(itemId);
    setBatchFormData({
      lotNumber: batch.lotNumber,
      expiryDate: batch.expiryDate,
      quantityOnHand: batch.quantityOnHand.toString(),
      location: batch.location,
      wholesalerId: batch.wholesalerId.toString()
    });
    setIsEditBatchModalOpen(true);
  };

  const handleBatchInputChange = (e) => {
    const { name, value } = e.target;
    setBatchFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateBatch = (e) => {
    e.preventDefault();
    console.log('Updating batch:', {
      itemId: editingItemId,
      batchId: editingBatch.id,
      ...batchFormData
    });
    resetBatchForm();
  };

  const resetBatchForm = () => {
    setBatchFormData({
      lotNumber: '',
      expiryDate: '',
      quantityOnHand: '',
      location: '',
      wholesalerId: ''
    });
    setEditingBatch(null);
    setEditingItemId(null);
    setIsEditBatchModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Pharmacy Inventory</h1>
              <p className="text-gray-600 mt-1">Manage medications, batches, and expiry tracking</p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <Plus size={20} />
              Add Item
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, SKU, or NDC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterControlled(null)}
                className={`px-4 py-2 rounded-lg border transition whitespace-nowrap ${filterControlled === null
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
              >
                All Items
              </button>
              <button
                onClick={() => setFilterControlled(false)}
                className={`px-4 py-2 rounded-lg border transition whitespace-nowrap ${filterControlled === false
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
              >
                Non-Controlled
              </button>
              <button
                onClick={() => setFilterControlled(true)}
                className={`px-4 py-2 rounded-lg border transition whitespace-nowrap ${filterControlled === true
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
              >
                Controlled
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <Search size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No inventory items found matching your criteria.</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {/* Item Summary */}
                <div
                  onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                  className="p-6 cursor-pointer hover:bg-gray-50 transition"
                >
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-4">
                        <ChevronDown
                          size={20}
                          className={`text-gray-400 transition-transform flex-shrink-0 ${expandedItem === item.id ? 'rotate-180' : ''
                            }`}
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                          <div className="flex gap-3 mt-1 text-sm text-gray-600 flex-wrap">
                            <span>{item.strength}</span>
                            <span>•</span>
                            <span>{item.form}</span>
                            <span>•</span>
                            <span>{item.pack_size} count</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 md:gap-8 flex-wrap">
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Total Quantity</div>
                        <div className="text-2xl font-bold text-gray-900">
                          {getTotalQuantity(item.batches)}
                        </div>
                      </div>

                      {item.attributes.controlled && (
                        <div className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium whitespace-nowrap">
                          Controlled
                        </div>
                      )}

                      <div className="text-right">
                        <div className="text-xs text-gray-500 font-mono">{item.sku}</div>
                        <div className="text-xs text-gray-500 font-mono">{item.ndc}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedItem === item.id && (
                  <div className="border-t border-gray-200 bg-gray-50 p-6">
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <TrendingUp size={18} />
                        Product Information
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <div className="text-sm text-gray-600">Manufacturer</div>
                          <div className="font-medium text-gray-900">{item.attributes.manufacturer}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">DEA Class</div>
                          <div className="font-medium text-gray-900">{item.attributes.dea_class}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">SKU</div>
                          <div className="font-mono text-sm text-gray-900">{item.sku}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">NDC</div>
                          <div className="font-mono text-sm text-gray-900">{item.ndc}</div>
                        </div>
                      </div>
                    </div>

                    {/* Batches */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Inventory Batches</h4>
                      <div className="space-y-3">
                        {item.batches.map((batch) => {
                          const expiryStatus = getExpiryStatus(batch.expiryDate);
                          return (
                            <div key={batch.id} className="bg-white rounded-lg border border-gray-200 p-4">
                              <div className="flex items-start justify-between gap-4 flex-wrap">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <span className="font-mono text-sm font-medium text-gray-900">
                                      {batch.lotNumber}
                                    </span>
                                    <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${expiryStatus.color}`}>
                                      {expiryStatus.label}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                    <div>
                                      <div className="text-gray-600">Quantity</div>
                                      <div className="font-semibold text-gray-900">{batch.quantityOnHand}</div>
                                    </div>
                                    <div>
                                      <div className="text-gray-600">Location</div>
                                      <div className="font-medium text-gray-900">{batch.location}</div>
                                    </div>
                                    <div>
                                      <div className="text-gray-600">Expiry Date</div>
                                      <div className="font-medium text-gray-900">
                                        {new Date(batch.expiryDate).toLocaleDateString()}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-gray-600">Wholesaler ID</div>
                                      <div className="font-medium text-gray-900">{batch.wholesalerId}</div>
                                    </div>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleEditBatch(batch, item.id)}
                                  className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm transition whitespace-nowrap font-medium"
                                >
                                  Edit
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <button className="mt-3 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition font-medium">
                        + Add Batch
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Add New Inventory Item</h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  Drug Identification
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Drug Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Metformin HCl"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Strength *
                    </label>
                    <input
                      type="text"
                      name="strength"
                      value={formData.strength}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., 500mg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      NDC (National Drug Code) *
                    </label>
                    <input
                      type="text"
                      name="ndc"
                      value={formData.ndc}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., 0093-0061-01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SKU *
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., MET-500-100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  Package Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Form *
                    </label>
                    <select
                      name="form"
                      value={formData.form}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Tablet">Tablet</option>
                      <option value="Capsule">Capsule</option>
                      <option value="Liquid">Liquid</option>
                      <option value="Injection">Injection</option>
                      <option value="Syrup">Syrup</option>
                      <option value="Powder">Powder</option>
                      <option value="Cream">Cream</option>
                      <option value="Patch">Patch</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pack Size *
                    </label>
                    <input
                      type="number"
                      name="pack_size"
                      value={formData.pack_size}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., 100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  Regulatory & Classification
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Manufacturer *
                    </label>
                    <input
                      type="text"
                      name="manufacturer"
                      value={formData.manufacturer}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Generic Pharma"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      DEA Classification *
                    </label>
                    <select
                      name="dea_class"
                      value={formData.dea_class}
                      onChange={handleDEAClassChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="non-controlled">Non-Controlled</option>
                      <option value="Schedule I">Schedule I</option>
                      <option value="Schedule II">Schedule II</option>
                      <option value="Schedule III">Schedule III</option>
                      <option value="Schedule IV">Schedule IV</option>
                      <option value="Schedule V">Schedule V</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Batch Modal */}
      {isEditBatchModalOpen && editingBatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Edit Inventory Batch</h2>
              <button
                onClick={resetBatchForm}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdateBatch} className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  Batch Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lot Number *
                    </label>
                    <input
                      type="text"
                      name="lotNumber"
                      value={batchFormData.lotNumber}
                      onChange={handleBatchInputChange}
                      required
                      placeholder="e.g., LOT-2025-001"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date *
                    </label>
                    <input
                      type="date"
                      name="expiryDate"
                      value={batchFormData.expiryDate}
                      onChange={handleBatchInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  Inventory Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity On Hand *
                    </label>
                    <input
                      type="number"
                      name="quantityOnHand"
                      value={batchFormData.quantityOnHand}
                      onChange={handleBatchInputChange}
                      required
                      min="0"
                      placeholder="e.g., 450"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Storage Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={batchFormData.location}
                      onChange={handleBatchInputChange}
                      required
                      placeholder="e.g., Shelf A1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  Supplier Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Wholesaler ID *
                    </label>
                    <input
                      type="number"
                      name="wholesalerId"
                      value={batchFormData.wholesalerId}
                      onChange={handleBatchInputChange}
                      required
                      min="1"
                      placeholder="e.g., 1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Current Batch:</span> {editingBatch.lotNumber}
                </p>
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetBatchForm}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                >
                  Update Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}