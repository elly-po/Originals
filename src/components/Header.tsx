import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useSearch } from '../contexts/SearchContext';
import { useFavorites } from '../contexts/FavoritesContext';
import FavoritesDrawer from './FavoritesDrawer';

function Header() {
  const { itemCount, toggleCart } = useCart();
  const { setIsSearchOpen } = useSearch();
  const { favoritesCount } = useFavorites();
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  return (
    <header className="bg-oatmeal-200/50 border-b border-oatmeal-400/50 sticky top-0 z-40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img 
              src="/originals-store-logo.jpg" 
              alt="Originals Store" 
              className="h-12 w-12 rounded-full border-2 border-oatmeal-400"
            />
          </Link>

          {/* Utility Icons */}
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="text-charcoal-700 hover:text-oatmeal-800 transition-colors"
            >
              <Search size={20} />
            </button>
            <button 
              onClick={() => setIsFavoritesOpen(true)}
              className="text-charcoal-700 hover:text-oatmeal-800 transition-colors relative"
            >
              <Heart size={20} />
              {favoritesCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-sans-clean font-bold">
                  {favoritesCount}
                </span>
              )}
            </button>
            <button 
              onClick={toggleCart}
              className="text-charcoal-700 hover:text-oatmeal-800 transition-colors relative"
            >
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-oatmeal-700 text-oatmeal-100 text-xs rounded-full h-5 w-5 flex items-center justify-center font-sans-clean font-bold">
                  {itemCount}
                </span>
              )}
            </button>
            <button className="text-charcoal-700 hover:text-oatmeal-800 transition-colors">
              <User size={20} />
            </button>
          </div>
        </div>
      </div>
      <FavoritesDrawer 
        isOpen={isFavoritesOpen} 
        onClose={() => setIsFavoritesOpen(false)} 
      />
    </header>
  );
}

export default Header;