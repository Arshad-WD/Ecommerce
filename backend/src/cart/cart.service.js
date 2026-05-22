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
        throw new Error(
            'Product is currently unavailable'
        );
    }

    if (data.quantity <= 0) {
    throw new Error('Invalid quantity');
    }

    if (
    data.quantity > product.stockQuantity
    ) {
    throw new Error(
        'Insufficient stock'
    );
    }

    if (!product) {
      throw new Error('Product not found');
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
        throw new Error(
        'Insufficient stock'
        );
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
      throw new Error('Cart item not found');
    }

    if (quantity <= 0) {
    throw new Error('Invalid quantity');
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
    throw new Error(
        'Insufficient stock'
    );
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
      throw new Error('Cart item not found');
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