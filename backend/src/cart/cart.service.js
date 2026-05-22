const AppError = require('../common/errors/app-error');
const prisma = require('../prisma/prisma.service');

class CartService {
  async getOrCreateCart(userId) {
    let cart = await prisma.cart.findUnique({
      where: {
        userId,
      },

      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
        },

        include: {
          items: true,
        },
      });
    }

    return cart;
  }

  async getCart(userId) {
    return await this.getOrCreateCart(userId);
  }

  async addItem(userId, data) {
    const cart =
      await this.getOrCreateCart(userId);

    const product =
      await prisma.product.findUnique({
        where: {
          id: data.productId,
        },
      });

    if (!product.isActive) {
        throw new AppError('Product is currently unavailable', 500);
    }

    if (data.quantity <= 0) {
    throw new AppError('Invalid quantity', 400);
    }

    if (
    data.quantity > product.stockQuantity
    ) {
    throw new AppError('Insufficient stock', 500);
    }

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const existingItem =
      await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId: data.productId,
        },
      });

    if (existingItem) {
    const totalQuantity =
        existingItem.quantity +
        data.quantity;

    if (
        totalQuantity >
        product.stockQuantity
    ) {
        throw new AppError('Insufficient stock', 500);
    }

    return await prisma.cartItem.update({
        where: {
        id: existingItem.id,
        },

        data: {
        quantity: totalQuantity,
        },
    });
    }

    return await prisma.cartItem.create({
      data: {
        cartId: cart.id,

        productId: data.productId,

        quantity: data.quantity,
      },
    });
  }

  async updateItem(
    userId,
    productId,
    quantity
  ) {
    const cart =
      await this.getOrCreateCart(userId);

    const item =
      await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId,
        },
      });

    if (!item) {
      throw new AppError('Cart item not found', 404);
    }

    if (quantity <= 0) {
    throw new AppError('Invalid quantity', 400);
    }

    const product =
    await prisma.product.findUnique({
        where: {
        id: productId,
        },
    });

    if (
    quantity >
    product.stockQuantity
    ) {
    throw new AppError('Insufficient stock', 500);
    }

    return await prisma.cartItem.update({
      where: {
        id: item.id,
      },

      data: {
        quantity,
      },
    });
  }

  async removeItem(userId, productId) {
    const cart =
      await this.getOrCreateCart(userId);

    const item =
      await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId,
        },
      });

    if (!item) {
      throw new AppError('Cart item not found', 404);
    }

    await prisma.cartItem.delete({
      where: {
        id: item.id,
      },
    });

    return true;
  }

  async clearCart(userId) {
    const cart =
      await this.getOrCreateCart(userId);

    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    return true;
  }
}

module.exports = new CartService();