'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X, User, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { isLoggedIn, user, logout } = useAuth();

  useEffect(() => setMounted(true), []);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/categories', label: 'Categories' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' }
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-blue-600">BLNR</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(link.href)
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isLoggedIn && user?.role === 'admin' && (
              <Link
                href="/admin"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
              >
                Admin
              </Link>
            )}
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <button
              className="text-gray-600 hover:text-blue-600"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              href="/cart"
              className="relative text-gray-600 hover:text-blue-600"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {totalItems}
                </span>
              )}
            </Link>
            
            {/* Authentication Links */}
            {!isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/account"
                  className="text-gray-600 hover:text-blue-600"
                  aria-label="Account"
                >
                  <User className="h-5 w-5" />
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="text-gray-600 hover:text-blue-600"
                    aria-label="Admin"
                  >
                    <span className="font-bold">Admin</span>
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            )}
            
            <button
              className="md:hidden text-gray-600 hover:text-blue-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block rounded-md px-3 py-2 text-base font-medium ${
                    isActive(link.href)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile Authentication Links */}
              {!isLoggedIn ? (
                <>
                  <Link
                    href="/login"
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block rounded-md px-3 py-2 text-base font-medium text-blue-600 hover:bg-blue-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/account"
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Account
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="block rounded-md px-3 py-2 text-base font-medium text-blue-600 hover:bg-blue-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-red-600"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation; 