import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

function CartDrawer() {
  const { items, isOpen, total, itemCount, closeCart, updateQuantity, removeItem } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-charcoal-900/50 backdrop-blur-sm"
        onClick={closeCart}
      />
      
      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-oatmeal-50 shadow-charcoal border-l border-oatmeal-300">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b border-oatmeal-300 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif-display font-semibold text-charcoal-800 text-distressed">
                Shopping Cart ({itemCount})
              </h2>
              <button
                onClick={closeCart}
                className="text-charcoal-600 hover:text-charcoal-800 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag size={48} className="mx-auto text-charcoal-400 mb-4" />
                <p className="text-charcoal-600 font-sans-clean">Your cart is empty</p>
                <p className="text-charcoal-500 text-sm mt-2">Add some authentic pieces to get started</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={`${item.id}-${item.size || ''}-${item.color || ''}`} className="border border-oatmeal-300 bg-oatmeal-100/50 p-4">
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
                      {item.size && (
                        <p className="text-xs text-charcoal-600 mb-1">Size: {item.size}</p>
                      )}
                      {item.color && (
                        <p className="text-xs text-charcoal-600 mb-1">Color: {item.color}</p>
                      )}
                      <p className="font-sans-clean font-semibold text-oatmeal-800">
                        ${item.price}
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeItem(`${item.id}_${item.size || 'default'}_${item.color || 'default'}`)}
                        className="text-charcoal-400 hover:text-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(`${item.id}_${item.size || 'default'}_${item.color || 'default'}`, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center bg-oatmeal-300 hover:bg-oatmeal-400 text-charcoal-700 transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center font-sans-clean font-medium text-charcoal-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(`${item.id}_${item.size || 'default'}_${item.color || 'default'}`, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center bg-oatmeal-300 hover:bg-oatmeal-400 text-charcoal-700 transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-oatmeal-300 p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-serif-display font-semibold text-lg text-charcoal-800">
                  Total: ${total.toFixed(2)}
                </span>
              </div>
              <button className="w-full btn-distressed text-center">
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CartDrawer;