import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { Shield } from 'lucide-react';

function ProductDetail() {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  // Mock product data
  const product = {
    id: id || '1',
    name: 'Vintage Leather Jacket - Original 1970s Design',
    price: 299,
    images: [
      'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    description: `This authentic leather jacket represents the pinnacle of 1970s craftsmanship. 
    Sourced from a renowned Italian leather house, each piece features hand-selected full-grain leather 
    that has been naturally aged to perfection. The original brass hardware and vintage-inspired 
    stitching techniques ensure both durability and timeless style.`,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'Brown', 'Cognac'],
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square border-2 border-stone-200 overflow-hidden">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {product.images.slice(1).map((image, index) => (
                <div key={index} className="aspect-square border-2 border-stone-200 overflow-hidden">
                  <img
                    src={image}
                    alt={`${product.name} ${index + 2}`}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-serif text-stone-800 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-3">
                <p className="text-2xl font-semibold text-amber-600">
                  ${product.price}
                </p>
                <div className="flex items-center gap-1 text-stone-600">
                  <Shield size={16} />
                  <span className="text-sm">Verified Original</span>
                </div>
              </div>
            </div>

            <div className="h-px bg-stone-300 opacity-50"></div>

            <div>
              <h3 className="text-lg font-medium text-stone-800 mb-3">Description</h3>
              <p className="text-stone-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Size Selector */}
            <div>
              <h3 className="text-lg font-medium text-stone-800 mb-3">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border-2 transition-colors ${
                      selectedSize === size
                        ? 'border-amber-600 bg-amber-600 text-white'
                        : 'border-stone-300 text-stone-700 hover:border-amber-600'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div>
              <h3 className="text-lg font-medium text-stone-800 mb-3">Color</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border-2 transition-colors ${
                      selectedColor === color
                        ? 'border-amber-600 bg-amber-600 text-white'
                        : 'border-stone-300 text-stone-700 hover:border-amber-600'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart Button */}
            <button className="w-full bg-amber-600 text-stone-800 font-semibold py-4 px-8 hover:bg-amber-700 transition-colors">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ProductDetail;