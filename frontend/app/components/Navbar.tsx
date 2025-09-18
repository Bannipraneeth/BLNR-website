'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 shadow">
      <Link href="/" className="text-2xl font-bold text-blue-700">BLNR</Link>
      <div className="flex items-center space-x-6">
        <Link href="/products" className="text-gray-600 hover:text-blue-600">Products</Link>
        <Link href="/cart" className="text-gray-600 hover:text-blue-600">Cart</Link>
        {isLoggedIn ? (
          <>
            {user?.role === 'admin' && (
              <Link href="/admin" className="text-gray-600 hover:text-blue-600">Admin</Link>
            )}
            <Link href="/account" className="text-gray-600 hover:text-blue-600">Profile</Link>
            <Link href="/orders" className="text-gray-600 hover:text-blue-600">Orders</Link>
            <button onClick={handleLogout} className="text-gray-600 hover:text-blue-600">Logout</button>
          </>
        ) : (
          <Link href="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
        )}
      </div>
    </nav>
  );
} 