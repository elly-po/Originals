import { useSearch } from '../contexts/SearchContext';

const categories = [
  { label: 'All Items', value: 'all' },
  { label: 'Outerwear', value: 'outerwear' },
  { label: 'Denim', value: 'denim' },
  { label: 'Knitwear', value: 'knitwear' },
  { label: 'Footwear', value: 'footwear' },
  { label: 'Accessories', value: 'accessories' },
];

function Navigation() {
  const { activeCategory, setActiveCategory } = useSearch();

  return (
    <nav className="bg-oatmeal-200/30 border-b border-oatmeal-400/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-4">
          <div className="flex flex-wrap items-center justify-center gap-6">
            {categories.map((category) => (
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
      </div>
    </nav>
  );
}

export default Navigation;