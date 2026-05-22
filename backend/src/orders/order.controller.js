const checkoutService = require(
  './checkout.service'
);

const orderService = require(
    './order.service'
);

class OrderController {
  async checkout(req, res, next) {
    try {
      const order =
        await checkoutService.checkout(
          req.user.id,
          req.body
        );

      res.status(201).json({
        success: true,
        message:
          'Order created successfully',
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }
  async getMyOrders(req, res, next) {
  try {
    const orders =
      await orderService.getMyOrders(
        req.user.id
      );

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
      next(error);
    }
}

async getOrderById(req, res, next) {
  try {
    const order =
      await orderService.getOrderById(
        req.user.id,
        req.params.id
      );

    res.status(200).json({
      success: true,
      data: order,
    });
    
  } catch (error) {
      next(error);
    }
}

async getAllOrders(req, res, next) {
  try {
    const orders =
      await orderService.getAllOrders();

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
      next(error);
    }
}

async updateOrderStatus(req, res, next) {
    try {
        const order =
        await orderService.updateOrderStatus(
            req.params.id,
            req.body.status
        );

        res.status(200).json({
        success: true,
        message:
            'Order status updated',
        data: order,
        });
    } catch (error) {
      next(error);
    }
    }
}

module.exports = new OrderController();