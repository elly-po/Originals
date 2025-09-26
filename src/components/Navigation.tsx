import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useSearch } from '../contexts/SearchContext';

// Level 1: Core Gender & Age Filters
const primaryCategories = [
  { 
    label: 'Men', 
    value: 'men',
    subcategories: {
      apparel: ['Outerwear', 'Tops', 'Bottoms', 'Underwear & Lounge'],
      footwear: ['Sneakers', 'Boots', 'Casual Shoes', 'Formal Shoes'],
      accessories: ['Bags', 'Headwear', 'Jewelry', 'Small Goods']
    }
  },
  { 
    label: 'Women', 
    value: 'women',
    subcategories: {
      apparel: ['Outerwear', 'Tops', 'Bottoms', 'Dresses & Skirts', 'Underwear & Lounge'],
      footwear: ['Sneakers', 'Boots', 'Casual Shoes', 'Formal Shoes', 'Sandals & Slides'],
      accessories: ['Bags', 'Headwear', 'Jewelry', 'Small Goods']
    }
  },
  { 
    label: 'Kids', 
    value: 'kids',
    subcategories: {
      apparel: ['Outerwear', 'Tops', 'Bottoms', 'Underwear & Lounge'],
      footwear: ['Sneakers', 'Casual Shoes', 'Sandals & Slides'],
      accessories: ['Bags', 'Headwear', 'Small Goods']
    }
  },
  { 
    label: 'Accessories', 
    value: 'accessories',
    subcategories: {
      bags: ['Handbags', 'Backpacks', 'Travel Bags', 'Wallets'],
      jewelry: ['Necklaces', 'Rings', 'Earrings', 'Watches'],
      headwear: ['Hats', 'Caps', 'Beanies', 'Scarves'],
      smallGoods: ['Sunglasses', 'Belts', 'Tech Accessories']
    }
  }
];

const legacyCategories = [
  { label: 'All Items', value: 'all' },
  { label: 'Outerwear', value: 'outerwear' },
  { label: 'Denim', value: 'denim' },
  { label: 'Knitwear', value: 'knitwear' },
  { label: 'Footwear', value: 'footwear' },
  { label: 'Accessories', value: 'accessories' },
];

function Navigation() {
  const { activeCategory, setActiveCategory } = useSearch();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showLegacy, setShowLegacy] = useState(false);

  const handleCategoryClick = (categoryValue: string) => {
    setActiveCategory(categoryValue);
    setActiveDropdown(null);
  };

  // Improved subcategory mapping
  const handleSubcategoryClick = (subcategory: string) => {
    const categoryMap: Record<string, string> = {
      // Apparel mappings
      'Outerwear': 'outerwear',
      'Tops': 'tops', 
      'Bottoms': 'bottoms',
      'Dresses & Skirts': 'dresses-skirts',
      'Underwear & Lounge': 'underwear-lounge',
      // Footwear mappings
      'Sneakers': 'sneakers',
      'Boots': 'boots',
      'Casual Shoes': 'casual-shoes',
      'Formal Shoes': 'formal-shoes',
      'Sandals & Slides': 'sandals-slides',
      // Accessories mappings  
      'Bags': 'bags',
      'Handbags': 'bags', // Map handbags to bags
      'Backpacks': 'bags',
      'Travel Bags': 'bags',
      'Wallets': 'bags',
      'Headwear': 'headwear',
      'Hats': 'headwear',
      'Caps': 'headwear', 
      'Beanies': 'headwear',
      'Scarves': 'headwear',
      'Jewelry': 'jewelry',
      'Necklaces': 'jewelry',
      'Rings': 'jewelry',
      'Earrings': 'jewelry',
      'Watches': 'jewelry',
      'Small Goods': 'small-goods',
      'Sunglasses': 'small-goods',
      'Belts': 'small-goods',
      'Tech Accessories': 'small-goods'
    };
    
    const mappedCategory = categoryMap[subcategory] || subcategory.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-');
    setActiveCategory(mappedCategory);
    setActiveDropdown(null);
  };

  return (
    <nav className="bg-oatmeal-200/30 border-b border-oatmeal-400/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Primary Navigation */}
        <div className="flex items-center justify-between py-4">
          {/* Main Categories */}
          <div className="flex items-center gap-8">
            {primaryCategories.map((category) => (
              <div key={category.value} className="relative">
                <button
                  onClick={() => {
                    if (activeDropdown === category.value) {
                      setActiveDropdown(null);
                    } else {
                      setActiveDropdown(category.value);
                    }
                  }}
                  className={`flex items-center gap-1 text-sm font-serif-classic font-medium transition-colors ${
                    activeCategory === category.value
                      ? 'text-oatmeal-800 border-b-2 border-oatmeal-700'
                      : 'text-charcoal-700 hover:text-oatmeal-800'
                  }`}
                >
                  {category.label}
                  <ChevronDown 
                    size={14} 
                    className={`transition-transform ${
                      activeDropdown === category.value ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                
                {/* Dropdown Menu */}
                {activeDropdown === category.value && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-oatmeal-100 border border-oatmeal-300 shadow-charcoal z-50">
                    <div className="p-4 space-y-4">
                      {/* Quick Category Access */}
                      <button
                        onClick={() => handleCategoryClick(category.value)}
                        className="block w-full text-left font-serif text-sm font-bold text-oatmeal-800 pb-2 border-b border-oatmeal-300"
                      >
                        All {category.label}
                      </button>
                      
                      {/* Subcategories */}
                      {Object.entries(category.subcategories).map(([type, items]) => (
                        <div key={type}>
                          <h4 className="font-sans-clean text-xs uppercase text-charcoal-600 font-semibold mb-2">
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </h4>
                          <ul className="space-y-1">
                            {items.map((item: string) => (
                              <li key={item}>
                                <button
                                  onClick={() => handleSubcategoryClick(item)}
                                  className="text-sm font-sans-clean text-charcoal-700 hover:text-oatmeal-800 transition-colors"
                                >
                                  {item}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Toggle Legacy View */}
          <button
            onClick={() => setShowLegacy(!showLegacy)}
            className="text-xs font-sans-clean text-charcoal-500 hover:text-charcoal-700 transition-colors"
          >
            {showLegacy ? 'New Categories' : 'Legacy View'}
          </button>
        </div>
        
        {/* Legacy Categories (Fallback) */}
        {showLegacy && (
          <div className="border-t border-oatmeal-300 pt-4 pb-4">
            <div className="flex flex-wrap items-center justify-center gap-6">
              {legacyCategories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setActiveCategory(category.value)}
                  className={`text-sm font-serif-classic font-medium transition-colors ${
                    activeCategory === category.value
                      ? 'text-oatmeal-800 border-b-2 border-oatmeal-700'
                      : 'text-charcoal-700 hover:text-oatmeal-800'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Backdrop for dropdown */}
      {activeDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </nav>
  );
}

export default Navigation;