'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Blog', href: '/blog' }
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Shipping', href: '/shipping' }
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Returns', href: '/returns' }
    ]
  };

  return (
    <footer className="bg-gray-900 text-white py-8 mt-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="mb-6 md:mb-0">
          <h2 className="text-xl font-bold mb-2">SSB ENTERPRISES</h2>
          <p className="text-gray-300 mb-2">
            Your one-stop shop for high-quality small scale products. We are dedicated to making everyday essentials accessible and affordable for everyone.
          </p>
          <div className="text-gray-400 text-sm">
            <div>Office Address:</div>
            <div>SSB ENTERPRISES,</div>
            <div>near konai cheruvu, purushottapatnam road,</div>
            <div>gannavaram, Krishna district,</div>
            <div>Andhra Pradesh, 521101.</div>
          </div>
          <div className="mt-2 text-gray-400 text-sm">
            Email: <a href="mailto:sbenterprises170@gmail.com" className="text-blue-400 hover:underline">sbenterprises170@gmail.com</a>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:space-x-12">
          <div className="mb-4 md:mb-0">
            <h3 className="font-semibold mb-2">Company</h3>
            <ul>
              <li><a href="/about" className="hover:underline">About Us</a></li>
              <li><a href="/contact" className="hover:underline">Contact</a></li>
              <li><a href="/products" className="hover:underline">Products</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Support</h3>
            <ul>
              <li><a href="mailto:sbenterprises170@gmail.com" className="hover:underline">Email Support</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center text-gray-500 text-sm">
        &copy; {currentYear} SSB ENTERPRISES. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer; 