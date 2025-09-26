import Layout from '../components/Layout';
import { useCart, CartItem } from '../contexts/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

// Helper function to create item key for removal
const getItemKey = (item: CartItem) => 
  `${item.id}_${item.size || 'default'}_${item.color || 'default'}`;

function Cart() {
  const { items: cartItems, removeItem, updateQuantity, total: cartTotal, itemCount } = useCart();

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-texture-paper opacity-10"></div>
              <div className="relative py-16">
                <h1 className="font-serif text-3xl text-charcoal-800 text-distressed mb-4">
                  Your Cart is Empty
                </h1>
                <p className="font-sans-clean text-charcoal-600 mb-8 max-w-md mx-auto">
                  Looks like you haven't added any originals to your cart yet. 
                  Browse our curated collection to find your perfect piece.
                </p>
                <Link
                  to="/"
                  className="inline-block bg-oatmeal-600 hover:bg-oatmeal-700 text-oatmeal-100 font-serif font-semibold px-8 py-3 transition-all duration-300 shadow-oatmeal hover:shadow-charcoal transform hover:scale-[1.02]"
                >
                  Browse Collection
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-charcoal-800 text-distressed mb-2">
            Shopping Cart
          </h1>
          <p className="font-sans-clean text-charcoal-600">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item: CartItem) => (
              <div key={getItemKey(item)} className="bg-oatmeal-50 border border-oatmeal-300 p-6 flex gap-4">
                {/* Product Image */}
                <div className="flex-shrink-0 w-20 h-20 bg-oatmeal-200 rounded overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-lg text-charcoal-800 mb-1">
                    {item.name}
                  </h3>
                  <div className="font-sans-clean text-sm text-charcoal-600 space-y-1">
                    {item.size && (
                      <p>Size: <span className="font-medium">{item.size}</span></p>
                    )}
                    {item.color && (
                      <p>Color: <span className="font-medium capitalize">{item.color}</span></p>
                    )}
                    <p className="font-semibold text-oatmeal-700">${item.price}</p>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(getItemKey(item), Math.max(1, item.quantity - 1))}
                    className="p-1 hover:bg-oatmeal-200 rounded transition-colors"
                  >
                    <Minus size={16} className="text-charcoal-600" />
                  </button>
                  <span className="font-sans-clean font-medium text-charcoal-800 w-8 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(getItemKey(item), item.quantity + 1)}
                    className="p-1 hover:bg-oatmeal-200 rounded transition-colors"
                  >
                    <Plus size={16} className="text-charcoal-600" />
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeItem(getItemKey(item))}
                  className="p-2 hover:bg-red-50 text-red-600 hover:text-red-700 rounded transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-oatmeal-50 border border-oatmeal-300 p-6 h-fit">
            <h2 className="font-serif text-xl text-charcoal-800 text-distressed mb-4">
              Order Summary
            </h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between font-sans-clean text-charcoal-700">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-sans-clean text-charcoal-700">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="border-t border-oatmeal-300 pt-3">
                <div className="flex justify-between font-serif text-lg text-charcoal-800 font-semibold">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                to="/checkout"
                className="block w-full bg-oatmeal-600 hover:bg-oatmeal-700 text-oatmeal-100 font-serif font-semibold text-center py-3 transition-all duration-300 shadow-oatmeal hover:shadow-charcoal transform hover:scale-[1.02]"
              >
                Proceed to Checkout
              </Link>
              <Link
                to="/"
                className="block w-full border border-oatmeal-600 text-oatmeal-700 hover:bg-oatmeal-50 font-serif font-semibold text-center py-3 transition-all duration-300"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Cart;