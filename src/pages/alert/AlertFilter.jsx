

const AlertFilter = ({ alertCategories, tooltipState, setTooltipState, activeCategory, setActiveCategory }) => {
    return (
        <div className="bg-white border-b shadow-sm">
            <div className="mx-auto px-4 py-3">
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {alertCategories.map(category => (
                        <div key={category.alertRuleId} className="relative">
                            <button
                                key={category.alertRuleId}
                                onMouseEnter={() => setTooltipState({ visible: true, categoryId: category.alertRuleId.toString() })}
                                onMouseLeave={() => setTooltipState({ visible: false, categoryId: undefined })}
                                onClick={() => setActiveCategory(category.alertRuleId)}
                                className={`px-6 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeCategory === category.alertRuleId
                                    ? 'bg-yellow-50 hover:bg-yellow-100 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <div>
                                    <p className="text-xs text-gray-600">{category.ruleName}</p>
                                    <p className="font-bold text-green-900"><span
                                        className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${activeCategory === category.alertRuleId
                                            ? 'bg-white text-yellow-600'
                                            : 'bg-red-100 text-yellow-700'
                                            }`}
                                    >
                                        {category.count}
                                    </span></p>
                                </div>

                                {/* {category.ruleName}
                                {category.count > 0 && (
                                    <span
                                        className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${activeCategory === category.alertRuleId
                                            ? 'bg-white text-yellow-600'
                                            : 'bg-red-100 text-yellow-700'
                                            }`}
                                    >
                                        {category.count}
                                    </span>
                                )} */}
                            </button>
                            {/* Tooltip */}
                            {tooltipState.visible && tooltipState.categoryId === category.alertRuleId && (
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-40 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap pointer-events-none animate-in fade-in duration-200">
                                    {category.ruleName}
                                    {/* <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div> */}
                                </div>

                            )}
                        </div>

                    ))}
                </div>
            </div>
        </div>
    )
};
export default AlertFilter;