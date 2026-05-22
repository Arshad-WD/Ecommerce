const express = require('express');
const router = express.Router();

const authController = require('./auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.me);
router.post('/refresh-token', authController.refreshToken);

router.post('/logout', authController.logout);

router.post('/forget-password', authController.forgetPassword);
router.post('/reset-password/:token', authController.resetPassword);

// router.post('/admin', authMiddleware, adminMiddleware, productController.createProduct);

module.exports = router;
