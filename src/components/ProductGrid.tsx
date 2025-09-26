import { useState } from 'react';
import { Filter } from 'lucide-react';
import ProductCard from './ProductCard';
import RefinementFilters from './RefinementFilters';
import { useSearch } from '../contexts/SearchContext';

function ProductGrid() {
  const { filteredProducts } = useSearch();
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Filters Toggle & Results Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-oatmeal-200 hover:bg-oatmeal-300 text-charcoal-700 font-sans-clean font-medium transition-colors border border-oatmeal-400 hover:border-oatmeal-500"
          >
            <Filter size={16} />
            Refine Results
          </button>
          <p className="font-sans-clean text-sm text-charcoal-600">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} found
          </p>
        </div>
      </div>
      
      {/* Layout with Filters */}
      <div className="flex gap-8">
        {/* Filters Sidebar - Desktop */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div className="sticky top-4">
            <RefinementFilters isOpen={true} onClose={() => {}} />
          </div>
        </div>
        
        {/* Mobile Filters */}
        <RefinementFilters isOpen={showFilters} onClose={() => setShowFilters(false)} />
        
        {/* Products Grid */}
        <div className="flex-1">
          {/* Enhanced Pinterest-style masonry grid */}
          <div className="masonry-grid">
        {filteredProducts.map((product, index) => (
          <div 
            key={product.id} 
            className="masonry-item"
            style={{
              animationDelay: `${index * 100}ms`,
              marginBottom: index % 4 === 0 ? '2rem' : index % 4 === 1 ? '1.5rem' : index % 4 === 2 ? '2.5rem' : '1.25rem'
            }}
          >
            <ProductCard
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              className="animate-fade-in-up"
            />
          </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductGrid;