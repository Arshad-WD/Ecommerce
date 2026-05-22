const express = require('express');
const router = express.Router();
const orderController = require(
  './order.controller'
);

const authMiddleware = require(
  '../common/middleware/auth.middleware'
);

const adminMiddleware = require(
  '../common/middleware/admin.middleware'
);

router.post(
  '/checkout',
  authMiddleware,
  orderController.checkout
);
router.get(
  '/orders/my',
  authMiddleware,
  orderController.getMyOrders
);
router.get(
  '/orders/:id',
  authMiddleware,
  orderController.getOrderById
);

router.get(
  '/admin/orders',
  authMiddleware,
  adminMiddleware,
  orderController.getAllOrders
);
router.put(
  '/admin/orders/:id/status',
  authMiddleware,
  adminMiddleware,
  orderController.updateOrderStatus
);
module.exports = router;