import Layout from '../components/Layout';
import { useState } from 'react';
import { useCart, CartItem } from '../contexts/CartContext';
import { Link } from 'react-router-dom';

function Checkout() {
  const { items: cartItems, total: cartTotal, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    
    // Payment Information
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    
    // Options
    shippingMethod: 'standard',
    saveInfo: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Implement actual payment processing
    // This would typically integrate with Stripe, PayPal, etc.
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Clear cart and show success
    clearCart();
    setOrderPlaced(true);
  };

  const shippingCost = formData.shippingMethod === 'express' ? 18.95 : 
                      formData.shippingMethod === 'overnight' ? 29.95 : 8.95;
  const subtotal = cartTotal;
  const total = subtotal + shippingCost;

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-6">
            <h1 className="font-serif text-3xl text-charcoal-800 text-distressed">
              Your Cart is Empty
            </h1>
            <p className="font-sans-clean text-charcoal-600">
              Add some items to your cart before proceeding to checkout.
            </p>
            <Link
              to="/"
              className="inline-block bg-oatmeal-600 hover:bg-oatmeal-700 text-oatmeal-100 font-serif font-semibold px-8 py-3 transition-all duration-300 shadow-oatmeal hover:shadow-charcoal transform hover:scale-[1.02]"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (orderPlaced) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="font-serif text-3xl text-charcoal-800 text-distressed">
              Order Confirmed!
            </h1>
            <div className="space-y-4">
              <p className="font-sans-clean text-charcoal-700">
                Thank you for your order! We've received your payment and will begin processing your vintage pieces.
              </p>
              <p className="font-sans-clean text-charcoal-600 text-sm">
                You'll receive an email confirmation shortly with your order details and tracking information.
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <Link
                to="/"
                className="bg-oatmeal-600 hover:bg-oatmeal-700 text-oatmeal-100 font-serif font-semibold px-8 py-3 transition-all duration-300 shadow-oatmeal hover:shadow-charcoal transform hover:scale-[1.02]"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-charcoal-800 text-distressed">
            Checkout
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Checkout Form */}
            <div className="space-y-8">
              {/* Shipping Information */}
              <div>
                <h2 className="font-serif text-xl text-charcoal-800 text-distressed mb-6">
                  Shipping Information
                </h2>
                
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-sans-clean text-charcoal-700 text-sm font-medium mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-oatmeal-400 bg-oatmeal-50 focus:border-oatmeal-600 focus:outline-none transition-colors font-sans-clean"
                      />
                    </div>
                    <div>
                      <label className="block font-sans-clean text-charcoal-700 text-sm font-medium mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-oatmeal-400 bg-oatmeal-50 focus:border-oatmeal-600 focus:outline-none transition-colors font-sans-clean"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-sans-clean text-charcoal-700 text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-oatmeal-400 bg-oatmeal-50 focus:border-oatmeal-600 focus:outline-none transition-colors font-sans-clean"
                    />
                  </div>

                  <div>
                    <label className="block font-sans-clean text-charcoal-700 text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-oatmeal-400 bg-oatmeal-50 focus:border-oatmeal-600 focus:outline-none transition-colors font-sans-clean"
                    />
                  </div>

                  <div>
                    <label className="block font-sans-clean text-charcoal-700 text-sm font-medium mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-oatmeal-400 bg-oatmeal-50 focus:border-oatmeal-600 focus:outline-none transition-colors font-sans-clean"
                    />
                  </div>

                  <div>
                    <label className="block font-sans-clean text-charcoal-700 text-sm font-medium mb-2">
                      Apartment, Suite, etc.
                    </label>
                    <input
                      type="text"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-oatmeal-400 bg-oatmeal-50 focus:border-oatmeal-600 focus:outline-none transition-colors font-sans-clean"
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-sans-clean text-charcoal-700 text-sm font-medium mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-oatmeal-400 bg-oatmeal-50 focus:border-oatmeal-600 focus:outline-none transition-colors font-sans-clean"
                      />
                    </div>
                    <div>
                      <label className="block font-sans-clean text-charcoal-700 text-sm font-medium mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        required
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-oatmeal-400 bg-oatmeal-50 focus:border-oatmeal-600 focus:outline-none transition-colors font-sans-clean"
                      />
                    </div>
                    <div>
                      <label className="block font-sans-clean text-charcoal-700 text-sm font-medium mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        required
                        value={formData.zipCode}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-oatmeal-400 bg-oatmeal-50 focus:border-oatmeal-600 focus:outline-none transition-colors font-sans-clean"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Method */}
              <div>
                <h2 className="font-serif text-xl text-charcoal-800 text-distressed mb-6">
                  Shipping Method
                </h2>
                
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border border-oatmeal-400 bg-oatmeal-50 cursor-pointer hover:bg-oatmeal-100 transition-colors">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="standard"
                      checked={formData.shippingMethod === 'standard'}
                      onChange={handleChange}
                      className="text-oatmeal-600"
                    />
                    <div className="flex-1 flex justify-between">
                      <div>
                        <div className="font-sans-clean font-medium text-charcoal-800">Standard Shipping</div>
                        <div className="font-sans-clean text-sm text-charcoal-600">5-7 business days</div>
                      </div>
                      <div className="font-sans-clean font-medium text-charcoal-800">$8.95</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border border-oatmeal-400 bg-oatmeal-50 cursor-pointer hover:bg-oatmeal-100 transition-colors">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="express"
                      checked={formData.shippingMethod === 'express'}
                      onChange={handleChange}
                      className="text-oatmeal-600"
                    />
                    <div className="flex-1 flex justify-between">
                      <div>
                        <div className="font-sans-clean font-medium text-charcoal-800">Express Shipping</div>
                        <div className="font-sans-clean text-sm text-charcoal-600">2-3 business days</div>
                      </div>
                      <div className="font-sans-clean font-medium text-charcoal-800">$18.95</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border border-oatmeal-400 bg-oatmeal-50 cursor-pointer hover:bg-oatmeal-100 transition-colors">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="overnight"
                      checked={formData.shippingMethod === 'overnight'}
                      onChange={handleChange}
                      className="text-oatmeal-600"
                    />
                    <div className="flex-1 flex justify-between">
                      <div>
                        <div className="font-sans-clean font-medium text-charcoal-800">Overnight Delivery</div>
                        <div className="font-sans-clean text-sm text-charcoal-600">Next business day</div>
                      </div>
                      <div className="font-sans-clean font-medium text-charcoal-800">$29.95</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h2 className="font-serif text-xl text-charcoal-800 text-distressed mb-6">
                  Payment Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block font-sans-clean text-charcoal-700 text-sm font-medium mb-2">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      required
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border border-oatmeal-400 bg-oatmeal-50 focus:border-oatmeal-600 focus:outline-none transition-colors font-sans-clean"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-sans-clean text-charcoal-700 text-sm font-medium mb-2">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        required
                        value={formData.expiryDate}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border border-oatmeal-400 bg-oatmeal-50 focus:border-oatmeal-600 focus:outline-none transition-colors font-sans-clean"
                      />
                    </div>
                    <div>
                      <label className="block font-sans-clean text-charcoal-700 text-sm font-medium mb-2">
                        CVV *
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        required
                        value={formData.cvv}
                        onChange={handleChange}
                        placeholder="123"
                        className="w-full px-4 py-3 border border-oatmeal-400 bg-oatmeal-50 focus:border-oatmeal-600 focus:outline-none transition-colors font-sans-clean"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-sans-clean text-charcoal-700 text-sm font-medium mb-2">
                      Name on Card *
                    </label>
                    <input
                      type="text"
                      name="nameOnCard"
                      required
                      value={formData.nameOnCard}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-oatmeal-400 bg-oatmeal-50 focus:border-oatmeal-600 focus:outline-none transition-colors font-sans-clean"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-oatmeal-50 border border-oatmeal-300 p-6 sticky top-4">
                <h2 className="font-serif text-xl text-charcoal-800 text-distressed mb-6">
                  Order Summary
                </h2>

                {/* Items */}
                <div className="space-y-4 mb-6">
                  {cartItems.map((item: CartItem) => (
                    <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4">
                      <div className="w-16 h-16 bg-oatmeal-200 rounded overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-charcoal-800 text-sm leading-tight mb-1">
                          {item.name}
                        </h3>
                        <div className="font-sans-clean text-xs text-charcoal-600">
                          {item.size && <span>Size: {item.size}</span>}
                          {item.size && item.color && <span> • </span>}
                          {item.color && <span>Color: {item.color}</span>}
                          <div>Qty: {item.quantity}</div>
                        </div>
                      </div>
                      <div className="font-sans-clean text-sm font-medium text-charcoal-800">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 border-t border-oatmeal-300 pt-4">
                  <div className="flex justify-between font-sans-clean text-charcoal-700">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-sans-clean text-charcoal-700">
                    <span>Shipping</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-serif text-lg font-semibold text-charcoal-800 border-t border-oatmeal-300 pt-3">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-6 bg-oatmeal-600 hover:bg-oatmeal-700 text-oatmeal-100 font-serif font-semibold py-4 transition-all duration-300 shadow-oatmeal hover:shadow-charcoal transform hover:scale-[1.02]"
                >
                  Complete Order
                </button>

                <div className="mt-4 text-center">
                  <Link
                    to="/cart"
                    className="font-sans-clean text-sm text-charcoal-600 hover:text-oatmeal-800 transition-colors"
                  >
                    ← Return to Cart
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default Checkout;