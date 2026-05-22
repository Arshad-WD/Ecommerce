const cartService = require('./cart.service');

class CartController {
  async getCart(req, res, next) {
    try {
      const cart =
        await cartService.getCart(
          req.user.id
        );

      res.status(200).json({
        success: true,
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  async addItem(req, res, next) {
    try {
      const item =
        await cartService.addItem(
          req.user.id,
          req.body
        );

      res.status(201).json({
        success: true,
        message: 'Item added to cart',
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateItem(req, res, next) {
    try {
      const item =
        await cartService.updateItem(
          req.user.id,
          req.params.productId,
          req.body.quantity
        );

      res.status(200).json({
        success: true,
        message: 'Cart updated',
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  async removeItem(req, res, next) {
    try {
      await cartService.removeItem(
        req.user.id,
        req.params.productId
      );

      res.status(200).json({
        success: true,
        message: 'Item removed',
      });
    } catch (error) {
      next(error);
    }
  }

  async clearCart(req, res, next) {
    try {
      await cartService.clearCart(
        req.user.id
      );

      res.status(200).json({
        success: true,
        message: 'Cart cleared',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CartController();