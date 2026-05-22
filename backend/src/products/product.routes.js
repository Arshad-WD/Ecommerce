const express = require('express');
const router = express.Router();
const productController = require('./product.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const upload = require('../middleware/upload.middleware');

router.get('/',productController.getProducts);

router.get('/:id',productController.getProductById);
router.post('/',authMiddleware,adminMiddleware,productController.createProduct);
router.put('/:id',authMiddleware,adminMiddleware,productController.updateProduct);
router.delete('/:id',authMiddleware,adminMiddleware,productController.deleteProduct);
router.patch('/:id/images', authMiddleware, adminMiddleware, upload.array('images',5), productController.uploadImages),

module.exports = router;