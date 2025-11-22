import { Filter } from "lucide-react";

const InventoryFilter = ({data, filterList, isFilter, setIsFilter, filterStatus, setFilterStatus}) => {
    const handleOnclick = (status) => {
        setIsFilter(true);
        setFilterStatus(status);
    }

    return (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <div className="flex items-center gap-4">
                    <Filter size={18} className="text-gray-400" />
                    <button
                        onClick={() => setIsFilter(false)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isFilter === false ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        All ({data.length})
                    </button>
                    {
                        filterList.map(step => (
                            (
                                <button key={step.status}
                                    onClick={() => handleOnclick(step.status)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === step.status ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {step.label} ({data.filter(pre => pre.needsReorder === step.status).length})
                                </button>
                            )
                        ))
                    }

                </div>
            </div>
    )
};
export default InventoryFilter;