const express = require('express');
const router = express.Router();
const productController = require('./product.controller');
const categoryController = require('./category.controller');
const authMiddleware = require('../common/middleware/auth.middleware');
const adminMiddleware = require('../common/middleware/admin.middleware');

router.get('/',productController.getProducts);
router.get('/categories', categoryController.getCategories);
router.get('/:id',productController.getProductById);

// Admin Category CRUD
router.post('/categories', authMiddleware, adminMiddleware, categoryController.createCategory);
router.put('/categories/:id', authMiddleware, adminMiddleware, categoryController.updateCategory);
router.delete('/categories/:id', authMiddleware, adminMiddleware, categoryController.deleteCategory);

module.exports = router;