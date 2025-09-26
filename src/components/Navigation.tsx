import { useState } from 'react';

function Navigation() {
  const [activeFilter, setActiveFilter] = useState('');

  const categories = [
    { label: 'Men', value: 'men' },
    { label: 'Women', value: 'women' },
    { label: 'The Edit', value: 'edit' },
    { label: 'Adults', value: 'adults' },
    { label: 'Kids', value: 'kids' },
    { label: 'Baby', value: 'baby' },
    { label: 'Apparel', value: 'apparel' },
    { label: 'Footwear', value: 'footwear' },
    { label: 'Accessories', value: 'accessories' },
    { label: 'Sale', value: 'sale' },
  ];

  return (
    <nav className="bg-stone-50 border-b border-stone-300/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-4">
          <div className="flex flex-wrap items-center justify-center gap-6">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setActiveFilter(category.value)}
                className={`text-sm font-medium transition-colors ${
                  activeFilter === category.value
                    ? 'text-amber-600'
                    : 'text-stone-700 hover:text-amber-600'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;