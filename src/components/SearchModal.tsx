import { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { useSearch } from '../contexts/SearchContext';
import ProductCard from './ProductCard';

function SearchModal() {
  const { 
    searchQuery, 
    performSearch, 
    filteredProducts, 
    isSearchOpen, 
    setIsSearchOpen 
  } = useSearch();
  
  const [localQuery, setLocalQuery] = useState(searchQuery);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(localQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localQuery, performSearch]);

  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-charcoal-900/80 backdrop-blur-sm">
      <div className="flex min-h-full items-start justify-center p-4 pt-16">
        <div className="w-full max-w-4xl bg-oatmeal-50 shadow-charcoal border border-oatmeal-300 max-h-[80vh] overflow-hidden">
          {/* Search Header */}
          <div className="border-b border-oatmeal-300 p-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal-400" size={20} />
                <input
                  type="text"
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  placeholder="Search for authentic originals..."
                  className="w-full pl-10 pr-4 py-3 border-2 border-oatmeal-400 focus:border-oatmeal-600 focus:outline-none bg-oatmeal-100 text-charcoal-800 font-sans-clean"
                  autoFocus
                />
              </div>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-charcoal-600 hover:text-charcoal-800 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Search Results */}
          <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
            {localQuery.length === 0 ? (
              <div className="text-center py-12">
                <Search size={48} className="mx-auto text-charcoal-400 mb-4" />
                <h3 className="text-lg font-serif-display font-semibold text-charcoal-800 mb-2">
                  Search Our Collection
                </h3>
                <p className="text-charcoal-600 font-sans-clean">
                  Discover authentic pieces with genuine heritage
                </p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-charcoal-600 font-sans-clean text-lg mb-2">
                  No results found for "{localQuery}"
                </p>
                <p className="text-charcoal-500 text-sm">
                  Try different keywords or browse our categories
                </p>
              </div>
            ) : (
              <div>
                <p className="text-charcoal-600 font-sans-clean mb-6">
                  Found {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} for "{localQuery}"
                </p>
                <div className="masonry-grid">
                  {filteredProducts.map((product, index) => (
                    <div 
                      key={product.id} 
                      className="masonry-item"
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={() => setIsSearchOpen(false)}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchModal;