const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get analytics data
router.get('/', [auth, admin], async (req, res) => {
  try {
    // Get total orders and revenue
    const orders = await Order.find();
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Get orders by status
    const ordersByStatus = {
      pending: orders.filter(order => order.status === 'pending').length,
      processing: orders.filter(order => order.status === 'processing').length,
      shipped: orders.filter(order => order.status === 'shipped').length,
      delivered: orders.filter(order => order.status === 'delivered').length,
      cancelled: orders.filter(order => order.status === 'cancelled').length,
    };

    // Get orders by day (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const ordersByDay = last7Days.map(date => {
      const dayOrders = orders.filter(order => 
        order.createdAt.toISOString().split('T')[0] === date
      );
      return {
        date,
        count: dayOrders.length,
        revenue: dayOrders.reduce((sum, order) => sum + order.totalAmount, 0),
      };
    });

    // Get top products by revenue
    const productRevenue = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!productRevenue[item.product]) {
          productRevenue[item.product] = {
            name: item.name,
            quantity: 0,
            revenue: 0,
          };
        }
        productRevenue[item.product].quantity += item.quantity;
        productRevenue[item.product].revenue += item.price * item.quantity;
      });
    });

    const topProducts = Object.values(productRevenue)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    res.json({
      totalOrders,
      totalRevenue,
      averageOrderValue,
      ordersByStatus,
      ordersByDay,
      topProducts,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Error fetching analytics data' });
  }
});

module.exports = router; 