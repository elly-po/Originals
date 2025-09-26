import ProductCard from './ProductCard';
import { useSearch } from '../contexts/SearchContext';

function ProductGrid() {
  const { filteredProducts } = useSearch();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
  );
}

export default ProductGrid;