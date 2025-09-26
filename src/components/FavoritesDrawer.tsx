import { X, Heart, ShoppingCart } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';
import { useCart } from '../contexts/CartContext';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function FavoritesDrawer({ isOpen, onClose }: FavoritesDrawerProps) {
  const { favorites, removeFromFavorites, favoritesCount } = useFavorites();
  const { addItem } = useCart();

  if (!isOpen) return null;

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-charcoal-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="absolute left-0 top-0 h-full w-full max-w-md bg-oatmeal-50 shadow-charcoal border-r border-oatmeal-300">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b border-oatmeal-300 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif-display font-semibold text-charcoal-800 text-distressed">
                Favorites ({favoritesCount})
              </h2>
              <button
                onClick={onClose}
                className="text-charcoal-600 hover:text-charcoal-800 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Favorites Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {favorites.length === 0 ? (
              <div className="text-center py-12">
                <Heart size={48} className="mx-auto text-charcoal-400 mb-4" />
                <p className="text-charcoal-600 font-sans-clean">No favorites yet</p>
                <p className="text-charcoal-500 text-sm mt-2">Heart your favorite pieces to save them here</p>
              </div>
            ) : (
              favorites.map((item) => (
                <div key={item.id} className="border border-oatmeal-300 bg-oatmeal-100/50 p-4">
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover border-oatmeal-textured"
                    />
                    <div className="flex-1">
                      <h4 className="font-serif-classic font-medium text-charcoal-800 text-sm mb-1">
                        {item.name}
                      </h4>
                      <p className="font-sans-clean font-semibold text-oatmeal-800 mb-2">
                        ${item.price}
                      </p>
                      <p className="text-xs text-charcoal-500">
                        Added {item.addedAt.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeFromFavorites(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Remove from favorites"
                      >
                        <Heart size={18} fill="currentColor" />
                      </button>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="mt-2 bg-oatmeal-600 hover:bg-oatmeal-700 text-oatmeal-100 p-2 rounded-full transition-colors"
                        title="Add to cart"
                      >
                        <ShoppingCart size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FavoritesDrawer;