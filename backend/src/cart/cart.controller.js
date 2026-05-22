const cartService = require('./cart.service');

class CartController {
  async getCart(req, res) {
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
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async addItem(req, res) {
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
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateItem(req, res) {
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
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async removeItem(req, res) {
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
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async clearCart(req, res) {
    try {
      await cartService.clearCart(
        req.user.id
      );

      res.status(200).json({
        success: true,
        message: 'Cart cleared',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new CartController();