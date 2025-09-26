import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  className?: string;
}

function ProductCard({ id, name, price, image, className = '' }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const isItemFavorite = isFavorite(id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id,
      name,
      price,
      image,
    });
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isItemFavorite) {
      removeFromFavorites(id);
    } else {
      addToFavorites({
        id,
        name,
        price,
        image,
      });
    }
  };

  return (
    <Link
      to={`/product/${id}`}
      className={`block group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative bg-oatmeal-50 border-oatmeal-textured transition-all duration-500 transform ${
        isHovered ? 'shadow-charcoal hover:-translate-y-1 rotate-0' : 'rotate-[-0.5deg]'
      }`}>
        {/* Product Image */}
        <div className="aspect-square overflow-hidden border-oatmeal-textured">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
          />
        </div>

        {/* Product Info */}
        <div className="p-4 bg-oatmeal-100/50">
          <h3 className="font-serif-classic font-medium text-charcoal-800 text-sm mb-2 line-clamp-2 text-distressed">
            {name}
          </h3>
          <p className="text-oatmeal-800 font-sans-clean font-bold text-lg">
            ${price}
          </p>
        </div>

        {/* Enhanced Hover Tag */}
        {isHovered && (
          <div className="absolute top-3 right-3 bg-charcoal-700 text-oatmeal-100 text-xs px-3 py-2 transform rotate-2 shadow-oatmeal font-sans-clean font-medium">
            View Original
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-3 left-3 p-2 rounded-full transition-all duration-300 ${
            isItemFavorite 
              ? 'bg-red-500 text-white shadow-charcoal' 
              : isHovered 
                ? 'bg-oatmeal-200 text-red-500 shadow-oatmeal' 
                : 'bg-oatmeal-100/80 text-charcoal-400'
          }`}
          title={isItemFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart size={16} fill={isItemFavorite ? "currentColor" : "none"} />
        </button>

        {/* Add to Cart Button */}
        {isHovered && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 bg-oatmeal-600 hover:bg-oatmeal-700 text-oatmeal-100 p-2 rounded-full shadow-charcoal transition-all duration-300 transform hover:scale-110"
            title="Add to Cart"
          >
            <ShoppingCart size={16} />
          </button>
        )}

        {/* Subtle corner accent */}
        <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[20px] border-l-transparent border-b-[20px] border-b-oatmeal-300/30"></div>
      </div>
    </Link>
  );
}

export default ProductCard;