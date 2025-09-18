"use client";
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { isLoggedIn, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn || user?.role !== 'admin') {
      router.push('/login');
    }
  }, [isLoggedIn, user, router]);

  if (!isLoggedIn || user?.role !== 'admin') return null;

  return (
    <div className="max-w-2xl mx-auto py-10 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Admin Dashboard</h1>
      <ul className="space-y-4">
        <li><Link href="/admin/products" className="text-blue-600 hover:underline">Manage Products</Link></li>
        <li><Link href="/admin/orders" className="text-blue-600 hover:underline">Track Orders</Link></li>
        <li><Link href="/admin/analytics" className="text-blue-600 hover:underline">View Analytics</Link></li>
      </ul>
    </div>
  );
} 