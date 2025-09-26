import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User, LogOut, UserCircle, Shield } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useSearch } from '../contexts/SearchContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';
import FavoritesDrawer from './FavoritesDrawer';

function Header() {
  const { itemCount, toggleCart } = useCart();
  const { setIsSearchOpen } = useSearch();
  const { favoritesCount } = useFavorites();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleUserMenuToggle = () => {
    if (!isAuthenticated) {
      navigate('/signin');
    } else {
      setIsUserMenuOpen(!isUserMenuOpen);
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

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
            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={handleUserMenuToggle}
                className="text-charcoal-700 hover:text-oatmeal-800 transition-colors relative"
              >
                {isAuthenticated ? <UserCircle size={20} /> : <User size={20} />}
                {isAuthenticated && (
                  <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
                )}
              </button>

              {/* User Menu Dropdown */}
              {isAuthenticated && isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-oatmeal-200 z-50">
                  <div className="py-2">
                    {/* User Info */}
                    <div className="px-4 py-2 border-b border-oatmeal-100">
                      <p className="text-sm font-medium text-charcoal-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-charcoal-600">
                        {user?.email}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setIsFavoritesOpen(true);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-charcoal-700 hover:bg-oatmeal-50 transition-colors flex items-center"
                      >
                        <Heart size={16} className="mr-2" />
                        My Favorites ({user?.favoriteProducts?.length || 0})
                      </button>

                      {/* Admin Dashboard Link */}
                      {isAdmin && (
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            navigate('/admin');
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-charcoal-700 hover:bg-oatmeal-50 transition-colors flex items-center border-t border-oatmeal-100"
                        >
                          <Shield size={16} className="mr-2" />
                          Admin Dashboard
                        </button>
                      )}
                      
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-charcoal-700 hover:bg-oatmeal-50 transition-colors flex items-center"
                      >
                        <LogOut size={16} className="mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
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