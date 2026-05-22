const OrderStatus = require('../common/enums/order-status.enum');
const AppError = require('../common/errors/app-error');
const prisma = require(
  '../prisma/prisma.service'
);

class CheckoutService {
  async checkout(userId, data) {
    const cart =
      await prisma.cart.findUnique({
        where: {
          userId,
        },

        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

    if (
      !cart ||
      cart.items.length === 0
    ) {
      throw new AppError('Cart is empty', 400);
    }

    const shippingAddress =
      await prisma.address.findFirst({
        where: {
          id: data.shippingAddressId,
          userId,
        },
      });

    if (!shippingAddress) {
      throw new AppError('Invalid shipping address', 400);
    }

    for (const item of cart.items) {
      if (item.quantity > item.product.stockQuantity) {
        throw new AppError(`${item.product.name} out of stock`, 400);
      }
    }

    let totalAmount = 0;

    for (const item of cart.items) {
      const price =
        item.product.discountPrice ||
        item.product.price;

      totalAmount +=
        Number(price) * item.quantity;
    }

    const result =
      await prisma.$transaction(
        async (tx) => {
          const order =
            await tx.order.create({
              data: {
                userId,

                shippingAddressId:
                  shippingAddress.id,

                billingAddressId:
                  shippingAddress.id,

                status: OrderStatus.PENDING,

                paymentStatus:
                  OrderStatus.PENDING,

                totalAmount,
              },
            });

          for (const item of cart.items) {
            const price =
              item.product.discountPrice ||
              item.product.price;

            const subtotal =
              Number(price) *
              item.quantity;

            await tx.orderItem.create({
              data: {
                orderId: order.id,

                productId:
                  item.product.id,

                productName:
                  item.product.name,

                productPrice:
                  price,

                quantity:
                  item.quantity,

                subtotal,
              },
            });

            await tx.product.update({
              where: {
                id: item.product.id,
              },

              data: {
                stockQuantity: {
                  decrement:
                    item.quantity,
                },
              },
            });
          }

          await tx.payment.create({
            data: {
              orderId: order.id,

              provider: 'RAZORPAY',

              amount: totalAmount,

              currency: 'INR',

              status: OrderStatus.PENDING,
            },
          });

          await tx.cartItem.deleteMany({
            where: {
              cartId: cart.id,
            },
          });

          return order;
        }
      );

    return result;
  }
}

module.exports = new CheckoutService();