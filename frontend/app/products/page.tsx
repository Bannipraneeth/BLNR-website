'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images?: string[];
  image?: string;
  stock: number;
  createdAt: string;
}

interface ProductsResponse {
  products: Product[];
  currentPage: number;
  totalPages: number;
  totalProducts: number;
}

// Loading skeleton component
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="border rounded-lg p-4 animate-pulse">
          <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        </div>
      ))}
    </div>
  );
}

// Helper to get image URL
const getImageUrl = (product: Product) => {
  if (product.images && product.images.length > 0) {
    const img = product.images[0];
    if (!img) return '/no-image.png';
    if (img.startsWith('http')) return img;
    if (img.startsWith('/uploads')) return `http://localhost:5000${img}`;
    return img;
  }
  if (product.image) {
    if (!product.image) return '/no-image.png';
    if (product.image.startsWith('http')) return product.image;
    if (product.image.startsWith('/uploads')) return `http://localhost:5000${product.image}`;
    return product.image;
  }
  return '/no-image.png';
};

// Product card component
function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const router = useRouter();
  const productWithImages = { ...product, images: product.images || [] };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(productWithImages);
    setAdded(true);
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition duration-300 cursor-pointer">
      <Link href={`/products/${product._id}`}>
        <div className="aspect-[4/3] w-full mb-4 overflow-hidden rounded-lg bg-gray-50">
          <img
            src={getImageUrl(product)}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg"
            loading="lazy"
            style={{ minHeight: 0, minWidth: 0 }}
            onError={(e) => { e.currentTarget.src = '/no-image.png'; }}
          />
        </div>
        <h2 className="text-xl font-semibold mb-2 line-clamp-1">{product.name}</h2>
        <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold text-blue-600">₹{product.price.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Stock: {product.stock}</p>
        </div>
      </Link>
      {added ? (
        <button
          onClick={() => router.push('/cart')}
          className="w-full mt-2 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition duration-300"
        >
          Go to Cart
        </button>
      ) : (
        <button
          onClick={handleAddToCart}
          className="w-full mt-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
        >
          Add to Cart
        </button>
      )}
      {added && (
        <div className="text-green-600 text-sm mt-1 text-center">Added to cart!</div>
      )}
    </div>
  );
}

// Pagination component
function Pagination({ currentPage, totalPages, onPageChange }: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex justify-center mt-8 space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Previous
      </button>
      
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index + 1}
          onClick={() => onPageChange(index + 1)}
          className={`px-4 py-2 border rounded-lg ${
            currentPage === index + 1
              ? 'bg-blue-600 text-white'
              : 'hover:bg-gray-50'
          }`}
        >
          {index + 1}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Next
      </button>
    </div>
  );
}

export default function ProductsPage() {
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Starting to fetch products...');
        setLoading(true);
        
        const response = await fetch(
          'http://localhost:5000/api/products',
          {
            headers: {
              'Accept': 'application/json',
              'Cache-Control': 'no-cache'
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: ProductsResponse = await response.json();
        console.log('Received products data:', data);
        
        setProducts(data.products);
        setFilteredProducts(data.products);
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(data.products.map(p => p.category)));
        setCategories(uniqueCategories);
        
        setError('');
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let result = [...products];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default: // 'newest'
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    setFilteredProducts(result);
  }, [products, searchTerm, selectedCategory, sortBy]);

  if (!mounted) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      <div className="container mx-auto px-2 sm:px-4 py-8 overflow-x-hidden">
        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
          {/* Search Input */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 text-base"
              autoFocus
            />
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Options */}
          <div className="w-full md:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>
        </div>
        
        {loading && <LoadingSkeleton />}

        {error && (
          <div className="text-center text-red-500">
            <p>Error: {error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {filteredProducts.length === 0 ? (
              <div className="text-center text-gray-500">
                <p>No products found matching your criteria</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setSortBy('newest');
                  }}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 