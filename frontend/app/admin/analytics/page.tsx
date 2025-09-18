'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { useAuth } from '../../context/AuthContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByStatus: {
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  ordersByDay: {
    date: string;
    count: number;
    revenue: number;
  }[];
  topProducts: {
    name: string;
    quantity: number;
    revenue: number;
  }[];
}

export default function AdminAnalytics() {
  const { isLoggedIn, user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn || user?.role !== 'admin') {
      router.push('/login');
    } else {
      fetchAnalytics();
    }
    // eslint-disable-next-line
  }, [isLoggedIn, user]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/analytics', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch analytics');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      setError('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn || user?.role !== 'admin') return null;

  if (loading) return <div>Loading analytics...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  const orderStatusData = {
    labels: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    datasets: [
      {
        data: [
          stats.ordersByStatus.pending,
          stats.ordersByStatus.processing,
          stats.ordersByStatus.shipped,
          stats.ordersByStatus.delivered,
          stats.ordersByStatus.cancelled,
        ],
        backgroundColor: [
          '#FCD34D',
          '#60A5FA',
          '#A78BFA',
          '#34D399',
          '#F87171',
        ],
      },
    ],
  };

  const orderTrendData = {
    labels: stats.ordersByDay.map(day => day.date),
    datasets: [
      {
        label: 'Orders',
        data: stats.ordersByDay.map(day => day.count),
        borderColor: '#60A5FA',
        backgroundColor: '#60A5FA',
      },
      {
        label: 'Revenue',
        data: stats.ordersByDay.map(day => day.revenue),
        borderColor: '#34D399',
        backgroundColor: '#34D399',
      },
    ],
  };

  const topProductsData = {
    labels: stats.topProducts.map(product => product.name),
    datasets: [
      {
        label: 'Revenue',
        data: stats.topProducts.map(product => product.revenue),
        backgroundColor: '#60A5FA',
      },
    ],
  };

  // Defensive: fallback to empty object if ordersByStatus is missing
  const ordersByStatus = stats?.ordersByStatus || {};
  const pending = typeof ordersByStatus.pending === 'number' ? ordersByStatus.pending : 0;
  const processing = typeof ordersByStatus.processing === 'number' ? ordersByStatus.processing : 0;
  const shipped = typeof ordersByStatus.shipped === 'number' ? ordersByStatus.shipped : 0;
  const delivered = typeof ordersByStatus.delivered === 'number' ? ordersByStatus.delivered : 0;

  // Use these safe values everywhere, including in chart data arrays
  const chartData = [pending, processing, shipped, delivered];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalOrders ?? 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600">${stats.totalRevenue?.toFixed(2) ?? 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Average Order Value</h3>
          <p className="text-3xl font-bold text-purple-600">${stats.averageOrderValue?.toFixed(2) ?? 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Order Status Distribution</h3>
          <div className="h-64">
            <Pie data={orderStatusData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Order Trends</h3>
          <div className="h-64">
            <Line
              data={orderTrendData}
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Top Products by Revenue</h3>
        <div className="h-64">
          <Bar
            data={topProductsData}
            options={{
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Orders by Status</h2>
        <ul className="list-disc pl-8">
          <li>Pending: {pending}</li>
          <li>Processing: {processing}</li>
          <li>Shipped: {shipped}</li>
          <li>Delivered: {delivered}</li>
        </ul>
      </div>
    </div>
  );
} 