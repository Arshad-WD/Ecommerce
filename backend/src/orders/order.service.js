const AppError = require('../common/errors/app-error');
const OrderStatus = require('../common/enums/order-status.enum');
const prisma = require(
  '../prisma/prisma.service'
);

class OrderService {
  async getMyOrders(userId) {
    return await prisma.order.findMany({
      where: {
        userId,
      },

      include: {
        items: true,

        payments: true,
      },

      orderBy: {
        placedAt: 'desc',
      },
    });
  }

  async getOrderById(userId, orderId) {
    const order =
      await prisma.order.findFirst({
        where: {
          id: orderId,

          userId,
        },

        include: {
          items: true,

          payments: true,

          shippingAddress: true,
        },
      });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return order;
  }

  async getAllOrders() {
    return await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        items: true,

        payments: true,

        shippingAddress: true,
      },

      orderBy: {
        placedAt: 'desc',
      },
    });
  }

  async updateOrderStatus(
    orderId,
    status
  ) {
    const allowedStatuses = Object.values(OrderStatus);

    if (
      !allowedStatuses.includes(status)
    ) {
      throw new AppError('Invalid order status', 400);
    }

    return await prisma.order.update({
      where: {
        id: orderId,
      },

      data: {
        status,
      },
    });
  }
}

module.exports = new OrderService();