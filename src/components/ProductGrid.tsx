import ProductCard from './ProductCard';

// Mock product data
const mockProducts = [
  {
    id: '1',
    name: 'Vintage Leather Jacket - Original 1970s Design',
    price: 299,
    image: 'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=500',
  },
  {
    id: '2',
    name: 'Classic Denim Jeans - Heritage Wash',
    price: 149,
    image: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=500',
  },
  {
    id: '3',
    name: 'Handcrafted Wool Sweater - Traditional Knit',
    price: 189,
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=500',
  },
  {
    id: '4',
    name: 'Original Canvas Sneakers - 1960s Style',
    price: 89,
    image: 'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=500',
  },
  {
    id: '5',
    name: 'Authentic Silk Scarf - Hand-printed Pattern',
    price: 79,
    image: 'https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg?auto=compress&cs=tinysrgb&w=500',
  },
  {
    id: '6',
    name: 'Vintage Leather Boots - Handmade Quality',
    price: 249,
    image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=500',
  },
];

function ProductGrid() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Enhanced Pinterest-style masonry grid */}
      <div className="masonry-grid">
        {mockProducts.map((product, index) => (
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