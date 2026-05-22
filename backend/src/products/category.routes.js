const express = require('express');
const router = express.Router();
const categoryController = require('./category.controller');
const authMiddleware = require('../common/middleware/auth.middleware');
const adminMiddleware = require('../common/middleware/admin.middleware');


router.get('/',categoryController.getCategories);
router.get('/:id',categoryController.getCategoryById);

router.post('/',authMiddleware,adminMiddleware,categoryController.createCategory);
router.put('/:id',authMiddleware,adminMiddleware,categoryController.updateCategory);

router.delete('/:id',authMiddleware,adminMiddleware,categoryController.deleteCategory);

module.exports = router;