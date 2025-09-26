import { useState } from 'react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  className?: string;
}

function ProductCard({ id, name, price, image, className = '' }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={`/product/${id}`}
      className={`block group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative bg-white border-2 border-stone-200 transition-all duration-300 ${
        isHovered ? 'shadow-lg shadow-stone-300/50' : ''
      }`}>
        {/* Product Image */}
        <div className="aspect-square overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="text-stone-800 font-medium text-sm mb-1 line-clamp-2">
            {name}
          </h3>
          <p className="text-amber-600 font-semibold text-lg">
            ${price}
          </p>
        </div>

        {/* Hover Tag */}
        {isHovered && (
          <div className="absolute top-2 right-2 bg-amber-600 text-white text-xs px-2 py-1 rounded">
            View Original
          </div>
        )}
      </div>
    </Link>
  );
}

export default ProductCard;