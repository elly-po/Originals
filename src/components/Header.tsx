import { Link } from 'react-router-dom';
import { Search, Star, ShoppingCart, User } from 'lucide-react';

function Header() {
  return (
    <header className="bg-stone-50 border-b border-stone-300/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img 
              src="/originals-store-logo.jpg" 
              alt="Originals Store" 
              className="h-12 w-12 rounded-full"
            />
          </Link>

          {/* Utility Icons */}
          <div className="flex items-center space-x-6">
            <button className="text-stone-700 hover:text-amber-600 transition-colors">
              <Search size={20} />
            </button>
            <button className="text-stone-700 hover:text-amber-600 transition-colors">
              <Star size={20} />
            </button>
            <button className="text-stone-700 hover:text-amber-600 transition-colors relative">
              <ShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </button>
            <button className="text-stone-700 hover:text-amber-600 transition-colors">
              <User size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;