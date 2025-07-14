const prometheus = require('prom-client');
const logger = require('./logger');

// Create a Registry to register metrics
const register = new prometheus.Registry();

// Add default metrics (CPU, memory, etc.)
prometheus.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestDurationMicroseconds = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

const httpRequestsTotal = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const activeUsers = new prometheus.Gauge({
  name: 'active_users',
  help: 'Number of active users'
});

const productCount = new prometheus.Gauge({
  name: 'product_count',
  help: 'Total number of products'
});

const orderCount = new prometheus.Gauge({
  name: 'order_count',
  help: 'Total number of orders'
});

// Register custom metrics
register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(httpRequestsTotal);
register.registerMetric(activeUsers);
register.registerMetric(productCount);
register.registerMetric(orderCount);

// Monitoring middleware
const monitoringMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const route = req.route ? req.route.path : req.path;
    
    httpRequestDurationMicroseconds
      .labels(req.method, route, res.statusCode.toString())
      .observe(duration / 1000);

    httpRequestsTotal
      .labels(req.method, route, res.statusCode.toString())
      .inc();
  });

  next();
};

// Update metrics periodically
const updateMetrics = async (models) => {
  try {
    const [userCount, products, orders] = await Promise.all([
      models.User.countDocuments({ isActive: true }),
      models.Product.countDocuments(),
      models.Order.countDocuments()
    ]);

    activeUsers.set(userCount);
    productCount.set(products);
    orderCount.set(orders);
  } catch (error) {
    logger.error('Error updating metrics:', error);
  }
};

// Alert configuration
const alertThresholds = {
  highCpuUsage: 80, // percentage
  highMemoryUsage: 85, // percentage
  highResponseTime: 2000, // milliseconds
  errorRate: 5 // percentage
};

// Check system health
const checkSystemHealth = () => {
  const metrics = register.getMetricsAsJSON();
  const alerts = [];

  // Check CPU usage
  const cpuUsage = metrics.find(m => m.name === 'process_cpu_user_seconds_total');
  if (cpuUsage && cpuUsage.value > alertThresholds.highCpuUsage) {
    alerts.push({
      level: 'warning',
      message: `High CPU usage: ${cpuUsage.value}%`
    });
  }

  // Check memory usage
  const memoryUsage = metrics.find(m => m.name === 'process_resident_memory_bytes');
  if (memoryUsage && memoryUsage.value > alertThresholds.highMemoryUsage) {
    alerts.push({
      level: 'warning',
      message: `High memory usage: ${memoryUsage.value}%`
    });
  }

  // Check response time
  const responseTime = metrics.find(m => m.name === 'http_request_duration_seconds');
  if (responseTime && responseTime.value > alertThresholds.highResponseTime) {
    alerts.push({
      level: 'warning',
      message: `High response time: ${responseTime.value}ms`
    });
  }

  return alerts;
};

module.exports = {
  register,
  monitoringMiddleware,
  updateMetrics,
  checkSystemHealth
}; 