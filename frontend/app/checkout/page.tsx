'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, totalAmount, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: Implement actual payment processing
      // For now, we'll just simulate a successful order
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clear the cart after successful order
      clearCart();
      
      // Redirect to success page
      router.push('/checkout/success');
    } catch (err) {
      setError('Failed to process payment. Please try again.');
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = resolve;
      document.body.appendChild(script);
    });
  };

  // Razorpay payment handler
  const handleRazorpayPayment = async () => {
    setLoading(true);
    setError('');
    try {
      await loadRazorpayScript();
      // Create order on backend
      const res = await fetch('http://localhost:5000/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount }),
      });
      const data = await res.json();
      if (!data.id) throw new Error('Failed to create Razorpay order');

      const options = {
        key: 'rzp_test_hAKFnVjSABQiQR',
        amount: data.amount,
        currency: data.currency,
        name: 'BLNR Store',
        description: 'Order Payment',
        order_id: data.id,
        handler: function (response: any) {
          clearCart();
          router.push('/checkout/success');
        },
        prefill: {
          name: formData.firstName + ' ' + formData.lastName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: '#14b8a6' },
      };
      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setError('Payment failed. Please try again.');
      console.error('Razorpay error:', err);
    } finally {
      setLoading(false);
    }
  };

  // COD order handler
  const handleCODOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const orderPayload = {
        items: cartItems.map(item => ({
          product: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: 'India',
        },
        paymentMethod: 'COD',
        totalAmount: totalAmount,
        // Add a dummy user if needed for guest orders (backend should not require user for /cod)
      };
      const res = await fetch('http://localhost:5000/api/orders/cod', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to place COD order');
      }
      clearCart();
      router.push('/checkout/success');
    } catch (err) {
      setError('Failed to place COD order. Please try again.');
      console.error('COD order error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to check if form is valid
  const isFormValid = Object.values(formData).every((val) => val.trim() !== '');

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-secondary-800 mb-4">Your cart is empty</h1>
          <button
            onClick={() => router.push('/products')}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition duration-300"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-secondary-800 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping Information */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-secondary-200">
          <h2 className="text-xl font-bold text-secondary-800 mb-4">Shipping Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-secondary-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-secondary-900 text-base mb-2"
                  autoFocus
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-secondary-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-secondary-50 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-secondary-900"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-secondary-50 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-secondary-900"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-secondary-50 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-secondary-900"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-secondary-700 mb-1">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                required
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-secondary-50 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-secondary-900"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-secondary-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-secondary-50 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-secondary-900"
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-secondary-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-secondary-50 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-secondary-900"
                />
              </div>
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-secondary-700 mb-1">
                  ZIP Code
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  required
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-secondary-50 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-secondary-900"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="my-4">
              <label className="block font-semibold mb-2 text-secondary-800">Payment Method</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                  />
                  <span>Online Payment (Razorpay)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <span>Cash on Delivery (COD)</span>
                </label>
              </div>
            </div>

            {error && (
              <div className="text-accent-500 text-sm mt-2">
                {error}
              </div>
            )}

            {/* Payment Buttons */}
            {paymentMethod === 'razorpay' && (
              <button
                type="button"
                disabled={loading || !isFormValid}
                onClick={handleRazorpayPayment}
                className="w-full mt-4 bg-blue-500 text-white py-4 rounded-lg hover:bg-blue-600 transition duration-300 font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:bg-blue-700"
              >
                {loading ? 'Processing...' : 'Pay Now with Razorpay'}
              </button>
            )}
            {paymentMethod === 'cod' && (
              <button
                type="button"
                disabled={loading || !isFormValid}
                onClick={handleCODOrder}
                className="w-full mt-4 bg-green-500 text-white py-4 rounded-lg hover:bg-green-600 transition duration-300 font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:bg-green-700"
              >
                {loading ? 'Placing Order...' : 'Place Order (COD)'}
              </button>
            )}
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-md border border-secondary-200">
            <h2 className="text-2xl font-bold mb-4 text-secondary-800">Order Summary</h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between text-secondary-600">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t border-secondary-200 pt-4">
                <div className="flex justify-between text-lg font-bold text-secondary-800">
                  <span>Total</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}