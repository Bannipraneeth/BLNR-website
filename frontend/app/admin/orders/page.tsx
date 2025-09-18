"use client";
import { useEffect, useState } from "react";
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

interface Order {
  _id: string;
  user: { name: string; email: string };
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const { isLoggedIn, user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn || user?.role !== 'admin') {
      router.push('/login');
    } else {
      fetchOrders();
    }
    // eslint-disable-next-line
  }, [isLoggedIn, user]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/orders/all', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn || user?.role !== 'admin') return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Orders</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Order ID</th>
                <th className="px-4 py-2 border">User</th>
                <th className="px-4 py-2 border">Items</th>
                <th className="px-4 py-2 border">Total</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(orders) && orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-4 py-2 border">{order._id}</td>
                  <td className="px-4 py-2 border">{order.user?.name || 'N/A'}<br /><span className="text-xs text-gray-500">{order.user?.email}</span></td>
                  <td className="px-4 py-2 border">
                    <ul>
                      {order.items.map((item, idx) => (
                        <li key={idx}>{item.name} x {item.quantity} (₹{item.price})</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-2 border font-bold">₹{order.totalAmount}</td>
                  <td className="px-4 py-2 border capitalize">{order.status}</td>
                  <td className="px-4 py-2 border">{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 