const express = require('express');
const router = express.Router();
const productController = require('./product.controller');
const categoryController = require('./category.controller');

router.get('/',productController.getProducts);
router.get('/categories', categoryController.getCategories);
router.get('/:id',productController.getProductById);

module.exports = router;