'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function OrderSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Confetti animation (optional)
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    // Simple confetti effect
    console.log('🎉 Order successful!');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b15] via-[#2d1123] to-[#54162b] flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
        <div className="text-8xl mb-6">🎉</div>
        
        <h1 className="text-4xl font-bold text-white mb-4">
          Order Placed Successfully!
        </h1>
        
        <p className="text-gray-300 text-lg mb-2">
          Thank you for your purchase!
        </p>
        
        <p className="text-gray-400 text-sm mb-8">
          We've sent a confirmation email with your order details.
        </p>

        <div className="bg-white/5 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-2 gap-4 text-left">
            <div>
              <p className="text-gray-400 text-xs mb-1">Order Number</p>
              <p className="text-white font-bold">
                #{Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Date</p>
              <p className="text-white font-bold">
                {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-400 text-xs mb-1">Estimated Delivery</p>
              <p className="text-white font-bold">
                {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            href="/try-on"
            className="block w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold transition-all"
          >
            Continue Shopping
          </Link>
          
          <Link
            href="/"
            className="block w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all"
          >
            Back to Home
          </Link>
        </div>

        <p className="text-gray-400 text-xs mt-8">
          Questions? Contact us at support@vogue.com
        </p>
      </div>
    </div>
  );
}