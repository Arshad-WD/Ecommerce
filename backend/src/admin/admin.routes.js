const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
const productController = require('../products/product.controller');
const upload = require('../common/middleware/upload.middleware');
const authMiddleware = require('../common/middleware/auth.middleware');
const adminMiddleware = require('../common/middleware/admin.middleware');

// Apply admin auth to all routes in this file
router.use(authMiddleware, adminMiddleware);

// Admin Dashboard Auth Protected
router.get('/me', adminController.getMe);

// Admin Product CRUD
router.post('/products', productController.createProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/images/:imageId', productController.deleteImage);
router.delete('/products/:id', productController.deleteProduct);
router.patch('/products/:id/images', upload.array('images', 5), productController.uploadImages);

// ANALYTICS APIs (Admin)
router.get('/analytics/overview', adminController.getAnalyticsOverview);
router.get('/analytics/sales', adminController.getSalesAnalytics);
router.get('/analytics/top-products', adminController.getTopProducts);
router.get('/analytics/recent-orders', adminController.getRecentOrders);
router.get('/analytics/inventory', adminController.getInventoryAnalytics);

// INVENTORY APIs
// (Mapped to /api/admin/inventory/* based on your spec)
// Note: Put specific routes like 'low-stock' before dynamic params like '/:productId' to avoid conflict
router.get('/inventory', adminController.getInventory);
router.get('/inventory/low-stock', adminController.getLowStock);
router.patch('/inventory/:productId', adminController.updateInventory);

module.exports = router;
