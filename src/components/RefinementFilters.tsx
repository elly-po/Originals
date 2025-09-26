import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { refinementFilters, useSearch } from '../contexts/SearchContext';

interface RefinementFiltersProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FilterState {
  brands: string[];
  materials: string[];
  colors: string[];
  priceRanges: string[];
  sizes: string[];
  seasons: string[];
}

function RefinementFilters({ isOpen, onClose }: RefinementFiltersProps) {
  const { activeRefinements, updateRefinement, clearAllRefinements } = useSearch();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['brands', 'priceRanges']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const toggleFilter = (category: keyof FilterState, value: string) => {
    const isCurrentlyActive = activeRefinements[category].includes(value);
    updateRefinement(category, value, !isCurrentlyActive);
  };

  const getActiveFilterCount = () => {
    return Object.values(activeRefinements).flat().length;
  };

  const priceRangeLabels: Record<string, string> = {
    budget: 'Under $100',
    mid: '$100 - $300',
    premium: '$300 - $500',
    luxury: '$500+'
  };

  const filterSections = [
    {
      key: 'brands',
      label: 'Brand',
      options: refinementFilters.brands,
      type: 'checkbox' as const
    },
    {
      key: 'materials',
      label: 'Material',
      options: refinementFilters.materials,
      type: 'checkbox' as const
    },
    {
      key: 'colors',
      label: 'Color',
      options: refinementFilters.colors,
      type: 'checkbox' as const
    },
    {
      key: 'priceRanges',
      label: 'Price Range',
      options: refinementFilters.priceRanges,
      type: 'checkbox' as const,
      customLabels: priceRangeLabels
    },
    {
      key: 'seasons',
      label: 'Season',
      options: refinementFilters.seasons,
      type: 'checkbox' as const
    }
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-charcoal-900/50 z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-oatmeal-100 border-r border-oatmeal-300 z-50 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:h-auto lg:w-full
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="relative h-full">
          {/* Background Texture */}
          <div className="absolute inset-0 bg-texture-paper opacity-20"></div>
          
          <div className="relative h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-oatmeal-300">
              <h2 className="font-serif text-xl text-charcoal-800 text-distressed">
                Refine Results
              </h2>
              <div className="flex items-center gap-3">
                {getActiveFilterCount() > 0 && (
                  <button
                    onClick={clearAllRefinements}
                    className="text-xs font-sans-clean text-charcoal-600 hover:text-oatmeal-800 underline transition-colors"
                  >
                    Clear All ({getActiveFilterCount()})
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 text-charcoal-600 hover:text-charcoal-800 hover:bg-oatmeal-200 rounded-full transition-colors lg:hidden"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            {/* Filters Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {filterSections.map(section => (
                <div key={section.key} className="space-y-3">
                  <button
                    onClick={() => toggleSection(section.key)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h3 className="font-serif text-lg text-charcoal-800 text-distressed">
                      {section.label}
                    </h3>
                    <ChevronDown 
                      size={16}
                      className={`text-charcoal-600 transition-transform ${
                        expandedSections.has(section.key) ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  
                  {expandedSections.has(section.key) && (
                    <div className="space-y-2 pl-2">
                      {section.options.map(option => {
                        if (!option) return null;
                        const isActive = activeRefinements[section.key as keyof FilterState].includes(option);
                        const displayLabel = section.customLabels ? (section.customLabels[option] || option) : option;
                        
                        return (
                          <label 
                            key={option}
                            className="flex items-center gap-3 cursor-pointer group"
                          >
                            <input
                              type="checkbox"
                              checked={isActive}
                              onChange={() => toggleFilter(section.key as keyof FilterState, option)}
                              className="sr-only"
                            />
                            <div className={`
                              w-4 h-4 border-2 flex items-center justify-center transition-all duration-200
                              ${isActive 
                                ? 'border-oatmeal-600 bg-oatmeal-600 shadow-oatmeal' 
                                : 'border-oatmeal-400 bg-oatmeal-50 group-hover:border-oatmeal-500'
                              }
                            `}>
                              {isActive && (
                                <div className="w-2 h-2 bg-oatmeal-100 rounded-sm"></div>
                              )}
                            </div>
                            <span className={`
                              font-sans-clean text-sm transition-colors capitalize
                              ${isActive 
                                ? 'text-oatmeal-800 font-medium' 
                                : 'text-charcoal-700 group-hover:text-oatmeal-800'
                              }
                            `}>
                              {displayLabel}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Apply Button */}
            <div className="p-6 border-t border-oatmeal-300">
              <button
                onClick={onClose}
                className="w-full bg-oatmeal-600 hover:bg-oatmeal-700 text-oatmeal-100 font-serif text-lg font-semibold py-3 px-6 transition-all duration-300 shadow-oatmeal hover:shadow-charcoal transform hover:scale-[1.02]"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RefinementFilters;