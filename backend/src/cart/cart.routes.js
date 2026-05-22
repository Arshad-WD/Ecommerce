const express = require('express');
const router = express.Router();
const cartController = require('./cart.controller');
const authMiddleware = require(
  '../middlewares/auth.middleware'
);

router.use(authMiddleware);

router.get(
  '/',
  cartController.getCart
);

router.post(
  '/items',
  cartController.addItem
);

router.put(
  '/items/:productId',
  cartController.updateItem
);

router.delete(
  '/items/:productId',
  cartController.removeItem
);

router.delete(
  '/',
  cartController.clearCart
);

module.exports = router;