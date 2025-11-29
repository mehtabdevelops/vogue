'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface CartItem {
  itemId: string;
  name: string;
  brand: string;
  price: number;
  color: string;
  size: string;
  category: string;
  thumbnailColor: string;
  avatarUrl?: string;
  quantity: number;
  addedAt: string;
}

const CartPage = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('vogueCart');
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        setCartItems(items);
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
    setLoading(false);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('vogueCart', JSON.stringify(cartItems));
    }
  }, [cartItems, loading]);

  // Update quantity
  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(itemId);
      return;
    }
    
    setCartItems(prev =>
      prev.map(item =>
        item.itemId === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item
  const removeItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.itemId !== itemId));
  };

  // Clear cart
  const clearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      setCartItems([]);
      localStorage.removeItem('vogueCart');
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + tax + shipping;

  // Checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    // Here you would integrate with your payment system
    console.log('Processing checkout:', {
      items: cartItems,
      total,
      timestamp: new Date().toISOString()
    });

    alert('Proceeding to checkout...');
    // router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a0b15] via-[#2d1123] to-[#54162b] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
          <p>Loading cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a0b15] via-[#2d1123] to-[#54162b] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold text-white mb-3">Your Cart is Empty</h1>
          <p className="text-gray-300 text-sm mb-6">
            Browse our virtual try-on to find your perfect outfit!
          </p>
          <Link
            href="/try-on"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-[#54162b] font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b15] via-[#2d1123] to-[#54162b] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold text-white">Shopping Cart</h1>
            <Link
              href="/try-on"
              className="text-sm text-gray-300 hover:text-white underline"
            >
              Continue Shopping
            </Link>
          </div>
          <p className="text-gray-300">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={`${item.itemId}-${item.color}-${item.size}`}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
              >
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div
                    className="w-24 h-24 rounded-lg flex items-center justify-center text-4xl flex-shrink-0"
                    style={{ backgroundColor: item.thumbnailColor || '#333' }}
                  >
                    {item.category === 'tops' && '👔'}
                    {item.category === 'dresses' && '👗'}
                    {item.category === 'outerwear' && '🧥'}
                    {item.category === 'bottoms' && '👖'}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-white">{item.name}</h3>
                        <p className="text-gray-300 text-sm">{item.brand}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.itemId)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        title="Remove item"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-400">Color</p>
                        <p className="text-white font-medium">{item.color}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Size</p>
                        <p className="text-white font-medium">{item.size}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      {/* Quantity */}
                      <div className="flex items-center gap-3">
                        <p className="text-sm text-gray-300">Quantity:</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
                            className="w-8 h-8 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-all"
                          >
                            -
                          </button>
                          <span className="text-white font-semibold w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                            className="w-8 h-8 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-all"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-white font-bold text-xl">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-gray-400">
                            ${item.price.toFixed(2)} each
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Avatar Badge */}
                    {item.avatarUrl && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-xs text-gray-400 flex items-center gap-2">
                          <span>🎭</span>
                          <span>Fitted on your Ready Player Me avatar</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart Button */}
            <button
              onClick={clearCart}
              className="w-full py-3 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-all border border-red-500/30"
            >
              Clear Cart
            </button>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 sticky top-4">
              <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Tax (10%)</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>

                {shipping === 0 && (
                  <p className="text-xs text-green-400 flex items-center gap-1">
                    <span>✓</span>
                    <span>You qualified for free shipping!</span>
                  </p>
                )}

                {subtotal < 100 && (
                  <p className="text-xs text-gray-400">
                    Add ${(100 - subtotal).toFixed(2)} more for free shipping
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-white/20 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-white">Total</span>
                  <span className="text-2xl font-bold text-white">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
              >
                Proceed to Checkout
              </button>

              <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                <p className="text-xs text-gray-400 flex items-center gap-2">
                  <span>🔒</span>
                  <span>Secure checkout with SSL encryption</span>
                </p>
                <p className="text-xs text-gray-400 flex items-center gap-2">
                  <span>🚚</span>
                  <span>Free returns within 30 days</span>
                </p>
                <p className="text-xs text-gray-400 flex items-center gap-2">
                  <span>💳</span>
                  <span>Multiple payment options available</span>
                </p>
              </div>
            </div>

            {/* Recommendations */}
            <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-3">You Might Also Like</h3>
              <p className="text-sm text-gray-300 mb-4">
                Complete your look with these items
              </p>
              <Link
                href="/try-on"
                className="block w-full text-center py-3 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-all"
              >
                Browse More Items
              </Link>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10 text-center">
            <div className="text-3xl mb-2">🚚</div>
            <p className="text-white font-semibold text-sm">Free Shipping</p>
            <p className="text-xs text-gray-400">Orders over $100</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10 text-center">
            <div className="text-3xl mb-2">↩️</div>
            <p className="text-white font-semibold text-sm">Easy Returns</p>
            <p className="text-xs text-gray-400">30-day guarantee</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10 text-center">
            <div className="text-3xl mb-2">🔒</div>
            <p className="text-white font-semibold text-sm">Secure Payment</p>
            <p className="text-xs text-gray-400">SSL encrypted</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10 text-center">
            <div className="text-3xl mb-2">💳</div>
            <p className="text-white font-semibold text-sm">Multiple Payments</p>
            <p className="text-xs text-gray-400">Cards & PayPal</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;