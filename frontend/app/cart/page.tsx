'use client';

import { useCart } from '../context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, totalAmount, clearCart } = useCart();
  const router = useRouter();

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-secondary-800">Your Cart is Empty</h1>
          <p className="text-secondary-600 mb-8">Add some products to your cart to see them here.</p>
          <Link
            href="/products"
            className="inline-block bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-secondary-800">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          {cartItems.map((item) => (
            <div key={item._id} className="flex gap-4 border-b border-secondary-200 py-6">
              <div className="w-24 h-24 relative">
                <img
                  src={item.images && item.images.length > 0 ? item.images[0] : '/no-image.png'}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold mb-2 text-secondary-800">{item.name}</h3>
                <p className="text-primary-600 font-bold mb-2">₹{item.price.toLocaleString()}</p>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-secondary-200 rounded">
                    <button
                      className="px-3 py-1 hover:bg-secondary-50 text-secondary-600"
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-secondary-700">{item.quantity}</span>
                    <button
                      className="px-3 py-1 hover:bg-secondary-50 text-secondary-600"
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    className="text-accent-500 hover:text-accent-600"
                    onClick={() => removeFromCart(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-bold text-secondary-800">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
          
          <div className="mt-6">
            <button
              className="text-accent-500 hover:text-accent-600"
              onClick={clearCart}
            >
              Clear Cart
            </button>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-md border border-secondary-200">
            <h2 className="text-2xl font-bold mb-4 text-secondary-800">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-secondary-600">
                <span>Subtotal</span>
                <span>₹{totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-secondary-600">
                <span>Shipping</span>
                <span className="text-primary-500">Free</span>
              </div>
              <div className="border-t border-secondary-200 pt-4">
                <div className="flex justify-between text-lg font-bold text-secondary-800">
                  <span>Total</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-blue-400 text-white py-3 rounded-lg hover:bg-blue-500 transition duration-300 mt-6 font-bold text-lg shadow-lg"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 