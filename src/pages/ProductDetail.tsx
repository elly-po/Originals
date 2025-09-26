import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { Shield, Heart, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useSearch } from '../contexts/SearchContext';

function ProductDetail() {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const { addItem } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { products } = useSearch();
  
  // Get actual product from search context or fall back to mock
  const actualProduct = products.find(p => p.id === id);

  // Enhanced product data with fallback
  const product = actualProduct ? {
    ...actualProduct,
    images: [
      actualProduct.image,
      'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'Brown', 'Cognac', 'Navy'],
  } : {
    id: id || '1',
    name: 'Vintage Leather Jacket - Original 1970s Design',
    price: 299,
    image: 'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'outerwear',
    tags: ['vintage', 'leather', 'jacket'],
    images: [
      'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    description: `This authentic leather jacket represents the pinnacle of 1970s craftsmanship. 
    Sourced from a renowned Italian leather house, each piece features hand-selected full-grain leather 
    that has been naturally aged to perfection. The original brass hardware and vintage-inspired 
    stitching techniques ensure both durability and timeless style.`,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'Brown', 'Cognac', 'Navy'],
  };
  
  const isItemFavorite = isFavorite(product.id);
  
  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
    });
  };
  
  const handleToggleFavorite = () => {
    if (isItemFavorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
      });
    }
  };

  return (
    <Layout>
      <div className="relative">
        {/* Textural Background */}
        <div className="absolute inset-0 bg-oatmeal-50 opacity-40"></div>
        <div className="absolute inset-0 bg-texture-paper opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Enhanced Image Gallery */}
            <div className="space-y-4 relative">
              {/* Wax Seal Stamp */}
              <div className="absolute -top-6 -right-6 z-20 w-24 h-24 bg-gradient-to-br from-red-800 via-red-700 to-red-900 rounded-full flex items-center justify-center shadow-charcoal transform rotate-12">
                <div className="text-center">
                  <Star size={16} className="text-oatmeal-100 mx-auto mb-1" fill="currentColor" />
                  <p className="text-xs font-serif text-oatmeal-100 font-bold leading-none">AUTHENTIC</p>
                </div>
              </div>
              
              {/* Main Image */}
              <div className="relative aspect-square border-oatmeal-textured bg-oatmeal-100 p-3 shadow-oatmeal">
                <div className="absolute inset-0 bg-texture-vintage opacity-10"></div>
                <img
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  className="relative w-full h-full object-cover border-2 border-charcoal-200/30 shadow-inner"
                />
                
                {/* Distressed corner accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-charcoal-400/20 border-dashed"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-charcoal-400/20 border-dashed"></div>
              </div>
              
              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square border-2 overflow-hidden transition-all duration-300 ${
                      selectedImageIndex === index
                        ? 'border-oatmeal-600 shadow-oatmeal-strong bg-oatmeal-200'
                        : 'border-oatmeal-300 hover:border-oatmeal-500 bg-oatmeal-50'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Enhanced Product Info */}
            <div className="space-y-6 relative">
              {/* Distressed title section */}
              <div className="relative bg-oatmeal-100 p-6 border-oatmeal-textured shadow-oatmeal">
                <div className="absolute inset-0 bg-texture-vintage opacity-5"></div>
                <div className="relative">
                  <h1 className="font-serif-display text-4xl text-charcoal-800 mb-4 text-distressed leading-tight">
                    {product.name}
                  </h1>
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-serif text-3xl font-bold text-oatmeal-800">
                      ${product.price}
                    </p>
                    <button
                      onClick={handleToggleFavorite}
                      className={`p-3 rounded-full transition-all duration-300 ${
                        isItemFavorite
                          ? 'bg-red-500 text-white shadow-charcoal'
                          : 'bg-oatmeal-200 text-red-500 hover:bg-red-500 hover:text-white shadow-oatmeal'
                      }`}
                      title={isItemFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Heart size={20} fill={isItemFavorite ? "currentColor" : "none"} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-charcoal-600">
                    <Shield size={18} className="text-oatmeal-700" />
                    <span className="font-sans-clean font-medium">Verified Original • Handcrafted</span>
                  </div>
                </div>
              </div>

              {/* Hand-drawn divider */}
              <div className="relative h-4 flex items-center justify-center">
                <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-charcoal-300 to-transparent"></div>
                <div className="bg-oatmeal-50 px-4">
                  <div className="w-2 h-2 border border-charcoal-400 rounded-full bg-oatmeal-200"></div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-oatmeal-50/50 p-6 border border-oatmeal-300 border-dashed">
                <h3 className="font-serif text-xl text-charcoal-800 mb-4 text-distressed">The Story</h3>
                <p className="font-sans-clean text-charcoal-700 leading-relaxed">
                  {product.description || 'A carefully curated piece representing authentic craftsmanship and timeless design. Each item tells a story of tradition, quality, and enduring style.'}
                </p>
              </div>

              {/* Enhanced Size Selector */}
              <div className="bg-oatmeal-50/50 p-6 border border-oatmeal-300 border-dashed">
                <h3 className="font-serif text-xl text-charcoal-800 mb-4 text-distressed">Size</h3>
                <div className="grid grid-cols-5 gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`aspect-square border-2 transition-all duration-300 font-sans-clean font-bold text-lg flex items-center justify-center ${
                        selectedSize === size
                          ? 'border-oatmeal-600 bg-oatmeal-600 text-oatmeal-100 shadow-charcoal transform scale-105'
                          : 'border-oatmeal-300 text-charcoal-700 hover:border-oatmeal-500 hover:bg-oatmeal-200 shadow-oatmeal'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {!selectedSize && (
                  <p className="text-sm text-charcoal-500 mt-2 font-sans-clean italic">Please select a size</p>
                )}
              </div>

              {/* Enhanced Color Selector */}
              <div className="bg-oatmeal-50/50 p-6 border border-oatmeal-300 border-dashed">
                <h3 className="font-serif text-xl text-charcoal-800 mb-4 text-distressed">Color</h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-6 py-4 border-2 transition-all duration-300 font-sans-clean font-semibold text-center relative overflow-hidden ${
                        selectedColor === color
                          ? 'border-oatmeal-600 bg-oatmeal-600 text-oatmeal-100 shadow-charcoal transform scale-[1.02]'
                          : 'border-oatmeal-300 text-charcoal-700 hover:border-oatmeal-500 hover:bg-oatmeal-200 shadow-oatmeal'
                      }`}
                    >
                      <div className="absolute inset-0 bg-texture-subtle opacity-10"></div>
                      <span className="relative">{color}</span>
                    </button>
                  ))}
                </div>
                {!selectedColor && (
                  <p className="text-sm text-charcoal-500 mt-2 font-sans-clean italic">Please select a color</p>
                )}
              </div>

              {/* Enhanced Add to Cart Button */}
              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedSize || !selectedColor}
                  className={`w-full relative overflow-hidden py-6 px-8 font-serif text-xl font-bold transition-all duration-300 border-2 ${
                    selectedSize && selectedColor
                      ? 'bg-oatmeal-600 hover:bg-oatmeal-700 text-oatmeal-100 border-oatmeal-600 shadow-charcoal hover:shadow-charcoal-strong transform hover:scale-[1.02]'
                      : 'bg-oatmeal-300 text-charcoal-400 border-oatmeal-300 cursor-not-allowed'
                  }`}
                >
                  <div className="absolute inset-0 bg-texture-vintage opacity-20"></div>
                  <div className="relative flex items-center justify-center gap-3">
                    <ShoppingCart size={24} />
                    <span className="text-distressed">Add to Collection</span>
                  </div>
                </button>
                
                {(!selectedSize || !selectedColor) && (
                  <p className="text-center text-sm text-charcoal-500 font-sans-clean italic">
                    Please select {!selectedSize && !selectedColor ? 'size and color' : !selectedSize ? 'a size' : 'a color'} to continue
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ProductDetail;