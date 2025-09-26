import { useState } from 'react';
import { Filter } from 'lucide-react';
import ProductCard from './ProductCard';
import RefinementFilters from './RefinementFilters';
import { useSearch } from '../contexts/SearchContext';

function ProductGrid() {
  const { filteredProducts, clearAllRefinements, setActiveCategory, setSearchQuery } = useSearch();
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
          {filteredProducts.length === 0 ? (
            /* No Results State */
            <div className="text-center py-16">
              <div className="relative">
                {/* Background texture */}
                <div className="absolute inset-0 bg-texture-paper opacity-10"></div>
                
                <div className="relative max-w-md mx-auto">
                  <h3 className="font-serif text-2xl text-charcoal-700 text-distressed mb-4">
                    No Items Found
                  </h3>
                  <p className="font-sans-clean text-charcoal-600 mb-6 leading-relaxed">
                    We couldn't find any products matching your current selection. 
                    Try adjusting your filters or browse our full collection.
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => {
                        clearAllRefinements();
                        setActiveCategory('all');
                        setSearchQuery('');
                      }}
                      className="bg-oatmeal-600 hover:bg-oatmeal-700 text-oatmeal-100 font-serif font-semibold px-6 py-3 transition-all duration-300 shadow-oatmeal hover:shadow-charcoal transform hover:scale-[1.02]"
                    >
                      Clear All Filters
                    </button>
                    <button
                      onClick={() => setActiveCategory('all')}
                      className="border border-oatmeal-600 text-oatmeal-700 hover:bg-oatmeal-50 font-serif font-semibold px-6 py-3 transition-all duration-300"
                    >
                      Browse All Products
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Enhanced Pinterest-style masonry grid */
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
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductGrid;