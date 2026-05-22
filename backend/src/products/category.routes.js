const express = require('express');
const router = express.Router();
const categoryController = require('./category.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');


router.get('/',categoryController.getCategories);
router.get('/:id',categoryController.getCategoryById);

router.post('/',authMiddleware,adminMiddleware,categoryController.createCategory);
router.put('/:id',authMiddleware,adminMiddleware,categoryController.updateCategory);

router.delete('/:id',authMiddleware,adminMiddleware,categoryController.deleteCategory);

module.exports = router;